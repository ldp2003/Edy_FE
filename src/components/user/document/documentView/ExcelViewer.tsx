import React, { useState, useEffect } from "react";
import LimitNotificationBanner from "./LimitNotificationBanner";

interface ExcelViewerProps {
  url: string;
  zoom?: number;
  isUser?: boolean;
}

const ExcelViewer: React.FC<ExcelViewerProps> = ({
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
        className="select-none pointer-events-auto w-full h-screen relative"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        <iframe
          src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
            url
          )}`}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Excel Viewer"
        />
      </div>

      {/* Limit notification banner below iframe for non-users */}
      {!isUser && showLimitBanner && (
        <LimitNotificationBanner
          title="Giới hạn xem Excel"
          message="Đăng ký tài khoản để xem đầy đủ tất cả sheets và nội dung"
          icon="📊"
        />
      )}
    </div>
  );
};

export default ExcelViewer;
