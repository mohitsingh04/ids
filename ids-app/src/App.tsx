import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import { useCallback, useEffect, useState } from "react";
import type { PermissionDoc, RoleProps, UserProps } from "./types/UserTypes";
import MainLoader from "./ui/loadings/pages/MainLoader";
import { getErrorResponse } from "./context/Callbacks";
import { API } from "./context/API";
import {
  AuthNavigations,
  NonSidebarNavigations,
  SidbarNavigations,
  PublicNavigations,
} from "./common/RouteData";
import ProtectedRoutes from "./context/ProtectedRoute";
import PermissionContext from "./context/PermissionContext";
import DashboardLayout from "./layout/DashboardLayout";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [authUser, setAuthUser] = useState<UserProps | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const [allPermissions, setAllPermissions] = useState<PermissionDoc[]>([]);
  const [roles, setRoles] = useState<RoleProps[]>([]);

  const getRoles = useCallback(async () => {
    try {
      const response = await API.get(`/user/roles`);
      setRoles(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  const getPermissions = useCallback(async () => {
    try {
      const response = await API.get("/user/permissions");
      setAllPermissions(response.data || []);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  const findPermissionInDocs = useCallback(
    (id: string) => {
      if (!Array.isArray(allPermissions)) return null;
      for (const doc of allPermissions) {
        const found = doc.permissions?.find(
          (perm: { _id: string }) => perm._id === id
        );
        if (found) {
          return found.title;
        }
      }
      return null;
    },
    [allPermissions]
  );

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const getRoleById = useCallback(
    (id: string) => {
      const rol = roles?.find((item) => item._id === id);
      return rol?.role;
    },
    [roles]
  );

  const getAuthUser = useCallback(async () => {
    setAuthLoading(true);
    try {
      const response = await API.get(`/auth/detail`);
      const data = response.data;

      const rawPermissions = Array.isArray(data?.permissions)
        ? data.permissions
        : [];

      const permissions = rawPermissions.map((item: string) =>
        findPermissionInDocs(item)
      );

      setAuthUser({
        ...data,
        permissions,
        role: getRoleById(data?.role),
      });
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setAuthLoading(false);
    }
  }, [findPermissionInDocs, getRoleById]);

  useEffect(() => {
    if (!loadingRoles && !loadingPermissions) {
      getAuthUser();
    }
  }, [loadingRoles, loadingPermissions, getAuthUser]);

  if (authLoading) return <MainLoader />;

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <ThemeProvider>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <DashboardLayout
                  authUser={authUser}
                  authLoading={authLoading}
                  getRoleById={getRoleById}
                  roles={roles}
                  allPermissions={allPermissions}
                />
              }
            >
              {SidbarNavigations.map((page, index) => (
                <Route
                  path={page.href}
                  element={
                    <ProtectedRoutes
                      authUser={authUser}
                      authLoading={authLoading}
                    >
                      <PermissionContext
                        authUser={authUser}
                        authLoading={authLoading}
                        permission={page.permission}
                      >
                        <page.component />
                      </PermissionContext>
                    </ProtectedRoutes>
                  }
                  key={index}
                />
              ))}
              {NonSidebarNavigations.map((page, index) => (
                <Route
                  path={page.href}
                  element={
                    <ProtectedRoutes
                      authUser={authUser}
                      authLoading={authLoading}
                    >
                      <PermissionContext
                        authUser={authUser}
                        authLoading={authLoading}
                        permission={page.permission}
                      >
                        <page.component />
                      </PermissionContext>
                    </ProtectedRoutes>
                  }
                  key={index}
                />
              ))}
              {/* <Route path="/dashboard/access-denied" element={<AccessDenied />} />
            <Route path="/dashboard/comming-soon" element={<ComingSoon />} /> */}
            </Route>

            <Route
              path="/"
              element={
                <AuthLayout authUser={authUser} authLoading={authLoading} />
              }
            >
              {AuthNavigations.map((page, index) => (
                <Route
                  path={page.href}
                  element={
                    <ProtectedRoutes
                      authUser={authUser}
                      authLoading={authLoading}
                    >
                      <page.component />
                    </ProtectedRoutes>
                  }
                  key={index}
                />
              ))}
              {PublicNavigations.map((page, index) => (
                <Route
                  path={page.href}
                  element={
                    <ProtectedRoutes
                      authUser={authUser}
                      authLoading={authLoading}
                    >
                      <page.component />
                    </ProtectedRoutes>
                  }
                  key={index}
                />
              ))}
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
