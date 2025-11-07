import React from "react";

interface LimitNotificationBannerProps {
  message: string;
  title?: string;
  icon?: string;
  buttonText?: string;
}

const LimitNotificationBanner: React.FC<LimitNotificationBannerProps> = ({
  message,
  title = "Giới hạn xem",
  icon = "📊",
  buttonText = "Đăng ký ngay - Miễn phí",
}) => {
  const handleRegisterClick = () => {
    window.location.href = "/auth/register";
  };

  return (
    <div className="mx-4 my-8">
      <div className="border-2 rounded-xl p-6 text-center shadow-lg bg-[var(--primary-background-color)] border-[var(--primary-color)]">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--primary-text-color)]">
          {title}
        </h3>
        <p className="text-sm sm:text-base mb-6 text-[var(--secondary-text-color)]">
          {message}
        </p>
        <button
          onClick={handleRegisterClick}
          className="px-8 py-3 text-white text-base sm:text-lg rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md bg-[var(--primary-color)]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default LimitNotificationBanner;
