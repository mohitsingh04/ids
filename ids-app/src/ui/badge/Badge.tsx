import React from "react";

interface BadgeProps {
  label: string | React.ReactNode;
  color?: string;
  size?: "sm" | "md";
}

export function Badge({ label, color = "gray", size = "sm" }: BadgeProps) {
  const colors: Record<string, string> = {
    green: "var(--yp-success-subtle) var(--yp-success-emphasis)",
    red: "var(--yp-danger-subtle) var(--yp-danger-emphasis)",
    blue: "var(--yp-blue-subtle) var(--yp-blue-emphasis)",
    yellow: "var(--yp-warning-subtle) var(--yp-warning-emphasis)",
    gray: "var(--yp-gray-subtle) var(--yp-gray-emphasis)",
  };

  const sizes: Record<string, string> = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const [bgColor, textColor] = colors[color]?.split(" ");

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${sizes[size]}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {label}
    </span>
  );
}

export default Badge;
