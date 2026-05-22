import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AxiosInstance from "@/api/axiosInstance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import InputField from "./InputField";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgotPassword.schema";
import { paths } from "@/utils/path";

interface ApiResponse {
  success: boolean;
  message: string;
}

const ForgotPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const res = await AxiosInstance.post<ApiResponse>(
        "/auth/forgot-password",
        { email: data.email }
      );
      setApiResponse({
        success: true,
        message: res.data.message,
      });
    } catch (error: any) {
      setApiResponse({
        success: false,
        message:
          error?.response?.data?.message ??
          "Could not process request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[55%] xl:w-[43%] min-h-screen bg-card/95 backdrop-blur-md p-6 sm:p-8 md:p-12 flex flex-col justify-center item-center relative z-10 lg:rounded-tr-[4rem] lg:rounded-br-[4rem]">
      <img
        src="./Logo.png"
        alt="Logo"
        className="w-28 h-28 mb-4 absolute top-2 left-5"
      />

      <div className="relative z-10 max-w-md mx-auto w-full pb-20">
        <div className="mb-8 sm:mb-10 flex items-center justify-center flex-col">
          <h2 className="text-3xl sm:text-4xl font-medium text-foreground mb-2 text-center font-mono">
            Forgot password
          </h2>
          <p className="text-sm text-muted-foreground text-center font-mono mt-2">
            Enter the email associated with your account and we'll send you a
            password reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register("email")}
            error={errors.email?.message}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-green-500/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-12 hover:bg-green-700"
          >
            {isLoading ? (
              <span className="flex items-center justify-center tracking-wide">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Sending…
              </span>
            ) : (
              "Send reset link"
            )}
          </Button>

          {apiResponse && (
            <Alert
              className={`${
                apiResponse.success
                  ? "bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-900/60"
                  : "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900/60"
              }`}
            >
              <AlertDescription
                className={`${
                  apiResponse.success
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {apiResponse.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm font-mono">
            <Link
              to={paths.auth.login.path}
              className="text-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium tracking-wide"
            >
              ← Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
