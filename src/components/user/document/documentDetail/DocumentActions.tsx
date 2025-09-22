import React, { useState, useEffect } from "react";
import DownloadButton from "../../../common/buttons/DownloadButton";
import ReportButton from "../../../common/buttons/ReportButton";
import LikeButton from "../../../common/buttons/LikeButton";
import DislikeButton from "../../../common/buttons/DislikeButton";
import FavoriteButton from "../../../common/buttons/FavoriteButton";
import ShareButton from "../../../common/buttons/ShareButton";
import type { Document } from "../../../../models/document";

interface DocumentActionsProps {
  document: Document;
  isUser?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  isUser = false,
}) => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Cố định vị trí khi cuộn xuống quá 100px
      if (currentScrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log("Document for actions:", document._id);

  return (
    <div
      className={`flex items-center justify-between p-2 transition-all duration-300 ${
        isFixed
          ? "fixed top-20 left-[23%] bg-[var(--secondary-background-color)] right-0 px-[10%] shadow-md z-1"
          : ""
      }`}
    >
      <DownloadButton point={6} />

      <div className="flex items-center space-x-4">
        {!isUser && <ReportButton />}
        <LikeButton likeCount={0} />
        <DislikeButton dislikeCount={0} />
        <FavoriteButton />
        <ShareButton />
      </div>
    </div>
  );
};
export default DocumentActions;
