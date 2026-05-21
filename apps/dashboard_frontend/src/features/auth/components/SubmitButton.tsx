import React from "react";
import { Button } from "@/components/ui/button";
import type { SubmitButtonProps } from "@/features/auth/types/auth.types";

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  loadingText = "Signing in...",
  text = "Sign in",
}) => {

    const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
  };
  return (
    <div className="space-y-6">
      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium transition-all duration-300  hover:shadow-green-500/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-12 hover:bg-green-700 "
      >
        {isLoading ? (
          <span className="flex items-center justify-center tracking-wide">
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3 " />
            {loadingText}
          </span>
        ) : (
          text
        )}
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 border-border bg-card hover:bg-accent hover:-translate-y-0.5 transition-all duration-200   transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none  "
        onClick={() => {
          handleGoogleSignIn();
        }}
      >
        <img
          src="/google.png"
          alt="Google"
          className="h-5 w-5"
        />
        <span className="font-medium text-foreground tracking-wide ">
          Continue with Google
        </span>
      </Button>
    </div>
  );
};

export default SubmitButton;
