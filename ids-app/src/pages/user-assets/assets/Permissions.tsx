import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type {
  DashboardOutletContextProps,
  ExistingPermissionSet,
  RoleOption,
} from "../../../types/types";
import { getErrorResponse } from "../../../context/Callbacks";
import PermissionList from "./permission-components/PermissionList";
import PermissionCreate from "./permission-components/PermissionCreate";

export default function Permissions() {
  const { roles, allPermissions } =
    useOutletContext<DashboardOutletContextProps>();

  const [isAdding, setIsAdding] = useState<false | ExistingPermissionSet>(
    false
  );

  const [mainRoles, setMainRoles] = useState<RoleOption[]>([]);

  useEffect(() => {
    try {
      const formatted: RoleOption[] = roles.map((r) => ({
        value: r._id,
        label: r.role,
      }));

      setMainRoles(formatted);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [roles]);

  return (
    <div>
      {!isAdding ? (
        <PermissionList
          setIsAdding={setIsAdding}
          allPermissions={allPermissions}
        />
      ) : (
        <PermissionCreate
          setIsAdding={setIsAdding}
          roles={mainRoles}
          isAdding={isAdding}
        />
      )}
    </div>
  );
}
