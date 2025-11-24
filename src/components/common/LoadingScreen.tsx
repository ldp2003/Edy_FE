import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 relative overflow-hidden">
      <style>
        {`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.1); }
          }
          @keyframes shapeTopRightMove {
            0%, 100% { transform: translate(-20px, -30px); }
            50% { transform: translate(220px, -200px); }
          }
          @keyframes shapeBottomLeftMove {
            0%, 100% { transform: translate(-20px, 30px); }
            50% { transform: translate(-220px, 200px); }
          }
          .logo-animation {
            animation: logoFloat 2s ease-in-out infinite;
          }
          .shape-top-right-move {
            animation: shapeTopRightMove 3s ease-in-out infinite;
          }
          .shape-bottom-left-move {
            animation: shapeBottomLeftMove 3s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative flex flex-col items-center space-y-4">
        {/* Hình vuông trên bên phải */}
        <div className="absolute m-auto w-[20vw] h-[30vh] bg-[var(--primary-color)]/50 opacity-50 rounded-xl z-0 shape-top-right-move"></div>
        {/* Hình vuông dưới bên trái */}
        <div className="absolute m-auto w-[20vw] h-[30vh] bg-[var(--primary-color)]/50 opacity-50 rounded-xl z-0 shape-bottom-left-move"></div>
        <img
          src="/image/Logo.png"
          alt="Logo"
          className="w-[15vw] h-[15vw] logo-animation z-10"
        />
        <div
          className="flex items-center space-x-1 font-medium text-gray-700 z-10"
          style={{ fontSize: "4rem" }}
        >
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
