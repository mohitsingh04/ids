import { useFormik } from "formik";
import HeadingLine from "../../ui/heading/HeadingLine";
import { getErrorResponse, getFormikError } from "../../context/Callbacks";
import { API } from "../../context/API";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../types/types";
import toast from "react-hot-toast";
import { organizationValidation } from "../../context/ValidationSchema";

export default function OrganizationCard() {
  const { organization } = useOutletContext<DashboardOutletContextProps>();

  const formik = useFormik({
    initialValues: {
      organization_name: organization?.organization_name || "",
      members: organization?.members || "",
    },
    validationSchema: organizationValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await API.post("/organization/create", values);
        toast.success(response.data.message);
        window.location.reload();
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const teamSizeOptions = [
    { value: "", label: "Select team size" },
    { value: "1-5", label: "1 - 5 Members" },
    { value: "6-10", label: "6 - 10 Members" },
    { value: "11-25", label: "11 - 25 Members" },
    { value: "26-50", label: "26 - 50 Members" },
    { value: "50+", label: "50+ Members" },
  ];

  return (
    <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm">
      <div className="p-6">
        <HeadingLine title={"Organization Details"} />

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="organization_name"
              className="block text-sm font-medium text-[var(--yp-text-secondary)]"
            >
              Organization Name
            </label>
            <input
              type="text"
              id="organization_name"
              name="organization_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.organization_name}
              disabled={organization?.organization_name ? true : false}
              className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
            />
            {getFormikError(formik, "organization_name")}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="members"
              className="block text-sm font-medium text-[var(--yp-text-secondary)]"
            >
              Number of Members
            </label>
            <select
              id="members"
              name="members"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.members}
              disabled={organization?.members ? true : false}
              className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
            >
              {teamSizeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.value === ""}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {getFormikError(formik, "members")}
          </div>

          {!organization?.organization_name && (
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)] disabled:opacity-50"
            >
              {formik.isSubmitting ? "Saving..." : "Create Organization"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
