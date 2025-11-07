import React, { useState, useEffect } from "react";
import LimitNotificationBanner from "./LimitNotificationBanner";

interface PowerPointViewerProps {
  url: string;
  zoom?: number;
  isUser?: boolean;
}

const PowerPointViewer: React.FC<PowerPointViewerProps> = ({
  url,
  zoom = 1,
  isUser = false,
}) => {
  const [showLimitBanner, setShowLimitBanner] = useState(false);
  const [hasShownBanner, setHasShownBanner] = useState(false);

  useEffect(() => {
    if (isUser || hasShownBanner) return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 500 && !hasShownBanner) {
        setShowLimitBanner(true);
        setHasShownBanner(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isUser, hasShownBanner]);

  return (
    <div className="w-full">
      <div
        className="select-none pointer-events-auto w-full h-screen"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
            url
          )}&embedded=true`}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="PowerPoint Viewer"
        />
      </div>

      {/* Limit notification banner below iframe for non-users */}
      {!isUser && showLimitBanner && (
        <LimitNotificationBanner
          title="Giới hạn xem PowerPoint"
          message="Đăng ký tài khoản để xem đầy đủ tất cả slides và nội dung"
          icon="📊"
        />
      )}
    </div>
  );
};

export default PowerPointViewer;
