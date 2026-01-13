import type { AxiosError } from "axios";
import type { FormikProps } from "formik";
import type { JSX } from "react";
import toast from "react-hot-toast";
import type { FieldDataSimple, StatusProps } from "../types/types";

export const getErrorResponse = (error: unknown, hide = false): void => {
  const err = error as AxiosError<{ error?: string; message?: string }>;

  if (!hide) {
    toast.error(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed To Process Your Request"
    );
  }

  console.error(
    err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      error
  );
};

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "green";
    case "pending":
      return "yellow";
    case "suspended":
      return "red";
    default:
      return "blue";
  }
};

export function maskSensitive(input?: string | null): string {
  if (!input) return "N/A"; // handle undefined, null, or empty string

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return localPart[0] + "*".repeat(localPart.length - 1) + "@" + domain;
    }
    return (
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1] +
      "@" +
      domain
    );
  };

  const maskMobile = (str: string) => {
    const cleaned = str.startsWith("+") ? str.slice(1) : str;
    if (cleaned.length <= 4) {
      return "*".repeat(cleaned.length);
    }
    return "*".repeat(cleaned.length - 4) + cleaned.slice(-4);
  };

  const maskGeneric = (str: string) => {
    if (str.length <= 2)
      return str[0] + "*".repeat(Math.max(0, str.length - 1));
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(input)) {
    return maskEmail(input);
  }

  const mobilePattern = /^\+?\d{10,15}$/;
  if (mobilePattern.test(input)) {
    return maskMobile(input);
  }

  return maskGeneric(input);
}

export const formatDateWithoutTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
export function getFormikError<T>(
  formik: FormikProps<T>,
  field: keyof T
): JSX.Element | null {
  const touched = formik.touched[field];
  const error = formik.errors[field];

  if (!touched || typeof error !== "string") {
    return null;
  }

  return (
    <div className="inline-flex">
      <p className="text-[var(--yp-danger)] bg-[var(--yp-danger-subtle)] rounded px-2 py-1 text-xs mt-1">
        {error}
      </p>
    </div>
  );
}

export function getFieldDataSimple<T>(
  data: T[],
  field: keyof T
): FieldDataSimple[] {
  const uniqueValues = Array.from(
    new Set(data.map((item) => item[field]).filter(Boolean))
  );

  return uniqueValues.map((val) => ({
    title: String(val),
    value: data.filter((item) => item[field] === val).length,
  }));
}

export const matchPermissions = (
  userPermissions: string[] = [],
  requiredPermissions: string
) => {
  const hasPermission =
    userPermissions?.some(
      (item) => generateSlug(item) === generateSlug(requiredPermissions)
    ) || false;
  return hasPermission;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getPercentageColor = (value: number) => {
  if (value <= 30) return "red";
  if (value <= 60) return "blue";
  if (value <= 90) return "green";
  return "yellow";
};

export const getStatusAccodingToField = (
  allStatus: StatusProps[],
  field: string
) => {
  return allStatus.filter(
    (status) => status?.status_name?.toLowerCase() === field.toLowerCase()
  );
};

export const getLeadStatus = (percentage: number): string => {
  if (percentage < 30) return "Poor";
  if (percentage < 50) return "Average";
  if (percentage < 70) return "Good";
  if (percentage < 85) return "Very Good";
  return "Excellent";
};
export const getLeadStatusColor = (percentage: number): string => {
  if (percentage < 30) return "red";
  if (percentage < 50) return "gray";
  if (percentage < 70) return "blue";
  if (percentage < 85) return "green";
  return "yellow";
};
