import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { UserProps } from "../../types/UserTypes";
import { API } from "../../context/API";
import { getErrorResponse } from "../../context/Callbacks";

export default function VerifyEmailSwal() {
  const RESEND_TIME = 60;
  const LINK_VALID_MINUTES = 5;

  const { email } = useParams();

  const [timeLeft, setTimeLeft] = useState<number>(RESEND_TIME);
  const [isResending, setIsResending] = useState<boolean>(false);

  const [user, setUser] = useState<UserProps | null>(null);
  const navigate = useNavigate();

  // Fetch user details
  const getUser = useCallback(async () => {
    try {
      const response = await API.get(`/profile/user/email/${email}`);
      setUser(response.data || null);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [email]);

  useEffect(() => {
    if (!user) return;

    if (user?.verified) {
      toast.error("You are already verified.");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Resend verification email
  const handleResendMail = async () => {
    setIsResending(true);

    try {
      const response = await API.post(`/profile/verify-email/email/${email}`);
      toast.success(response.data.message );
      setTimeLeft(RESEND_TIME);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        A verification email has been sent to
        <span className="font-medium text-slate-800"> {email}</span>
      </p>

      <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-sm text-slate-600 leading-relaxed">
          Open the email and follow the link to activate your account.
          <br />
          <span className="text-xs text-slate-500 block mt-1">
            The link will expire after {LINK_VALID_MINUTES} minutes.
          </span>
        </p>
      </div>

      <div className="my-3 text-xs text-slate-500">
        Can’t find the email? Check your spam folder or wait before requesting a
        new one.
      </div>

      <button
        onClick={handleResendMail}
        disabled={timeLeft > 0 || isResending}
        className={`w-full h-11 rounded-xl text-sm font-medium transition ${
          timeLeft > 0
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {isResending
          ? "Resending..."
          : timeLeft > 0
          ? `Resend email in ${timeLeft}s`
          : "Resend verification email"}
      </button>
    </div>
  );
}
