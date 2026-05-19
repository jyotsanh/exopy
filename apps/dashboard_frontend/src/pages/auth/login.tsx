import React from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import VideoBackground from "@/features/auth/components/VideoBackground";
import { SEO } from "@/components/seo/SEO";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex overflow-hidden relative">
      <SEO title="Login" description="login to your Expoy" />
      <VideoBackground videoSrc="./greenbg.mp4" />
      <LoginForm />
    
    </div>
  );
};

export default Login;
