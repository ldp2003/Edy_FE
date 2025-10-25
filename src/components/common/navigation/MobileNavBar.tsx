import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface MobileNavBarProps {
  onMenuClick: () => void;
  isAdmin?: boolean;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  onMenuClick,
  // isAdmin = false,
}) => {
  // const location = useLocation();
  const navigate = useNavigate();
  // const isDocumentDetailPage = location.pathname.includes("/document-detail");

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className={`
      fixed bottom-0 left-0 right-0 
      bg-white dark:bg-gray-800 
      border-t border-gray-200 dark:border-gray-700
      py-2 px-4
      md:hidden
      z-20
     `}
    >
      <div className="flex justify-around items-center">
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="text-xs mt-1">Danh mục</span>
        </button>

        <button
          onClick={() => handleNavigate("/")}
          className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs mt-1">Trang chủ</span>
        </button>

        <button
          onClick={() => handleNavigate("/search")}
          className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-500"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Tìm kiếm</span>
        </button>

        <button
          onClick={() => handleNavigate("/profile")}
          className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs mt-1">Trang cá nhân</span>
        </button>
      </div>
    </div>
  );
};
