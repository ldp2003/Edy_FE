import React from "react";
import { X } from "lucide-react";

interface MobileSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 lg:hidden z-[90] ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300 ease-in-out transform lg:hidden z-[100] ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="h-full pt-16 pb-20 overflow-y-auto">{children}</div>
      </div>
    </>
  );
};
