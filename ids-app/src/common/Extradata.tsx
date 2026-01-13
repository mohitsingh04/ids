import type { ClassNamesConfig } from "react-select";

export const phoneInputClass = {
  input:
    "!w-full !py-5 !border !border-[var(--yp-border-primary)] !rounded-lg !bg-[var(--yp-secondary)] !text-[var(--yp-text-secondary)]",
  button:
    "!py-5 !border !border-[var(--yp-border-primary)] !rounded-lg !bg-[var(--yp-secondary)] !text-[var(--yp-text-secondary)]",
  dropdown:
    "!bg-[var(--yp-primary)] !rounded-lg shadow-sm text-[var(--yp-text-primary)]",
};

export const reactSelectDesignClass: ClassNamesConfig<any, true> = {
  control: (state) =>
    `!rounded-md border ${
      state.isFocused
        ? "!border-gray-500"
        : "!border-[var(--yp-border-primary)]"
    } !bg-[var(--yp-input-primary)] !text-[var(--yp-text-primary)]`,
  menu: () => "!bg-[var(--yp-secondary)] !text-[var(--yp-text-primary)]",
  option: (state) =>
    `!cursor-pointer !px-3 !py-2 ${
      state.isSelected
        ? "!bg-[var(--yp-primary)] !text-[var(--yp-text-primary)]"
        : state.isFocused
        ? "!bg-[var(--yp-primary)]"
        : ""
    }`,
  multiValue: () => "!bg-[var(--yp-tertiary)] !px-2 !py-1 !mr-1",
  multiValueLabel: () => "!text-sm !text-[var(--yp-text-primary)]",
  multiValueRemove: () =>
    "hover:!bg-[var(--yp-secondary)] hover:!text-[var(--yp-danger-emphasis)] !cursor-pointer !ml-1",
  placeholder: () => "!text-[var(--yp-muted)]",
  singleValue: () => "!text-[var(--yp-text-primary)]",
  input: () => "!text-[var(--yp-text-primary)]",
};

export const colorsData = ["blue", "green", "red", "yellow", "gray"];

export const ProgressColor = {
  blue: {
    bg: "bg-[var(--yp-blue-subtle)]",
    text: "text-[var(--yp-blue-emphasis)]",
    stroke: "stroke-[var(--yp-blue)]",
  },
  green: {
    bg: "bg-[var(--yp-success-subtle)]",
    text: "text-[var(--yp-success-emphasis)]",
    stroke: "stroke-[var(--yp-success)]",
  },
  yellow: {
    bg: "bg-[var(--yp-warning-subtle)]",
    text: "text-[var(--yp-warning-emphasis)]",
    stroke: "stroke--[var(--yp-warning)]",
  },
  red: {
    bg: "bg-[var(--yp-danger-subtle)]",
    text: "text-[var(--yp-danger-emphasis)]",
    stroke: "stroke-[var(--yp-danger)]",
  },
  gray: {
    bg: "bg-[var(--yp-gray-subtle)]",
    text: "text-[var(--yp-gray-emphasis)]",
    stroke: "stroke-[var(--yp-gray)]",
  },
} as const;
