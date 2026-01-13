import { useCallback, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import toast from "react-hot-toast";
import UserEditSkeleton from "../../ui/loadings/pages/UserEditSkeleton";
import type {
  CityProps,
  DashboardOutletContextProps,
  StateProps,
} from "../../types/types";
import type { UserProps } from "../../types/UserTypes";
import { API } from "../../context/API";
import {
  getErrorResponse,
  getFormikError,
  getStatusAccodingToField,
} from "../../context/Callbacks";
import { phoneInputClass } from "../../common/Extradata";
import useGetLocations from "../../hooks/useGetLocations";
import { userEditValidation } from "../../context/ValidationSchema";

export default function UserEdit() {
  const { objectId } = useParams();
  const redirector = useNavigate();
  const { status } = useOutletContext<DashboardOutletContextProps>();
  const [user, setUser] = useState<UserProps | null>(null);
  const [filteredStates, setFilteredStates] = useState<StateProps[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles } = useOutletContext<DashboardOutletContextProps>();
  const { city, state, country } = useGetLocations();

  const getUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/user/${objectId}`);
      setUser(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [objectId]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      mobile_no: user?.mobile_no || "",
      alt_mobile_no: user?.alt_mobile_no || "",
      address: user?.address || "",
      pincode: user?.pincode || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      role: user?.role || "",
      status: user?.status || "",
      verified: user?.verified || false,
    },
    validationSchema: userEditValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const payload = { ...values };
        const locationPayload = {
          userId: user?._id,
          address: values?.address,
          pincode: values?.pincode,
          city: values?.city,
          state: values?.state,
          country: values?.country,
        };

        const response = await API.patch(`/user/${objectId}/update`, payload);
        const LocResponse = await API.patch(
          `/user/update/location`,
          locationPayload
        );

        toast.success(response.data.message || "User updated successfully");
        toast.success(LocResponse.data.message || "User updated successfully");
        redirector(`/dashboard/user/${objectId}`);
        window.location.reload();
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const filtred = state?.filter(
      (s) => s?.country_name === formik.values.country
    );
    setFilteredStates(filtred);
  }, [formik.values.country, state]);

  useEffect(() => {
    const filtred = city?.filter((s) => s?.state_name === formik.values.state);
    setFilteredCities(filtred);
  }, [formik.values.state, city]);

  const handleVerifiedToggle = () => {
    formik.setFieldValue("verified", !formik.values.verified);
  };

  if (loading) return <UserEditSkeleton />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="Edit User"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "User", path: "/dashboard/users" },
          { label: user?.name || "", path: `/dashboard/user/${objectId}` },
          { label: "Edit" },
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
              {/* Alt Mobile */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Alternate Mobile Number
                </label>
                <PhoneInput
                  country="in"
                  value={String(formik.values.alt_mobile_no || "")}
                  onChange={(phone) =>
                    formik.setFieldValue("alt_mobile_no", phone)
                  }
                  inputClass={phoneInputClass?.input}
                  buttonClass={phoneInputClass?.button}
                  inputProps={{
                    name: "alt_mobile_no",
                    required: false,
                  }}
                />
                {getFormikError(formik, "alt_mobile_no")}
              </div>
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("address")}
                  placeholder="Enter Address"
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                />
                {getFormikError(formik, "address")}
              </div>
              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("pincode")}
                  placeholder="Enter pincode"
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                />
                {getFormikError(formik, "pincode")}
              </div>
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Country
                </label>
                <select
                  {...formik.getFieldProps("country")}
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                >
                  <option value="">Select Country</option>
                  {country?.map((c, index) => (
                    <option key={index} value={c?.country_name}>
                      {c?.country_name}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "country")}
              </div>
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  State
                </label>
                <select
                  {...formik.getFieldProps("state")}
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                  disabled={!formik.values.country}
                >
                  <option value="">Select State</option>
                  {filteredStates?.map((s, index) => (
                    <option key={index} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "state")}
              </div>
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  City
                </label>
                <select
                  {...formik.getFieldProps("city")}
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                  disabled={!formik.values.state}
                >
                  <option value="">Select City</option>
                  {filteredCities?.map((c, index) => (
                    <option key={index} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "city")}
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Role
                </label>
                <select
                  {...formik.getFieldProps("role")}
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                >
                  <option value="" disabled>
                    -- Select Role --
                  </option>
                  {roles?.map((item, index) => (
                    <option value={item?._id} key={index}>
                      {item?.role}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "role")}
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Status
                </label>
                <select
                  {...formik.getFieldProps("status")}
                  className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                >
                  <option value="" disabled>
                    -- Select Status --
                  </option>
                  {getStatusAccodingToField(status, "user").map((s, index) => (
                    <option key={index} value={s.parent_status}>
                      {s.parent_status}
                    </option>
                  ))}
                </select>
                {getFormikError(formik, "status")}
              </div>
              {/* Verified Toggle */}
              <div className="flex items-center space-x-4 mt-4 md:col-span-2">
                <span className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                  Verified User
                </span>
                <button
                  type="button"
                  onClick={handleVerifiedToggle}
                  className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${
                    formik.values.verified
                      ? "bg-[var(--yp-success-subtle)]"
                      : "bg-[var(--yp-text-secondary)]"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform bg-[var(--yp-primary)] rounded-full shadow-md transition-transform duration-300 ${
                      formik.values.verified ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
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
