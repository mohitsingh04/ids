import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import type { DashboardOutletContextProps } from "../../../../types/types";
import { API } from "../../../../context/API";
import {
  getErrorResponse,
  getFormikError,
} from "../../../../context/Callbacks";
import { phoneInputClass } from "../../../../common/Extradata";
import { userUpdateValidation } from "../../../../context/ValidationSchema";

export default function GeneralSettings() {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();

  const formik = useFormik({
    initialValues: {
      name: authUser?.name || "",
      email: authUser?.email || "",
      mobile_no: authUser?.mobile_no || "",
      alt_mobile_no: authUser?.alt_mobile_no || "",
      address: authUser?.address || "",
    },
    enableReinitialize: true,
    validationSchema: userUpdateValidation,
    onSubmit: async (values) => {
      try {
        const response = await API.patch(`/user/${authUser?._id}`, values);
        toast.success(response.data.message);
      } catch (error) {
        getErrorResponse(error);
      }
    },
  });

  return (
    <div className="lg:col-span-3">
      <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm">
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
            />
            {getFormikError(formik, "name")}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
            />
            {getFormikError(formik, "email")}
          </div>

          {/* Mobile No */}
          <div>
            <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
              Mobile No
            </label>
            <PhoneInput
              country="in"
              value={formik.values.mobile_no}
              onChange={(mobile_no) =>
                formik.setFieldValue("mobile_no", mobile_no)
              }
              inputClass={phoneInputClass?.input}
              buttonClass={phoneInputClass?.button}
            />
            {getFormikError(formik, "mobile_no")}
          </div>

          {/* Alternate Mobile No */}
          <div>
            <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
              Alternate Mobile No
            </label>
            <PhoneInput
              country="in"
              value={formik.values.alt_mobile_no?.toString()}
              onChange={(alt_mobile_no) =>
                formik.setFieldValue("alt_mobile_no", alt_mobile_no)
              }
              inputClass={phoneInputClass?.input}
              buttonClass={phoneInputClass?.button}
              dropdownClass={phoneInputClass?.dropdown}
            />
            {getFormikError(formik, "alt_mobile_no")}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)]"
            >
              {formik.isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
