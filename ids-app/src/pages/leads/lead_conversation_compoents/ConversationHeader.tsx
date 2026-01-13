import { FaUser } from "react-icons/fa";
import type { LeadProps } from "../../../types/LeadTypes";
import { GiPhone } from "react-icons/gi";
import { LuEye } from "react-icons/lu";
import Badge from "../../../ui/badge/Badge";
import { getStatusColor } from "../../../context/Callbacks";

export default function ConversationHeader({
  lead,
  hasHistory,
  isStarted,
}: {
  lead: LeadProps | null;
  isStarted: boolean;
  hasHistory: boolean;
}) {
  return (
    <div className="p-4 border-b border-(--yp-border-primary) text-(--yp-text-secondary) flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-(--yp-main-subtle) flex items-center justify-center text-(--yp-main)">
          <FaUser size={20} />
        </div>
        <div>
          <h2 className="font-bold">{lead?.name || "Student Name"}</h2>
          {lead?.mobile_no && (
            <p className="text-xs text-(--yp-muted) flex items-center gap-1">
              <GiPhone size={12} />
              {lead?.mobile_no}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {hasHistory && !isStarted && (
          <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            <LuEye /> View Mode
          </span>
        )}
        <Badge
          label={lead?.status}
          color={getStatusColor(lead?.status || "")}
        />
      </div>
    </div>
  );
}
