import React, { useRef, useState } from "react";
import { Cropper, type CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { LuX } from "react-icons/lu";
import { createPortal } from "react-dom";
import type { UserProps } from "../../types/UserTypes";
import { API } from "../../context/API";
import { getErrorResponse } from "../../context/Callbacks";

interface ProfileCropModalProps {
  image: string;
  onClose: () => void;
  profile: UserProps | null;
  originalFileName: string;
}

const ProfileCropModal: React.FC<ProfileCropModalProps> = ({
  image,
  onClose,
  profile,
  originalFileName,
}) => {
  const cropperRef = useRef<CropperRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const cropper = cropperRef.current;

    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        canvas.toBlob(
          async (blob: Blob | null) => {
            if (!blob) return;

            const formData = new FormData();
            formData.append("avatar", blob, originalFileName);

            try {
              await API.patch(`/user/avatar/${profile?._id}`, formData);
              window.location.reload();
            } catch (error) {
              getErrorResponse(error);
            } finally {
              setIsLoading(false);
            }
          },
          "image/jpeg",
          0.9
        );
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--yp-primary)] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--yp-primart)] px-6 py-4 border-b border-[var(--yp-border-primary)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--yp-text-primary)]">
            Profile Image Cropper
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--yp-text-primary)] p-2 rounded-lg transition-all"
          >
            <LuX className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="relative bg-[var(--yp-primary)] rounded-xl mb-6 overflow-hidden border-2 border-[var(--yp-border-primary)] flex justify-center items-center">
            <div className="w-full max-w-md aspect-square">
              <Cropper
                ref={cropperRef}
                src={image}
                className="cropper w-full h-full"
                stencilProps={{
                  aspectRatio: 1,
                  movable: true,
                  resizable: true,
                }}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-danger-emphasis)] bg-[var(--yp-danger-subtle)] hover:opacity-90 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)] hover:opacity-90 transition"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ProfileCropModal;
