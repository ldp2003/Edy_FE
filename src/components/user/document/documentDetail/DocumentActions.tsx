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
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const scrollTop = target.scrollTop;

      // Cố định vị trí khi cuộn xuống quá 100px trong main content
      if (scrollTop > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    // Tìm container cha có overflow-y-auto chứa DocumentActions này
    const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
      if (!element || element === window.document.body) return null;

      const computedStyle = window.getComputedStyle(element);
      if (
        computedStyle.overflowY === "auto" ||
        computedStyle.overflowY === "scroll"
      ) {
        return element;
      }

      return findScrollableParent(element.parentElement!);
    };

    // Tìm element hiện tại và container scroll cha của nó
    const currentElement = window.document.querySelector(
      `[data-document-actions="${document._id}"]`
    ) as HTMLElement;
    let scrollContainer: HTMLElement | null = null;

    if (currentElement) {
      scrollContainer = findScrollableParent(currentElement.parentElement!);
    } else {
      // Fallback: tìm container với class overflow-y-auto trong cùng page
      scrollContainer = window.document.querySelector(
        ".flex-1.overflow-y-auto"
      ) as HTMLElement;
    }

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });

      return () => {
        scrollContainer!.removeEventListener("scroll", handleScroll);
      };
    }
  }, [document._id]);

  console.log("Document for actions:", document._id);

  return (
    <div
      data-document-actions={document._id}
      className={`flex items-center justify-between p-2 transition-all duration-300 ${isFixed
          ? "sticky top-0 bg-[var(--secondary-background-color)] shadow-md z-10 mx-[-16px] px-4"
          : ""
        }`}
    >
      <DownloadButton
        point={document.intensive ? 6 : 4}
        documentId={document._id}
        documentTitle={document.title}
      />

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
