import { z } from "zod";
import { loginSchema } from "../schemas/auth.schema";

export type LoginFormData = z.infer<typeof loginSchema>;

// API Response type
export interface ApiResponse {
  success: boolean;
  message: string;
}

// Input field props
export interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  register: any;
}

// Password input props
export interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  register: any;
  showPassword: boolean;
  onTogglePassword: () => void;
}

// Remember me section props
export interface RememberMeSectionProps {
  register: any;
}

// Submit button props
export interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  text?: string;
}