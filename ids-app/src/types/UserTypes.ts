export interface UserProps extends Record<string, unknown> {
  avatar: string[];
  name: string;
  email: string;
  mobile_no: string;
  role: string;
  verified: boolean;
  status: string;
  createdAt: string;
  permissions: string[];
  address: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export type PermissionItem = {
  _id: string;
  title: string;
  description?: string;
};
export interface PermissionDoc extends Record<string, unknown> {
  _id: string;
  title: string;
  roles?: (string | { _id: string })[];
  permissions: PermissionItem[];
}

export interface RoleProps {
  _id: string;
  role: string;
}
