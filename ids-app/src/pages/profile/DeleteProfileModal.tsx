"use client";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import type { UserProps } from "../../types/UserTypes";
import { API } from "../../context/API";
import { getErrorResponse } from "../../context/Callbacks";

type DeleteProfileModalProps = {
  onClose: () => void;
  profile: UserProps | null;
};

export const DeleteProfileModal = ({
  profile,
  onClose,
}: DeleteProfileModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.delete(
        `/user/avatar/${profile?._id || 1}`
      );
      toast.success(response.data.message);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      onClose();
      setLoading(false);
      window.location.reload();
    }
  }, [onClose, profile]);

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--yp-primary)] rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[var(--yp-text-primary)] mb-4">
            Delete Profile Image
          </h2>
          <p className="text-[var(--yp-muted)] mb-6">
            Are you sure you want to delete your profile image? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-danger-emphasis)] bg-[var(--yp-danger-subtle)] hover:opacity-90 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProfile}
              disabled={loading}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)] hover:opacity-90 transition"
            >
              {loading ? "Deleting..." : "Delete Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
