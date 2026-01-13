import { useCallback, useEffect, useState } from "react";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import type { LeadProps } from "../../types/LeadTypes";
import { getErrorResponse } from "../../context/Callbacks";
import { API } from "../../context/API";
import { Link, useParams } from "react-router-dom";
import { PropertyTabs } from "../../ui/tabs/PropertyTabs";
import { TbListDetails } from "react-icons/tb";
import LeadBasicDetails from "./lead_components/base_details/BasicDetails";
import { LuPhoneCall } from "react-icons/lu";
import Summary from "./lead_components/summary/Summary";

export default function LeadView() {
  const { objectId } = useParams();
  const [lead, setLead] = useState<LeadProps | null>(null);

  const getLead = useCallback(async () => {
    try {
      const response = await API.get(`/leads/${objectId}`);
      setLead(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [objectId]);

  useEffect(() => {
    getLead();
  }, [getLead]);

  const tabs = [
    {
      id: "basic-details",
      label: "Basic Details",
      icon: TbListDetails,
      component: <LeadBasicDetails lead={lead} />,
      online: false,
    },
    {
      id: "summary",
      label: "Summary",
      icon: TbListDetails,
      component: <Summary lead={lead} />,
      online: false,
    },
    {
      id: "activity",
      label: "Activity",
      icon: TbListDetails,
      component: <LeadBasicDetails lead={lead} />,
      online: false,
    },
    {
      id: "follow-ups",
      label: "Follow Ups",
      icon: TbListDetails,
      component: <LeadBasicDetails lead={lead} />,
      online: false,
    },
  ];

  return (
    <div>
      <Breadcrumbs
        title="Lead"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Lead", path: "/dashboard/leads" },
          { label: lead?.name || "Lead" },
        ]}
      />

      <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm mb-6 p-6 relative">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-[var(--yp-secondary)] shadow-inner rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-[var(--yp-text-primary)] font-bold text-2xl">
              {lead?.name?.charAt(0).toUpperCase() || "P"}
            </span>
          </div>

          <div className="flex-1 flex justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[var(--yp-text-primary)] flex items-center gap-2">
                  {lead?.name}
                </h1>
              </div>

              <p className="text-[var(--yp-muted)]">{lead?.email || ""}</p>
            </div>
          </div>
        </div>
        <Link
          to={`/dashboard/lead/conversation/${lead?._id}`}
          title="Start Conversation"
          className="absolute bottom-4 right-4 text-[var(--yp-muted)] hover:text-[var(--yp-accent)] transition flex items-center gap-1 text-sm"
        >
          <span>Start Conversation</span>
          <LuPhoneCall />
        </Link>
      </div>

      <PropertyTabs tabs={tabs?.filter((item) => !item?.online)} />
    </div>
  );
}
