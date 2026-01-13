import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import toast from "react-hot-toast";
import { API } from "../../../../context/API";
import {
  getErrorResponse,
  getFormikError,
} from "../../../../context/Callbacks";
import { SimpleTable } from "../../../../ui/table/SimpleTable";
import type {
  Column,
  ExistingPermissionSet,
  RoleOption,
} from "../../../../types/types";
import { reactSelectDesignClass } from "../../../../common/Extradata";

type PermissionItem = {
  title: string;
  description?: string;
};

export default function PermissionCreate({
  setIsAdding,
  roles,
  isAdding,
}: {
  setIsAdding: React.Dispatch<
    React.SetStateAction<false | ExistingPermissionSet>
  >;
  roles: RoleOption[];
  isAdding: false | ExistingPermissionSet;
}) {
  const editingPermission: ExistingPermissionSet | null = useMemo(() => {
    return typeof isAdding === "object" && isAdding !== null ? isAdding : null;
  }, [isAdding]);

  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [permTitle, setPermTitle] = useState("");
  const [permDesc, setPermDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPermission?.permissions) {
      setPermissions(editingPermission.permissions);
    } else {
      setPermissions([]);
    }
  }, [editingPermission]);

  const formik = useFormik({
    initialValues: {
      title: editingPermission?.title ?? "",
      roles: editingPermission?.roles
        ? roles.filter((r: RoleOption) =>
            editingPermission.roles!.some((roleId) =>
              typeof roleId === "string"
                ? roleId === r.value
                : roleId._id === r.value
            )
          )
        : [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Module title is required"),
      roles: Yup.array()
        .min(1, "Select at least one role")
        .of(
          Yup.object({
            value: Yup.string().required(),
            label: Yup.string().required(),
          })
        ),
    }),
    onSubmit: async (values) => {
      if (permissions.length === 0) {
        toast.error("Add at least one permission before saving.");
        return;
      }

      try {
        setLoading(true);

        const roleIds = values.roles.map((r: RoleOption) => r.value);

        const response = await API.post("/user/permissions", {
          title: values.title,
          roles: roleIds,
          permissions,
        });

        toast.success(
          response.data.message || "Permission set created successfully"
        );

        formik.resetForm();
        setPermissions([]);
        setIsAdding(false);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAddPermission = () => {
    if (!permTitle.trim()) {
      alert("Enter permission title");
      return;
    }

    if (permissions.some((p) => p.title === permTitle.trim())) {
      toast.error("Permission already exists.");
      return;
    }

    setPermissions((prev) => [
      ...prev,
      {
        title: permTitle.trim(),
        description: permDesc.trim(),
      },
    ]);

    setPermTitle("");
    setPermDesc("");
  };

  const handleRemovePermission = (title: string) => {
    setPermissions((prev) => prev.filter((perm) => perm.title !== title));
  };

  const columns: Column<PermissionItem>[] = [
    { label: "Title", value: "title" },
    { label: "Description", value: "description" },
    {
      label: "Action",
      value: (row) => (
        <button
          type="button"
          onClick={() => handleRemovePermission(row.title)}
          className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-danger-emphasis)] bg-[var(--yp-danger-subtle)]"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[var(--yp-primary)] rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[var(--yp-text-primary)]">
        {editingPermission ? "Edit Permission Set" : "Create Permission Set"}
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-1">
            Title (Module)
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Property"
            className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFormikError(formik, "title")}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-1">
            Roles
          </label>
          <Select
            isMulti
            options={roles}
            value={formik.values.roles}
            onChange={(selected) => formik.setFieldValue("roles", selected)}
            onBlur={() => formik.setFieldTouched("roles", true)}
            classNames={reactSelectDesignClass}
            placeholder="Select one or more roles"
          />
          {getFormikError(formik, "roles")}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--yp-text-secondary)]">
            Add Permission
          </h3>

          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Permission title (e.g., Create Property)"
              value={permTitle}
              onChange={(e) => setPermTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
            />
            <textarea
              placeholder="Description (optional)"
              value={permDesc}
              onChange={(e) => setPermDesc(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
              rows={2}
            />
          </div>

          <button
            type="button"
            onClick={handleAddPermission}
            className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-success-emphasis)] bg-[var(--yp-success-subtle)]"
          >
            + Add Permission
          </button>
        </div>

        {permissions.length > 0 && (
          <SimpleTable data={permissions} columns={columns} />
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)]"
          >
            {loading
              ? "Saving..."
              : editingPermission
              ? "Update Permission Set"
              : "Create Permission Set"}
          </button>

          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-danger-emphasis)] bg-[var(--yp-danger-subtle)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
