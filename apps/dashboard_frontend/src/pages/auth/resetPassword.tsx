import React from "react";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import VideoBackground from "@/features/auth/components/VideoBackground";
import { SEO } from "@/components/seo/SEO";

const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex overflow-hidden relative">
      <SEO title="Reset Password" description="Set a new Exopy password" />
      <VideoBackground videoSrc="./greenbg.mp4" />
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
