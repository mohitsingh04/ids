import type { Column } from "../../../../types/types";
import type { PermissionDoc } from "../../../../types/UserTypes";
import { SimpleTable } from "../../../../ui/table/SimpleTable";

export default function PermissionList({
  setIsAdding,
  allPermissions,
}: {
  setIsAdding: any;
  allPermissions: PermissionDoc[];
}) {
  const columns: Column<{ _id: string; title: string }>[] = [
    { label: "Title", value: "title" },
    {
      label: "Action",
      value: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsAdding(row)}
            className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-success-emphasis)] bg-[var(--yp-success-subtle)]"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[var(--yp-primary)] rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--yp-text-primary)]">
          Permissions
        </h2>
        <button
          onClick={() => setIsAdding("true")}
          className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)]"
        >
          + Add Permission
        </button>
      </div>
      <SimpleTable data={allPermissions} columns={columns} />
    </div>
  );
}
