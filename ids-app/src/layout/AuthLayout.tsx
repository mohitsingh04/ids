import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import MainLoader from "../ui/loadings/pages/MainLoader";
import type { UserProps } from "../types/UserTypes";
import { PublicNavigations } from "../common/RouteData";

export default function AuthLayout({
  authUser,
  authLoading,
}: {
  authLoading: boolean;
  authUser: UserProps | null;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

//   useEffect(() => {
//     const isPublicRoute = PublicNavigations.some(
//       (route) =>
//         route.href === pathname ||
//         pathname.startsWith(route.href.split("/:")[0])
//     );

//     if (!authLoading && authUser && !isPublicRoute) {
//       navigate("/dashboard");
//     }
//   }, [authLoading, authUser, navigate, pathname]);

  if (authLoading) {
    return <MainLoader />;
  }

  return (
    <div className="max-h-screen flex overflow-hidden">
      <div className="hidden md:flex w-[60%] bg-linear-to-br from-slate-50 to-blue-50 flex-col items-center justify-center px-8 py-6 relative">
        <div className="relative mb-8 w-72 h-72 shrink-0">
          <img
            src="/img/main-images/auth-hero.png"
            alt="Yoga Illustration"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        <div className="text-center max-w-xl px-4">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to Yogprerna
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Authentic Yoga for Everyday Balance
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Discover handpicked studios and trusted instructors at Yogprerna.
            From beginner to pro, infuse mindfulness into your life.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL – FULL SECTION SCROLL */}
      <div className="w-full md:w-[40%] min-h-screen bg-slate-900 overflow-y-auto align-content-center">
        <div className="px-6 py-10 flex flex-col items-center min-h-full justify-center">
          {/* LOGO */}
          <Link to={`/`} className="mb-10">
            <div className="h-12 w-64">
              <img
                src="/img/logo/logo-white-new.png"
                alt="Yogprerna Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          {/* FORM */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
