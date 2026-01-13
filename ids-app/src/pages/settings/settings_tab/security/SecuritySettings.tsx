import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useOutletContext, Link } from "react-router-dom";
import { useState } from "react";
import type { DashboardOutletContextProps } from "../../../../types/types";
import { API } from "../../../../context/API";
import { getErrorResponse } from "../../../../context/Callbacks";
import { LuEye, LuEyeOff, LuLogOut } from "react-icons/lu";
import { userChangePasswordValidation } from "../../../../context/ValidationSchema";

export default function SecuritySettings() {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: authUser?._id,
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: userChangePasswordValidation,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await API.post("/auth/change-password", values);
        toast.success(response.data.message || "Password updated successfully");
        resetForm();
      } catch (error) {
        getErrorResponse(error);
      }
    },
  });

  const handleLogout = async () => {
    try {
      const response = await API.get("/auth/logout");
      toast.success(response?.data?.message || "Logged out successfully");
      window.location.reload();
    } catch (error) {
      getErrorResponse(error);
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm">
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[var(--yp-text-primary)]">
            Change Password
          </h2>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="current_password"
                value={formik.values.current_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter current password"
                className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--yp-muted)]"
              >
                {showCurrent ? (
                  <LuEyeOff className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.current_password &&
              formik.errors.current_password && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.current_password}
                </p>
              )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="new_password"
                value={formik.values.new_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--yp-muted)]"
              >
                {showNew ? (
                  <LuEyeOff className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.new_password && formik.errors.new_password && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.new_password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--yp-muted)]"
              >
                {showConfirm ? (
                  <LuEyeOff className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.confirm_password &&
              formik.errors.confirm_password && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.confirm_password}
                </p>
              )}
          </div>

          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="text-sm text-[var(--yp-main)] hover:underline"
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)]"
            >
              {formik.isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>

        <div className="p-6 border-t border-[var(--yp-border-primary)] space-y-4">
          <h2 className="text-lg font-semibold text-[var(--yp-text-primary)]">
            Account Actions
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-[var(--yp-text-primary)] bg-[var(--yp-tertiary)]"
            >
              <LuLogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
