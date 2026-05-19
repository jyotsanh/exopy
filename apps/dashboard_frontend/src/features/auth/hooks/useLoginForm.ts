import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import type { LoginFormData, ApiResponse } from "../types/auth.types";
import { useAppDispatch } from "@/store/hook/hook";
import { loginUser } from "@/store/slice/authSlice/authSlice";
import { useNavigate } from "react-router-dom";
import { paths } from "@/utils/path";

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setApiResponse(null);
      const response = await dispatch(
        loginUser({ email: data.email, password: data.password }),
      ).unwrap();
      if (response.success) {
        navigate(paths.views.dashboard.path);
      } else {
        setApiResponse({
          success: false,
          message: response.message || "Login failed",
        });
      }
    } catch (error: any) {
      console.log(error);
      setApiResponse({
        success: false,
        message: error || "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    showPassword,
    togglePassword,
    isLoading,
    apiResponse,
    onSubmit,
  };
};
