import { Heart } from "lucide-react";
import React from "react";

const FavoriteButton: React.FC = () => {
  return (
    <div>
      <button
        className="flex items-center space-x-2 bg-white hover:bg-[#ffb800] rounded-2xl border border-gray-300 px-3 py-1 font-semibold cursor-pointer"
        style={{
          color: "var(--favorite-color)",
          transition: "color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--favorite-color)";
        }}
      >
        <Heart className="w-4 h-4" />
        <span>Lưu</span>
      </button>
    </div>
  );
};

export default FavoriteButton;
