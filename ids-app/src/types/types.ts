import type {
  PermissionDoc,
  PermissionItem,
  RoleProps,
  UserProps,
} from "./UserTypes";

export interface TokenConfimationProps {
  loading: boolean;
  success: boolean;
  error: string;
  title: string;
  message: string;
}

export interface DashboardOutletContextProps {
  authUser: UserProps | null;
  authLoading: boolean;
  getRoleById: (id: string) => string | undefined;
  roles: RoleProps[];
  allPermissions: PermissionDoc[];
  status: StatusProps[];
  getStatus: () => void;
  organization: OrganizationProps | null;
}

export interface CityProps {
  name: string;
  state_name: string;
}

export interface StateProps {
  country_name: string;
  name: string;
}

export interface CountryProps {
  country_name: string;
}
export interface Column<T> {
  value: keyof T | ((row: T) => React.JSX.Element);
  label: string;
  key?: string;
}

export interface SimpleTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export type RoleOption = {
  value: string;
  label: string;
};

export type ExistingPermissionSet = {
  _id?: string;
  title?: string;
  roles?: (string | { _id: string })[];
  permissions?: PermissionItem[];
};

export interface FieldDataSimple {
  title: string;
  value: number;
}
export interface StatusProps extends Record<string, unknown> {
  _id: string;
  status_name: string;
  parent_status: string;
  createdAt: string;
  description: string;
}

export interface OrganizationProps {
  _id: string;
  organization_name: string;
  members: string;
}
