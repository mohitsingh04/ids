import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

interface TableButtonProps {
  buttontype?: "button" | "link";
  href?: string;
  onClick?: () => void;
  Icon: IconType;
  tooltip?: string;
  color?: string;
  size?: string;
}

export function TableButton({
  buttontype = "button",
  href,
  onClick,
  Icon,
  tooltip = "",
  color = "gray",
  size = "sm",
}: TableButtonProps) {
  const colors: Record<string, string> = {
    red: "bg-[var(--yp-danger-subtle)] hover:bg-[var(--yp-danger-emphasis)] text-[var(--yp-danger-emphasis)] hover:text-[var(--yp-danger-subtle)]",
    green:
      "bg-[var(--yp-success-subtle)] hover:bg-[var(--yp-success-emphasis)] text-[var(--yp-success-emphasis)] hover:text-[var(--yp-success-subtle)]",
    blue: "bg-[var(--yp-blue-subtle)] hover:bg-[var(--yp-blue-emphasis)] text-[var(--yp-blue-emphasis)] hover:text-[var(--yp-blue-subtle)]",
    yellow:
      "bg-[var(--yp-yellow-bg)] hover:bg-[var(--yp-yellow-text)] text-[var(--yp-yellow-text)] hover:text-[var(--yp-yellow-bg)]",
    gray: "bg-[var(--yp-gray-bg)] hover:bg-[var(--yp-gray-text)] text-[var(--yp-gray-text)] hover:text-[var(--yp-gray-bg)]",
  };

  const sizes: Record<string, string> = {
    sm: "p-1 w-8 h-8",
    md: "p-2 w-10 h-10",
  };

  const content = (
    <div className="flex items-center justify-center w-full h-full">
      <Icon className="w-4 h-4" />
    </div>
  );

  if (buttontype === "link") {
    if (!href) throw new Error("Prop `href` is required when type='link'");
    return (
      <Link
        to={href}
        title={tooltip}
        className={`${colors[color]} ${sizes[size]} rounded-lg flex items-center justify-center transition-colors`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`${colors[color]} ${sizes[size]} rounded-lg flex items-center justify-center transition-colors`}
    >
      {content}
    </button>
  );
}

export default TableButton;
