import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";

import toast from "react-hot-toast";
import { getErrorResponse, getFormikError } from "../../context/Callbacks";
import { phoneInputClass } from "../../common/Extradata";
import { API } from "../../context/API";
import { userCreateValidation } from "../../context/ValidationSchema";
import type { DashboardOutletContextProps } from "../../types/types";

export default function CallerCreate() {
  const redirector = useNavigate();
  const { organization } = useOutletContext<DashboardOutletContextProps>();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      organization_id: organization?._id,
      name: "",
      email: "",
      mobile_no: "",
    },
    validationSchema: userCreateValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await API.post(`/user/create`, values);
        toast.success(response.data.message || "User updated successfully");
        redirector(`/dashboard/users`);
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="Create User"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "User", path: "/dashboard/users" },
          { label: "Create" },
        ]}
      />

      <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm">
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("name")}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                />
                {getFormikError(formik, "name")}
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                />
                {getFormikError(formik, "email")}
              </div>
              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Mobile Number
                </label>
                <PhoneInput
                  country="in"
                  value={String(formik.values.mobile_no || "")}
                  onChange={(phone) => formik.setFieldValue("mobile_no", phone)}
                  inputProps={{ name: "mobile_no", required: false }}
                  inputClass={phoneInputClass?.input}
                  buttonClass={phoneInputClass?.button}
                />
                {getFormikError(formik, "mobile_no")}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-start space-x-3 pt-6 border-t border-[var(--yp-border-primary)]">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
