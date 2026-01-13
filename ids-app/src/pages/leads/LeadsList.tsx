import { useState, useMemo, useCallback, useEffect } from "react";

import Badge from "../../ui/badge/Badge";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { useOutletContext } from "react-router-dom";
import TableSkeletonWithCards from "../../ui/loadings/pages/TableSkeletonWithCards";
import type { Column, DashboardOutletContextProps } from "../../types/types";
import { API } from "../../context/API";
import {
  getErrorResponse,
  getFieldDataSimple,
  getLeadStatus,
  getLeadStatusColor,
  getStatusColor,
  maskSensitive,
  matchPermissions,
} from "../../context/Callbacks";
import type { IconType } from "react-icons/lib";
import { colorsData } from "../../common/Extradata";
import {
  LuEye,
  LuUserCheck,
  LuUserMinus,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";
import TableButton from "../../ui/button/TableButton";
import DashboardCard from "../../ui/cards/DashboardCard";
import { DataTable } from "../../ui/table/DataTable";
import type { LeadProps } from "../../types/LeadTypes";

export default function LeadList() {
  const [allLead, setAllLead] = useState<LeadProps[]>([]);
  const { authUser, authLoading, organization } =
    useOutletContext<DashboardOutletContextProps>();

  const [loading, setLoading] = useState(true);

  const getallLeads = useCallback(async () => {
    setLoading(true);
    if (!organization?._id) return;
    try {
      const [leadRes, leadConvoRes] = await Promise.allSettled([
        API.get(`/leads/organization/${organization?._id}`),
        API.get("/lead/conversation"),
      ]);
      if (leadRes.status !== "fulfilled") throw leadRes.reason;
      const allLeadsDoc = leadRes?.value?.data;
      const allLeadsConvoDoc =
        leadConvoRes?.status === "fulfilled" ? leadConvoRes?.value?.data : [];

      const finalDataS = allLeadsDoc?.map((ld: LeadProps) => {
        const matchedLeadConvo = allLeadsConvoDoc.find(
          (ldconvo: any) => String(ldconvo?.lead_id) === String(ld?._id)
        );

        return {
          ...ld,
          overallLeadScore: matchedLeadConvo?.overallLeadScore || "N/A",
        };
      });
      setAllLead(finalDataS);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [organization?._id]);

  useEffect(() => {
    getallLeads();
  }, [getallLeads]);

  const roleIcons: IconType[] = [LuUsers, LuUserCheck, LuUserPlus, LuUserMinus];

  const cardData = getFieldDataSimple(allLead, "status").map((item, index) => ({
    title: item.title,
    value: item.value,
    icon: roleIcons[index % roleIcons.length],
    iconColor: colorsData[index % colorsData.length],
    percentage: Math.round((item?.value / (allLead?.length || 1)) * 100),
  }));

  const columns = useMemo<Column<LeadProps>[]>(
    () => [
      {
        value: (row: LeadProps) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{row?.name}</p>
            <p className="text-xs">{maskSensitive(row?.email)}</p>
          </div>
        ),
        label: "User",
        key: "user",
        sortingKey: "name",
      },
      {
        value: (row: LeadProps) => <p>{maskSensitive(row?.mobile_no)}</p>,
        label: "Mobile Number",
        key: "mobile_no",
        sortingKey: "mobile_no",
      },
      {
        value: (row: LeadProps) => (
          <Badge label={row.status || ""} color={getStatusColor(row?.status)} />
        ),
        label: "Status",
        key: "status",
        sortingKey: "status",
      },
      {
        value: (row: LeadProps) => (
          <div>
            {row?.overallLeadScore !== "N/A" ? (
              <Badge
                label={
                  <p>
                    {getLeadStatus(Number(row?.overallLeadScore))} (
                    {row?.overallLeadScore}
                    %)
                  </p>
                }
                color={getLeadStatusColor(Number(row?.overallLeadScore))}
              />
            ) : (
              <Badge label={"Fresh Lead"} color="green" />
            )}
          </div>
        ),
        label: "System Anaylsis",
        key: "overallLeadScore",
        sortingKey: "overallLeadScore",
      },
      {
        label: "Actions",
        value: (row: LeadProps) => (
          <div className="flex space-x-2">
            {!authLoading && (
              <>
                {matchPermissions(authUser?.permissions, "Read Lead") && (
                  <TableButton
                    Icon={LuEye}
                    color="blue"
                    size="sm"
                    buttontype="link"
                    href={`/dashboard/lead/${row._id}`}
                  />
                )}
              </>
            )}
          </div>
        ),
        key: "actions",
      },
    ],
    [authLoading, authUser?.permissions]
  );

  const tabFilters = useMemo(() => {
    const uniqueOptions = (field: keyof LeadProps) =>
      Array.from(
        new Set(
          allLead
            ?.map((u) => u[field])
            ?.filter(Boolean)
            ?.map((v) => String(v))
        )
      );

    return [
      {
        label: "status",
        columns: columns.map((c) => c.label),
        filterField: "status" as keyof LeadProps,
        options: uniqueOptions("status"),
      },
      {
        label: "verified",
        columns: columns.map((c) => c.label),
        filterField: "verified" as keyof LeadProps,
        options: uniqueOptions("verified"),
      },
      {
        label: "role",
        columns: columns.map((c) => c.label),
        filterField: "role" as keyof LeadProps,
        options: uniqueOptions("role"),
      },
    ];
  }, [allLead, columns]);

  if (loading) {
    return <TableSkeletonWithCards />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="All Leads"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "leads" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card?.title}
            value={card?.value}
            iconColor={card?.iconColor}
            percentage={card?.percentage}
            icon={card?.icon}
          />
        ))}
      </div>
      <DataTable<LeadProps>
        data={allLead}
        columns={columns}
        tabFilters={tabFilters}
        includeExportFields={["name", "email"]}
        searchFields={["name"]}
      />
    </div>
  );
}
