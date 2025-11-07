import React, { useState, useEffect, useRef } from "react";
import LimitNotificationModal from "./LimitNotificationModal";

interface VideoViewerProps {
  url: string;
  isUser?: boolean;
}

const VideoViewer: React.FC<VideoViewerProps> = ({ url, isUser = false }) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [limitTime, setLimitTime] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isUser) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const totalDuration = video.duration;
      // Limit time = max(10 seconds, totalDuration / 60 seconds)
      // e.g., 10 hours (36000s) -> 600s (10 min), 1 min (60s) -> 10s
      const calculatedLimit = Math.max(10, totalDuration / 60);
      setLimitTime(calculatedLimit);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isUser]);

  useEffect(() => {
    if (isUser || !videoRef.current || limitTime === null) return;

    const checkTime = () => {
      const video = videoRef.current;
      if (video && video.currentTime >= limitTime && !hasShownModal) {
        console.log(`Pausing video at ${limitTime}s (limit based on duration)`);
        video.pause();
        setShowLimitModal(true);
        setHasShownModal(true);
        setIsVideoDisabled(true);
      }
    };

    const interval = setInterval(checkTime, 500); // Check every 0.5 second

    return () => clearInterval(interval);
  }, [isUser, hasShownModal, limitTime]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    console.log(
      "Video time update:",
      video.currentTime,
      "limitTime:",
      limitTime,
      "isUser:",
      isUser,
      "hasShownModal:",
      hasShownModal
    );
    if (
      !isUser &&
      limitTime !== null &&
      video.currentTime >= limitTime &&
      !hasShownModal
    ) {
      console.log(`Pausing video at ${limitTime}s`);
      video.pause();
      setShowLimitModal(true);
      setHasShownModal(true);
      setIsVideoDisabled(true);
    }
  };

  const handleModalClose = () => {
    setShowLimitModal(false);
    // Do not reset video, keep disabled
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={url}
        controls={!isVideoDisabled}
        controlsList="nodownload"
        className={`w-full max-h-[80vh] bg-black ${
          isVideoDisabled ? "pointer-events-none opacity-50" : ""
        }`}
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={handleTimeUpdate}
      >
        Trình duyệt của bạn không hỗ trợ video.
      </video>

      {/* Overlay to prevent interaction when limit reached */}
      {isVideoDisabled && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <p className="text-lg font-semibold">Video đã bị khóa</p>
            <p className="text-sm">Đăng ký tài khoản để xem toàn bộ</p>
          </div>
        </div>
      )}

      <LimitNotificationModal
        visible={showLimitModal}
        onClose={handleModalClose}
        message={`Bạn đã xem hết ${
          limitTime ? Math.floor(limitTime) : 0
        } giây của video. Để xem toàn bộ nội dung, vui lòng đăng ký tài khoản.`}
      />
    </div>
  );
};

export default VideoViewer;
