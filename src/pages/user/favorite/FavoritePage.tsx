import React from "react";
import FavoriteDocuments from "../../../components/user/favorite/FavoriteDocuments";

const FavoritePage: React.FC = () => {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <FavoriteDocuments />
      </div>
    </div>
  );
};

export default FavoritePage;
