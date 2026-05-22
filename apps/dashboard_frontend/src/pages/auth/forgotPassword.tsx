import React from "react";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import VideoBackground from "@/features/auth/components/VideoBackground";
import { SEO } from "@/components/seo/SEO";

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex overflow-hidden relative">
      <SEO title="Forgot Password" description="Reset your Exopy password" />
      <VideoBackground videoSrc="./greenbg.mp4" />
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
