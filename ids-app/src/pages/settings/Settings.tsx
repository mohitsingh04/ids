"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import LocationSettings from "./settings_tab/location/LocationSettings";
import GeneralSettings from "./settings_tab/general/GeneralSettings";
import SecuritySettings from "./settings_tab/security/SecuritySettings";
import {
  LuGlobe,
  LuMapPin,
  LuMenu,
  LuSettings,
  LuShield,
  LuX,
} from "react-icons/lu";

type SettingTab = {
  id: string;
  label: string;
  icon: any;
  component: React.ComponentType<any> | null;
};

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";
  const navigate = useNavigate();

  const settingsTabs: SettingTab[] = [
    {
      id: "general",
      label: "General",
      icon: LuGlobe,
      component: GeneralSettings,
    },
    {
      id: "location",
      label: "Location",
      icon: LuMapPin,
      component: LocationSettings,
    },
    {
      id: "security",
      label: "Security",
      icon: LuShield,
      component: SecuritySettings,
    },
  ];

  const changeTab = (tabId: string) => {
    if (tabId === "support") {
      navigate("/dashboard/support");
      return;
    }
    setSearchParams({ tab: tabId });
    setMobileMenuOpen(false);
  };

  const ActiveComponent =
    settingsTabs.find((tab) => tab.id === activeTab)?.component ||
    GeneralSettings;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        title="Settings"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Settings" },
        ]}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden inline-flex items-center p-2 rounded-md text-[var(--yp-muted)] hover:bg-[var(--yp-tertiary)]"
        >
          <LuMenu className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--yp-blue-subtle)] text-[var(--yp-blue-emphasis)]"
                    : "text-[var(--yp-muted)] hover:bg-[var(--yp-primary)]"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-[var(--yp-secondary)] shadow-xl p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--yp-text-primary)] flex items-center gap-2">
                  <LuSettings className="w-5 h-5" /> Settings
                </h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[var(--yp-muted)]"
                >
                  <LuX className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => changeTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-[var(--yp-blue-subtle)] text-[var(--yp-blue-emphasis)]"
                        : "text-[var(--yp-muted)] hover:bg-[var(--yp-primary)]"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="lg:col-span-3">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
