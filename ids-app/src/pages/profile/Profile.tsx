import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import {
  formatDateWithoutTime,
  getStatusColor,
  maskSensitive,
} from "../../context/Callbacks";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { RiEdit2Line } from "react-icons/ri";
import {
  LuCalendar,
  LuGlobe,
  LuLocate,
  LuLocateFixed,
  LuMail,
  LuMap,
  LuMapPin,
  LuPhone,
  LuTrash2,
} from "react-icons/lu";
import Badge from "../../ui/badge/Badge";
import { formatDistanceToNow } from "date-fns";
import ProfileCropModal from "./ProfileCropModal";
import { DeleteProfileModal } from "./DeleteProfileModal";
import UserViewSkeleton from "../../ui/loadings/pages/UserViewSkeleton";
import type { DashboardOutletContextProps } from "../../types/types";
import OrganizationCard from "./OrganizationCard";
import HeadingLine from "../../ui/heading/HeadingLine";

export default function Profile() {
  const { authUser, authLoading } =
    useOutletContext<DashboardOutletContextProps>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setSelectedImage(result);
        }
        setOriginalFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  if (authLoading) return <UserViewSkeleton />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title={"Profile"}
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Profile" },
        ]}
        extraButtons={[
          {
            label: "Edit Profile",
            icon: RiEdit2Line,
            path: "/dashboard/settings",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[var(--yp-primary)] rounded-xl">
            <div className="p-6">
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--yp-primary)] rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-2 mb-6 md:mb-0">
                  <div className="relative mx-auto sm:mx-0 mb-4 sm:mb-0 w-24 h-24">
                    <img
                      src={
                        authUser?.avatar?.[0]
                          ? `${import.meta.env.VITE_MEDIA_URL}/${
                              authUser.avatar[0]
                            }`
                          : "/img/default-images/yp-user.webp"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-lg object-cover border-4 border-[var(--yp-border-primary)] shadow-sm"
                    />

                    {/* Bottom Right Buttons */}
                    <div className="absolute -bottom-3 right-0 flex items-center space-x-1">
                      {/* Upload */}
                      <label className="p-1.5 rounded-full bg-[var(--yp-gray-subtle)] text-[var(--yp-gray-emphasis)] shadow-sm hover:opacity-90 transition cursor-pointer border border-[var(--yp-gray-emphasis)]">
                        <RiEdit2Line className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>

                      {/* Delete */}
                      {authUser?.avatar?.[0] && (
                        <button
                          onClick={() => setShowDeleteProfileModal(true)}
                          className="p-1.5 rounded-full bg-[var(--yp-danger-subtle)] text-[var(--yp-danger-emphasis)] shadow-sm hover:opacity-90 transition border border-[var(--yp-danger-emphasis)]"
                        >
                          <LuTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center sm:text-left capitalize">
                    <h3 className="text-2xl font-bold text-[var(--yp-text-primary)]">
                      {authUser?.name}
                    </h3>
                    <p className="text-[var(--yp-muted)] text-sm">
                      {authUser?.role}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                      <Badge
                        label={authUser?.status}
                        color={getStatusColor(authUser?.status || "")}
                      />
                      {authUser?.verified && (
                        <Badge
                          label={authUser?.verified ? "Verified" : "Unverified"}
                          color={authUser?.verified ? "green" : "red"}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedImage && (
                <ProfileCropModal
                  profile={authUser}
                  image={selectedImage}
                  onClose={() => setSelectedImage(null)}
                  originalFileName={originalFileName}
                />
              )}
              {showDeleteProfileModal && (
                <DeleteProfileModal
                  profile={authUser}
                  onClose={() => setShowDeleteProfileModal(false)}
                />
              )}
              <div className="bg-[var(--yp-secondary)] rounded-lg p-6">
                <HeadingLine title="Contact Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <LuMail className="w-5 h-5 text-[var(--yp-muted)]" />
                    <div>
                      <p className="text-sm text-[var(--yp-muted)]">Email</p>
                      <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                        {maskSensitive(authUser?.email || "")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <LuPhone className="w-5 h-5 text-[var(--yp-muted)]" />
                    <div>
                      <p className="text-sm text-[var(--yp-muted)]">
                        Mobile No
                      </p>
                      <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                        {maskSensitive(authUser?.mobile_no || "")}
                      </p>
                    </div>
                  </div>
                  {authUser?.address && (
                    <div className="flex items-center space-x-3">
                      <LuLocate className="w-5 h-5 text-[var(--yp-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--yp-muted)]">
                          address
                        </p>
                        <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                          {authUser?.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {authUser?.pincode && (
                    <div className="flex items-center space-x-3">
                      <LuLocateFixed className="w-5 h-5 text-[var(--yp-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--yp-muted)]">
                          pincode
                        </p>
                        <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                          {authUser?.pincode}
                        </p>
                      </div>
                    </div>
                  )}
                  {authUser?.city && (
                    <div className="flex items-center space-x-3">
                      <LuMapPin className="w-5 h-5 text-[var(--yp-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--yp-muted)]">City</p>
                        <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                          {authUser?.city}
                        </p>
                      </div>
                    </div>
                  )}
                  {authUser?.state && (
                    <div className="flex items-center space-x-3">
                      <LuMap className="w-5 h-5 text-[var(--yp-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--yp-muted)]">state</p>
                        <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                          {authUser?.state}
                        </p>
                      </div>
                    </div>
                  )}
                  {authUser?.country && (
                    <div className="flex items-center space-x-3">
                      <LuGlobe className="w-5 h-5 text-[var(--yp-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--yp-muted)]">
                          Country
                        </p>
                        <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                          {authUser?.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[var(--yp-secondary)] rounded-lg p-6 mt-6">
                <HeadingLine title="Account Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <LuCalendar className="w-5 h-5 text-[var(--yp-muted)]" />
                    <div>
                      <p className="text-sm text-[var(--yp-muted)]">
                        Join Date
                      </p>
                      <p className="text-sm font-medium text-[var(--yp-text-primary)]">
                        {formatDateWithoutTime(authUser?.createdAt || "")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm">
            <div className="p-6">
              <HeadingLine title="About User" />
              <div className="grid grid-cols-1 gap-4">
                {authUser?.createdAt && (
                  <div className="text-center">
                    <p className="text-2xl font-bold capitalize text-[var(--yp-main)]">
                      {formatDistanceToNow(new Date(authUser?.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="text-sm text-[var(--yp-muted)]">Old User</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-2xl font-bold capitalize text-[var(--yp-main)]">
                    {authUser?.role}
                  </p>
                  <p className="text-sm text-[var(--yp-muted)]">Role</p>
                </div>
              </div>
            </div>
          </div>
          <OrganizationCard />
        </div>
      </div>
    </div>
  );
}
