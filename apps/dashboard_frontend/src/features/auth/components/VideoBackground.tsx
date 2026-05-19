import React from "react";

interface VideoBackgroundProps {
  videoSrc?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc = "./greenbg.mp4",
}) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden md:block hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;