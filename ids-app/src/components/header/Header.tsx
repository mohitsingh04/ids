
import { Link } from "react-router";
import { useCallback } from "react";
import toast from "react-hot-toast";
import type { UserProps } from "../../types/UserTypes";
import { useTheme } from "../../hooks/useTheme";
import { ProfileDropdown } from "../../ui/dropdowns/ProfileDropdown";
import { getErrorResponse } from "../../context/Callbacks";
import { API } from "../../context/API";
import { RiMenuFold3Line, RiMenuUnfold3Line } from "react-icons/ri";
import { LuLogOut, LuMoon, LuSettings, LuSun, LuUser } from "react-icons/lu";

interface HeaderProps {
  onToggleCollapse: () => void;
  authUser: UserProps | null;
  isCollapsed: boolean;
}

export function Header({
  onToggleCollapse,
  authUser,
  isCollapsed,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const handleLogout = useCallback(async () => {
    try {
      const response = await API.get(`/auth/logout`);
      toast.success(response.data.message);
      window.location.reload();
    } catch (error) {
      getErrorResponse(error);
    }
  }, []);

  const avatarUrl = authUser?.avatar?.[0]
    ? `${import.meta.env.VITE_MEDIA_URL}/${authUser.avatar[0]}`
    : "/img/default-images/yp-user.webp";

  return (
    <header className="sticky top-0 bg-[var(--yp-primary)] border-b border-[var(--yp-border-primary)] px-4 lg:px-6 py-4 z-100">
      <div className="flex items-center justify-between">
        {/* Left: Collapse + Logo on mobile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleCollapse}
            className="p-2 text-[var(--yp-text-primary)] hover:opacity-70 hover:bg-[var(--yp-tertiary)] rounded-lg transition-colors hidden lg:block"
          >
            {isCollapsed ? (
              <RiMenuUnfold3Line className="w-6 h-6" />
            ) : (
              <RiMenuFold3Line className="w-6 h-6" />
            )}
          </button>

          <Link to="/" className="lg:hidden">
            {theme === "dark" ? (
              <img
                src="/img/logo/logo-white-new.png"
                alt="Logo"
                className="h-6 w-auto ml-8"
              />
            ) : (
              <img
                src="/img/logo/logo-black-new.png"
                alt="Logo"
                className="h-6 w-auto ml-8"
              />
            )}
          </Link>
        </div>

        {/* Right: Theme, Notifications, Feedback, Profile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            title="Change Theme"
            className="p-2 text-[var(--yp-text-primary)] hover:opacity-70 hover:bg-[var(--yp-tertiary)] rounded-lg transition-colors"
          >
            {theme === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
          </button>

          <ProfileDropdown
            username={authUser?.name}
            avatarUrl={avatarUrl}
            items={[
              {
                type: "link",
                label: "View Profile",
                icon: LuUser,
                to: "/dashboard/profile",
              },
              {
                type: "link",
                label: "Settings",
                icon: LuSettings,
                to: "/dashboard/settings",
              },
              {
                type: "button",
                label: "Sign Out",
                icon: LuLogOut,
                onClick: handleLogout,
                danger: true,
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
