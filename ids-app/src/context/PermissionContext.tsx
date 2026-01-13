import { Navigate } from "react-router-dom";
import DashboardSkeleton from "../ui/loadings/pages/DashboardSkeleton";
import type { ReactNode } from "react";
import type { UserProps } from "../types/UserTypes";

type PermissionContextProps = {
  children: ReactNode;
  authLoading: boolean;
  authUser: UserProps | null;
  permission?: string | null;
};

export default function PermissionContext({
  children,
  authUser,
  permission,
  authLoading,
}: PermissionContextProps) {
  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!authUser) {
    return <Navigate to="/dashboard/access-denied" />;
  }

  if (!permission) {
    return children;
  }

  if (!authUser.permissions?.includes(permission)) {
    return <Navigate to="/dashboard/access-denied" />;
  }

  return children;
}
