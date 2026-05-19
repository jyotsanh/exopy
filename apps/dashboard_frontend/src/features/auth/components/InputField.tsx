import React from "react";
import type{ InputFieldProps } from "@/features/auth/types/auth.types";

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  register,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg tracking-wide font-medium text-gray-700 mb-2 font-mono pl-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...register}
          type={type}
          id={id}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/80 text-sm sm:text-base font-heading"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-mono">{error}</p>}
    </div>
  );
};

export default InputField;