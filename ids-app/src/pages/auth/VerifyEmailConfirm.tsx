import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCircleCheck,
  LuCircleX,
  LuLoader,
} from "react-icons/lu";
import { AxiosError } from "axios";
import { API } from "../../context/API";
import type { TokenConfimationProps } from "../../types/types";

export default function VerifyEmailConfirm() {
  const navigate = useNavigate();
  const { token } = useParams();

  const hasRequestedRef = useRef(false);

  const [state, setState] = useState<TokenConfimationProps>({
    loading: true,
    success: false,
    error: "",
    title: "",
    message: "",
  });

  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState({
        loading: false,
        success: false,
        error: "INVALID_TOKEN",
        title: "Invalid Request",
        message: "The verification link is invalid or expired.",
      });
      return;
    }

    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    const verifyToken = async () => {
      try {
        const response = await API.get(`/auth/verify-email/${token}`);

        setState({
          loading: false,
          success: true,
          error: "",
          title: "Email Verified",
          message:
            response.data?.message ||
            "Your email address has been successfully verified.",
        });
      } catch (error) {
        const err = error as AxiosError<{ error?: string; message?: string }>;

        setState({
          loading: false,
          success: false,
          error: "VERIFICATION_FAILED",
          title: "Verification Failed",
          message:
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Something went wrong. Please try again later.",
        });
      }
    };

    verifyToken();
  }, [token]);

  const handleRedirect = useCallback(() => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    navigate("/");
  }, [isRedirecting, navigate]);

  useEffect(() => {
    if (state.loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.loading, handleRedirect]);

  const handleBack = () => {
    if (isRedirecting) return;
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center w-full text-center">
      <div className="flex justify-center mb-3">
        {state.loading ? (
          <div className="rounded-full p-4 bg-[var(--primary-icon-l)]">
            <LuLoader className="w-12 h-12 text-[var(--yp-main)] animate-spin" />
          </div>
        ) : state.success ? (
          <div className="rounded-full p-4 bg-[var(--yp-success-subtle)]">
            <LuCircleCheck className="w-12 h-12 text-[var(--yp-success)]" />
          </div>
        ) : (
          <div className="rounded-full p-4 bg-[var(--yp-danger-subtle)]">
            <LuCircleX className="w-12 h-12 text-[var(--yp-danger)]" />
          </div>
        )}
      </div>

      <h1
        className={`text-2xl font-bold ${
          state.loading
            ? "text-[var(--yp-main)]"
            : state.success
            ? "text-[var(--yp-success)]"
            : "text-[var(--yp-danger)]"
        }`}
      >
        {state.loading ? "Verifying Request" : state.title}
      </h1>

      <p className="text-gray-600 my-3">
        {state.loading
          ? "Please wait while we process your request..."
          : state.message}
      </p>

      {!state.loading && countdown > 0 && (
        <p className="text-sm text-gray-500 mb-3">
          Redirecting to login in {countdown} second{countdown !== 1 && "s"}...
        </p>
      )}

      {!state.loading && (
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleRedirect}
            disabled={isRedirecting}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
              state.success ? "bg-[var(--yp-success)]" : "bg-[var(--yp-danger)]"
            } disabled:opacity-50 hover:opacity-80`}
          >
            {isRedirecting ? (
              <LuLoader className="w-5 h-5 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>

          <button
            onClick={handleBack}
            disabled={isRedirecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 transition disabled:opacity-50"
          >
            <LuArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
