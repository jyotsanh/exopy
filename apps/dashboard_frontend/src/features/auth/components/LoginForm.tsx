import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import RememberMeSection from "./RememberMeSection";
import SubmitButton from "./SubmitButton";

const LoginForm: React.FC = () => {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors },
    },
    showPassword,
    togglePassword,
    isLoading,
    apiResponse,
    onSubmit,
  } = useLoginForm();

  return (
    <div className="w-full md:w-[55%] xl:w-[43%] min-h-screen bg-white/95 backdrop-blur-md p-6 sm:p-8 md:p-12 flex flex-col justify-center item-center relative z-10 lg:rounded-tr-[4rem] lg:rounded-br-[4rem] ">
      <img src="./Logo.png" alt="Logo" className="w-28 h-28 mb-4 absolute top-2 left-5" />

      <div className="relative z-10 max-w-md mx-auto w-full pb-20">
        <div className="mb-8 sm:mb-10 flex items-center justify-center flex-col">


          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-2 text-center font-mono">
            Welcome back
          </h2>
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

          <PasswordInput
            id="password"
            label="Password"
            placeholder="* * * * * * * *"
            register={register("password")}
            error={errors.password?.message}
            showPassword={showPassword}
            onTogglePassword={togglePassword}
          />

          <RememberMeSection register={register} />

          <SubmitButton isLoading={isLoading} />

          {apiResponse && (
            <Alert
              className={`${apiResponse.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
                }`}
            >
              <AlertDescription
                className={`${apiResponse.success ? "text-green-800" : "text-red-800"
                  }`}
              >
                {apiResponse.message}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
