import { useCallback, useEffect, useState } from "react";
import ToggleButton from "../../../ui/button/ToggleButton";
import toast from "react-hot-toast";
import type {
  PermissionDoc,
  PermissionItem,
  UserProps,
} from "../../../types/UserTypes";
import { API } from "../../../context/API";
import { getErrorResponse } from "../../../context/Callbacks";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/types";

export default function UserPermissions({ user }: { user: UserProps | null }) {
  const { allPermissions } = useOutletContext<DashboardOutletContextProps>();

  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getPermissions = useCallback(() => {
    try {
      if (!allPermissions || allPermissions.length === 0) return;

      setSelectedCategory(allPermissions[0]._id);

      if (!user || !user.permissions?.length) return;

      const selected: Record<string, string[]> = {};

      allPermissions.forEach((group: PermissionDoc) => {
        const matched = group.permissions
          .filter((p: PermissionItem) => user.permissions.includes(p._id))
          .map((p: PermissionItem) => p._id);

        if (matched.length > 0) {
          selected[group._id] = matched;
        }
      });

      setSelectedPermissions(selected);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [user, allPermissions]);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  const handleSelectAllByTitle = (groupId: string, value: boolean) => {
    setSelectedPermissions((prev) => {
      const updated = { ...prev };

      if (value) {
        const target = allPermissions.find(
          (p: PermissionDoc) => p._id === groupId
        );
        updated[groupId] = target ? target.permissions.map((p) => p._id) : [];
      } else {
        updated[groupId] = [];
      }

      return updated;
    });
  };

  const handleTogglePermission = (groupId: string, permissionId: string) => {
    setSelectedPermissions((prev) => {
      const list = prev[groupId] || [];
      const updated = list.includes(permissionId)
        ? list.filter((id) => id !== permissionId)
        : [...list, permissionId];

      return { ...prev, [groupId]: updated };
    });
  };

  const handleUpdatePermissions = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const permissions = Object.values(selectedPermissions).flat();

      const response = await API.patch(`/user/${user._id}/permissions`, {
        permissions,
      });

      toast.success(
        response.data.message || "Permissions updated successfully"
      );
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row bg-[var(--yp-secondary)] rounded-xl overflow-hidden">
        {/* Mobile Tabs */}
        <div className="lg:hidden border-b bg-[var(--yp-tertiary)] overflow-x-auto">
          <div className="flex space-x-3 px-3 py-2 min-w-max">
            {allPermissions.map((group: PermissionDoc) => (
              <button
                key={group._id}
                onClick={() => setSelectedCategory(group._id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === group._id
                    ? "bg-[var(--yp-main-subtle)] text-[var(--yp-main-emphasis)]"
                    : "text-[var(--yp-main-subtle)]"
                }`}
              >
                {group.title} ({group.permissions.length})
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[var(--yp-tertiary)]">
          <ul className="w-full capitalize">
            {allPermissions.map((group: PermissionDoc) => (
              <li
                key={group._id}
                onClick={() => setSelectedCategory(group._id)}
                className={`px-5 py-3 cursor-pointer ${
                  selectedCategory === group._id
                    ? "bg-[var(--yp-main-subtle)] text-[var(--yp-main-emphasis)]"
                    : "text-[var(--yp-main-subtle)]"
                }`}
              >
                {group.title}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {allPermissions
            .filter((g) => g._id === selectedCategory)
            .map((group: PermissionDoc) => {
              const allSelected =
                selectedPermissions[group._id]?.length ===
                group.permissions.length;

              return (
                <div key={group._id}>
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold capitalize text-[var(--yp-main)]">
                      {group.title}
                    </h3>
                    <ToggleButton
                      label="Select All"
                      enabled={allSelected}
                      onToggle={(v) => handleSelectAllByTitle(group._id, v)}
                    />
                  </div>

                  <ul className="space-y-3 capitalize text-[var(--yp-main-subtle)]">
                    {group.permissions.map((perm: PermissionItem) => (
                      <li key={perm._id} className="flex justify-between ">
                        <span>{perm.title}</span>
                        <ToggleButton
                          enabled={selectedPermissions[group._id]?.includes(
                            perm._id
                          )}
                          onToggle={() =>
                            handleTogglePermission(group._id, perm._id)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
        </main>
      </div>

      <div className="text-end mt-4">
        <button
          disabled={loading}
          onClick={handleUpdatePermissions}
          className="px-6 py-2 rounded bg-[var(--yp-main-subtle)] text-[var(--yp-main-emphasis)]"
        >
          {loading ? "Updating..." : "Update Permissions"}
        </button>
      </div>
    </div>
  );
}
