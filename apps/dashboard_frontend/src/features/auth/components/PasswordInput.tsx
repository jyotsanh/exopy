import React from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Button } from "@/components/ui/button";
import type { PasswordInputProps } from "@/features/auth/types/auth.types";

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  placeholder,
  error,
  register,
  showPassword,
  onTogglePassword,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg tracking-wide font-medium text-foreground mb-2 font-mono pl-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...register}
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-3 border leading-tight border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-background/80 text-foreground placeholder:text-muted-foreground text-sm sm:text-base font-heading"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onTogglePassword}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
        >
          {showPassword ? (
            <MdVisibilityOff size={20} />
          ) : (
            <MdVisibility size={20} />
          )}
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-mono">{error}</p>}
    </div>
  );
};

export default PasswordInput;
