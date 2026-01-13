import { LuGitGraph, LuUsers } from "react-icons/lu";
import { TbBrandGoogleBigQuery, TbHome } from "react-icons/tb";
import { GiMaterialsScience } from "react-icons/gi";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Register from "../pages/auth/Register";
import VerifyEmailSwal from "../pages/auth/VerifyEmail";
import VerifyEmailConfirm from "../pages/auth/VerifyEmailConfirm";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ForgotpasswordSwal from "../pages/auth/ForgotPasswordSwal";
import ResetPassword from "../pages/auth/ResetPassword";
import Profile from "../pages/profile/Profile";
import SettingsPage from "../pages/settings/Settings";
import UserAssets from "../pages/user-assets/UserAssets";
import CallerCreate from "../pages/caller/CallerCreate";
import SetPasswordCreation from "../pages/auth/SetPasswordCreation";
import UserList from "../pages/users/UsersList";
import UserEdit from "../pages/users/UserEdit";
import UserView from "../pages/users/UserView";
import StatusList from "../pages/status/StatusList";
import StatusCreate from "../pages/status/StatusCreate";
import StatusView from "../pages/status/StatusView";
import StatusEdit from "../pages/status/StatusEdit";
import CallerList from "../pages/caller/CallerList";
import CallerView from "../pages/caller/CallerView";
import CallerEdit from "../pages/caller/CallerEdit";
import LeadList from "../pages/leads/LeadsList";
import LeadView from "../pages/leads/LeadView";
import LeadConversation from "../pages/leads/LeadConversation";
import { FaQuestionCircle } from "react-icons/fa";
import CreateQuestion from "../pages/question-set/QuestionSet";

export const SidbarNavigations = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: TbHome,
    href: "/dashboard",
    component: Dashboard,
    roles: ["caller", "team lead", "admin", "super admin"],
    permission: "",
  },
  {
    name: "Users",
    id: "users",
    icon: LuUsers,
    href: "/dashboard/users",
    component: UserList,
    roles: ["super admin"],
    permission: "read user",
  },
  {
    name: "Callers",
    id: "callers",
    icon: LuUsers,
    href: "/dashboard/callers",
    component: CallerList,
    roles: ["admin"],
    permission: "read caller",
  },
  {
    name: "Leads",
    id: "leads",
    icon: TbBrandGoogleBigQuery,
    href: "/dashboard/leads",
    component: LeadList,
    roles: ["caller", "team lead", "admin", "super admin"],
    permission: "read lead",
  },
  {
    name: "Question Set",
    id: "question-set",
    icon: FaQuestionCircle,
    href: "/dashboard/question-set",
    component: CreateQuestion,
    roles: ["admin", "super admin"],
    permission: "read question set",
  },
  {
    name: "Status",
    id: "status",
    icon: LuGitGraph,
    href: "/dashboard/status",
    component: StatusList,
    roles: ["super admin"],
    permission: "read status",
  },
  {
    name: "User Assets",
    id: "user-assets",
    icon: GiMaterialsScience,
    href: "/dashboard/user-assets",
    component: UserAssets,
    roles: ["super admin"],
    permission: "read user assets",
  },
];

export const NonSidebarNavigations = [
  {
    name: "Profile",
    id: "profile",
    href: "/dashboard/profile",
    component: Profile,
    roles: ["caller", "team lead", "admin", "super admin"],
  },
  {
    name: "Settings",
    id: "settings",
    href: "/dashboard/settings",
    component: SettingsPage,
    roles: ["caller", "team lead", "admin", "super admin"],
  },
  {
    name: "User View",
    id: "user-view",
    href: "/dashboard/user/:objectId",
    component: UserView,
    roles: ["admin", "super admin"],
    permission: "read user",
  },
  {
    name: "User Update",
    id: "user-update",
    href: "/dashboard/user/:objectId/update",
    component: UserEdit,
    roles: ["admin", "super admin"],
    permission: "update user",
  },
  {
    name: "Caller Create",
    id: "caller-create",
    href: "/dashboard/caller/create",
    component: CallerCreate,
    roles: ["admin", "super admin"],
    permission: "create user",
  },
  {
    name: "Caller View",
    id: "caller-view",
    href: "/dashboard/caller/:objectId",
    component: CallerView,
    roles: ["admin", "super admin"],
    permission: "read caller",
  },
  {
    name: "Caller Update",
    id: "caller-update",
    href: "/dashboard/caller/:objectId/update",
    component: CallerEdit,
    roles: ["admin", "super admin"],
    permission: "update caller",
  },
  {
    name: "Lead View",
    id: "lead-view",
    href: "/dashboard/lead/:objectId",
    component: LeadView,
    roles: ["caller", "team lead", "admin", "super admin"],
    permission: "read lead",
  },
  {
    name: "Lead Conversation",
    id: "lead-conversation",
    href: "/dashboard/lead/conversation/:objectId",
    component: LeadConversation,
    roles: ["caller", "team lead", "admin", "super admin"],
    permission: "read lead",
  },
  {
    name: "Status Create",
    id: "status-create",
    href: "/dashboard/status/create",
    component: StatusCreate,
    roles: ["super admin"],
    permission: "create status",
  },
  {
    name: "Status View",
    id: "status-view",
    href: "/dashboard/status/:objectId",
    component: StatusView,
    roles: ["super admin"],
    permission: "read status",
  },
  {
    name: "Status Update",
    id: "status-update",
    href: "/dashboard/status/:objectId/update",
    component: StatusEdit,
    roles: ["super admin"],
    permission: "update status",
  },
];

export const AuthNavigations = [
  {
    name: "Register",
    id: "register",
    href: "/register",
    component: Register,
    guestOnly: true,
  },
  {
    name: "Login",
    id: "login",
    href: "/",
    component: Login,
    guestOnly: true,
  },
  {
    name: "Verify Swal",
    href: "/verify-email/:email",
    component: VerifyEmailSwal,
    public: true,
  },
  {
    name: "Verify Email",
    href: "/auth/verify-email/confirm/:token",
    component: VerifyEmailConfirm,
    public: true,
  },
];

export const PublicNavigations = [
  {
    name: "Forgot Password",
    href: "/forgot-password",
    component: ForgotPassword,
    public: true,
  },
  {
    name: "Forgot Password Swal",
    href: "/forgot-password/:email",
    component: ForgotpasswordSwal,
    public: true,
  },
  {
    name: "Reset Password",
    href: "/auth/reset-password/confirm/:token",
    component: ResetPassword,
    public: true,
  },
  {
    name: "Set Password",
    href: "/auth/set-password/confirm/:token",
    component: SetPasswordCreation,
    public: true,
  },
];
