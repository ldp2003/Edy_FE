import { Heart } from "lucide-react";
import React from "react";

const FavoriteButton: React.FC = () => {
  return (
    <div>
      <button className="text-xs flex items-center space-x-2 bg-white rounded-2xl border border-gray-300 px-3 py-1 font-semibold cursor-pointer text-[var(--favorite-color)] transition-colors duration-300 hover:bg-[#ffb800] hover:text-white">
        <Heart size={15} />
        <span className="text-xs">Lưu</span>
      </button>
    </div>
  );
};

export default FavoriteButton;
