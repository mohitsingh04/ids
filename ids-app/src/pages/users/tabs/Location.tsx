import { FaGlobe, FaHashtag, FaHome, FaMapPin } from "react-icons/fa";
import type { UserProps } from "../../../types/UserTypes";

export default function UserLocationDetails({
  user,
}: {
  user: UserProps | null;
}) {
  return (
    <div>
      <div className="bg-[var(--yp-primary)] shadow-lg p-8 capitalize">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-[var(--yp-text-primary)]">
          <div className="space-y-3 sm:space-y-5">
            <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base lowercase">
              <FaHome className="w-5 h-5 text-[var(--yp-main)]" />
              <span className="font-semibold capitalize">Address:</span>
              {user?.address || "N/A"}
            </p>
            <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base lowercase">
              <FaGlobe className="w-5 h-5 text-[var(--yp-main)]" />
              <span className="font-semibold capitalize">State:</span>
              {user?.state || "N/A"}
            </p>
            <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base lowercase">
              <FaHashtag className="w-5 h-5 text-[var(--yp-main)]" />
              <span className="font-semibold capitalize">Pincode:</span>
              {user?.pincode || "N/A"}
            </p>
          </div>

          <div className="space-y-4">
            <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base lowercase">
              <FaMapPin className="w-5 h-5 text-[var(--yp-main)]" />
              <span className="font-semibold capitalize">City:</span>
              {user?.city || "N/A"}
            </p>
            <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base lowercase">
              <FaGlobe className="w-5 h-5 text-[var(--yp-main)]" />
              <span className="font-semibold capitalize">Country:</span>
              {user?.country || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
