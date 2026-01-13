import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSkeleton from "../ui/loadings/pages/DashboardSkeleton";
import SidebarSkeleton from "../ui/loadings/pages/SidebarSkeleton";
import type { PermissionDoc, RoleProps, UserProps } from "../types/UserTypes";
import { Header } from "../components/header/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { API } from "../context/API";
import { getErrorResponse } from "../context/Callbacks";
import type { OrganizationProps } from "../types/types";

export default function DashboardLayout({
  authUser,
  authLoading,
  getRoleById,
  roles,
  allPermissions,
}: {
  authUser: UserProps | null;
  authLoading: boolean;
  getRoleById: (id: string) => string | undefined;
  roles: RoleProps[];
  allPermissions: PermissionDoc[];
}) {
  const [organization, setOrganization] = useState<OrganizationProps | null>(
    null
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? saved === "true" : false;
  });

  const [status, setStatus] = useState([]);

  const getStatus = useCallback(async () => {
    try {
      const response = await API.get("/status");
      setStatus(response.data || []);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, []);

  useEffect(() => {
    getStatus();
  }, [getStatus]);

  const fetchOrganization = useCallback(async () => {
    if (!authUser?._id) return;
    try {
      const res = await API.get(`/organization/admin/${authUser?._id}`);
      setOrganization(res.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [authUser?._id]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[var(--yp-secondary)] flex">
      {!authLoading ? (
        <Sidebar isCollapsed={sidebarCollapsed} authUser={authUser} />
      ) : (
        <SidebarSkeleton />
      )}

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 z-0 ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <Header
          onToggleCollapse={handleToggleCollapse}
          authUser={authUser}
          isCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-auto bg-[var(--yp-secondary)] p-4 lg:p-6 z-[-1]">
          {!authLoading ? (
            <Outlet
              context={{
                authUser,
                authLoading,
                getRoleById,
                roles,
                allPermissions,
                status,
                getStatus,
                organization,
              }}
            />
          ) : (
            <DashboardSkeleton />
          )}
        </main>
      </div>
    </div>
  );
}
