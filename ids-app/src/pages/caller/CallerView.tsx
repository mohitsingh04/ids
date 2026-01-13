import { useCallback, useEffect, useState } from "react";

import { useOutletContext, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import UserViewSkeleton from "../../ui/loadings/pages/UserViewSkeleton";
import { TbLocation } from "react-icons/tb";
import type { UserProps } from "../../types/UserTypes";
import type { DashboardOutletContextProps } from "../../types/types";
import { API } from "../../context/API";
import { getErrorResponse } from "../../context/Callbacks";
import { Tabs } from "../../ui/tabs/Tabs";
import { FaUser } from "react-icons/fa";
import UserBasicDetails from "./tabs/BasicDetails";
import UserLocationDetails from "./tabs/Location";

export default function CallerView() {
  const { objectId } = useParams();
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const { getRoleById } = useOutletContext<DashboardOutletContextProps>();

  const getUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/user/${objectId}`);
      const data = response.data;
      setUserData({ ...data, role: getRoleById(data.role) });
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [objectId, getRoleById]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const tabs = [
    {
      id: "basic-details",
      label: "Basic Details",
      icon: FaUser,
      content: <UserBasicDetails user={userData} />,
    },
    {
      id: "location",
      label: "Location",
      icon: TbLocation,
      content: <UserLocationDetails user={userData} />,
    },
  ];

  if (loading) return <UserViewSkeleton />;

  return (
    <div>
      <div className="space-y-6">
        <Breadcrumbs
          title="Caller"
          breadcrumbs={[
            {
              label: "Dashboard",
              path: "/dashboard",
            },
            {
              label: "Caller",
              path: "/dashboard/callers",
            },
            { label: userData?.name || "Caller" },
          ]}
        />
        <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-4 md:space-x-6">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 mx-auto md:mx-0">
            <img
              src={
                userData?.avatar?.[0]
                  ? `${import.meta.env.VITE_MEDIA_URL}/${userData.avatar[0]}`
                  : "/img/default-images/yp-user.webp"
              }
              alt={userData?.name || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-0 capitalize">
            <h1 className="text-2xl font-bold text-[var(--yp-text-primary)]">
              {userData?.name}
            </h1>
            <p className="text-[var(--yp-muted)]">{userData?.role || ""}</p>
          </div>
        </div>

        <Tabs tabs={tabs} defaultActive="basic-details" />
      </div>
    </div>
  );
}
