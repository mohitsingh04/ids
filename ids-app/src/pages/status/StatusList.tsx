import { useCallback, useMemo } from "react";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import TableButton from "../../ui/button/TableButton";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import { API } from "../../context/API";
import type {
  Column,
  DashboardOutletContextProps,
  StatusProps,
} from "../../types/types";
import Swal from "sweetalert2";
import { getErrorResponse, matchPermissions } from "../../context/Callbacks";
import { FaEye } from "react-icons/fa";
import { GiPencil } from "react-icons/gi";
import { DataTable } from "../../ui/table/DataTable";
import { LuPlus, LuTrash2 } from "react-icons/lu";

export default function StatusList() {
  const { authUser, authLoading, status, getStatus } =
    useOutletContext<DashboardOutletContextProps>();

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          const response = await API.delete(`/status/${id}`);
          toast.success(response.data.message || "Deleted successfully");
          getStatus();
        }
      } catch (error) {
        getErrorResponse(error);
      }
    },
    [getStatus]
  );

  const columns = useMemo<Column<StatusProps>[]>(
    () => [
      { value: "status_name" as keyof StatusProps, label: "Name" },
      { value: "parent_status" as keyof StatusProps, label: "Parent Status" },
      {
        label: "Actions",
        value: (row: StatusProps) => (
          <div className="flex space-x-2">
            {!authLoading && (
              <>
                {matchPermissions(authUser?.permissions, "Read Status") && (
                  <TableButton
                    Icon={FaEye}
                    color="blue"
                    size="sm"
                    buttontype="link"
                    href={`/dashboard/status/${row._id}`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Update Status") && (
                  <TableButton
                    Icon={GiPencil}
                    color="green"
                    size="sm"
                    buttontype="link"
                    href={`/dashboard/status/${row._id}/update`}
                  />
                )}
                {matchPermissions(authUser?.permissions, "Delete Status") && (
                  <TableButton
                    Icon={LuTrash2}
                    color="red"
                    size="sm"
                    buttontype="button"
                    onClick={() => handleDelete(row._id)}
                  />
                )}
              </>
            )}
          </div>
        ),
        key: "actions",
      },
    ],
    [handleDelete, authLoading, authUser?.permissions]
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="All Status"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Status" },
        ]}
        extraButtons={[
          {
            label: "Create Status",
            path: "/dashboard/status/create",
            icon: LuPlus,
          },
        ]}
      />

      <DataTable<StatusProps> data={status} columns={columns} />
    </div>
  );
}
