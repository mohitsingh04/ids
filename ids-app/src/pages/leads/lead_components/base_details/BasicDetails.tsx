import { FaUser } from "react-icons/fa";
import { LuBadgeCheck, LuMail } from "react-icons/lu";

import { GiSmartphone } from "react-icons/gi";
import { formatDistanceToNow } from "date-fns";
import type { LeadProps } from "../../../../types/LeadTypes";
import Badge from "../../../../ui/badge/Badge";
import {
  formatDateWithoutTime,
  getStatusColor,
  maskSensitive,
} from "../../../../context/Callbacks";

export default function LeadBasicDetails({ lead }: { lead: LeadProps | null }) {
  return (
    <div>
      <div className="bg-[var(--yp-primary)] shadow-lg p-5 sm:p-8">
        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-[var(--yp-text-primary)]">
          <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
            <FaUser className="w-5 h-5 text-[var(--yp-main)]" />
            <span className="font-semibold">Name:</span> {lead?.name}
          </p>
          <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base flex-wrap">
            <LuMail className="w-5 h-5 text-[var(--yp-main)]" />
            <span className="font-semibold">Email:</span>
            <span className="ml-1 sm:ml-2 break-all">
              {maskSensitive(lead?.email || "")}
            </span>
          </p>

          <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base flex-wrap">
            <GiSmartphone className="w-5 h-5 text-[var(--yp-main)]" />
            <span className="font-semibold">Mobile No:</span>
            <span className="ml-1 sm:ml-2 break-all">
              {maskSensitive(lead?.mobile_no || "")}
            </span>
          </p>

          <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base flex-wrap">
            <LuBadgeCheck className="w-5 h-5 text-[var(--yp-main)]" />
            <span className="font-semibold">Status:</span>
            <Badge
              label={lead?.status}
              color={getStatusColor(lead?.status || "")}
            />
          </p>

          {lead?.createdAt && (
            <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <LuBadgeCheck className="w-5 h-5 text-[var(--yp-main)]" />
              <span className="font-semibold">Register At:</span>
              <span>
                {formatDateWithoutTime(lead?.createdAt || "")}
                <span className="capitalize font-bold">
                  {" "}
                  ({" "}
                  {formatDistanceToNow(new Date(lead?.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                )
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
