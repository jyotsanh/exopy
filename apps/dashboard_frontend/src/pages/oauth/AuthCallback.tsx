import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { useAppDispatch } from "@/store/hook/hook";
import { setUser } from "@/store/slice/authSlice/authSlice";
import { paths } from "@/utils/path";

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const token = searchParams.get("token");
      const userEncoded = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        throw new Error(error);
      }

      if (!token || !userEncoded) {
        throw new Error("invalid_response");
      }

      const user = JSON.parse(decodeURIComponent(userEncoded));

      dispatch(
        setUser({
          accessToken: token,
          user,
        }),
      );

      setStatus("success");

      setTimeout(() => {
        navigate(paths.views.dashboard.path, { replace: true });
      }, 1000);
    } catch (err: any) {
      const message = getErrorMessage(err.message);
      setStatus("error");
      setErrorMessage(message);

      setTimeout(() => {
        navigate(paths.auth.login.path, { state: { error: message } });
      }, 2000);
    }
  }, [dispatch, navigate, searchParams]);

  const getErrorMessage = (error: string): string => {
    const errorMessages: Record<string, string> = {
      auth_failed: "Authentication failed. Please try again.",
      no_user: "No account found with this email.",
      invalid_response: "Invalid authentication response.",
      server_error: "Server error occurred. Please try again later.",
    };

    return errorMessages[error] || "Authentication failed.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-card p-8 rounded-xl shadow-sm text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <FiLoader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bebas-neue tracking-wider text-primary">
              Authenticating
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Please wait while we complete your sign-in.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bebas-neue tracking-wider text-primary">
              Authentication Successful
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RxCrossCircled className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bebas-neue tracking-wider text-red-500">
              Authentication Failed
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">{errorMessage}</p>
            <p className="text-muted-foreground/70 text-xs mt-2">
              Redirecting to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
