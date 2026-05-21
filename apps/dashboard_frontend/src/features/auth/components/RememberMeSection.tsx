import React from "react";
import  type { RememberMeSectionProps } from "@/features/auth/types/auth.types";

const RememberMeSection: React.FC<RememberMeSectionProps> = ({ register }) => {
  return (
    <div className="flex  sm:flex-row sm:items-center justify-between text-sm gap-3 sm:gap-0">
      <label className="flex items-center cursor-pointer group">
        <input
          {...register("rememberMe")}
          type="checkbox"
          className="w-4 h-4 text-green-600 border-border rounded focus:ring-green-400 cursor-pointer accent-green-600"
        />
        <span className="ml-2 text-foreground group-hover:text-foreground/80 transition-colors tracking-wide font-mono">
          Remember me
        </span>
      </label>
      <a
        href="#"
        className="text-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium tracking-wide font-mono"
      >
        Forgot password?
      </a>
    </div>
  );
};

export default RememberMeSection;
