/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThumbsUp } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DocumentService } from "../../../utils/DocumentService";
import { message } from "antd";

interface LikeButtonProps {
  documentId: string;
  initialLikeCount?: number;
  initialUserReaction?: "LIKE" | "DISLIKE" | null;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  documentId,
  initialLikeCount = 0,
  initialUserReaction = null,
}) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [userReaction, setUserReaction] = useState<"LIKE" | "DISLIKE" | null>(
    initialUserReaction
  );
  const [loading, setLoading] = useState(false);

  const handleLikeClick = async () => {
    try {
      setLoading(true);

      let newReaction: "LIKE" | "DISLIKE" | "UNREACT";

      if (userReaction === "LIKE") {
        newReaction = "UNREACT";
      } else {
        newReaction = "LIKE";
      }

      await DocumentService.reactDocument(documentId, newReaction);

      // Trigger refetch reactions từ parent
      window.dispatchEvent(
        new CustomEvent("reactionChanged", {
          detail: {
            documentId,
            action: newReaction,
          },
        })
      );
    } catch (error: any) {
      console.error("Error reacting to document:", error);
      message.error("Không thể thực hiện hành động này!");
    } finally {
      setLoading(false);
    }
  };

  // Thêm listener để nhận data mới từ refetch
  useEffect(() => {
    const handleReactionRefetch = (event: any) => {
      if (event.detail.documentId === documentId) {
        setLikeCount(event.detail.likes);
        setUserReaction(event.detail.userReaction);
      }
    };

    window.addEventListener("reactionRefetch", handleReactionRefetch);
    return () =>
      window.removeEventListener("reactionRefetch", handleReactionRefetch);
  }, [documentId]);

  const isLiked = userReaction === "LIKE";

  return (
    <div>
      <button
        className={`text-xs flex items-center space-x-2 rounded-2xl border px-3 py-1 font-semibold cursor-pointer transition-colors duration-300 ${
          isLiked
            ? "bg-[var(--green-button-color)] text-white border-[var(--green-button-color)]"
            : "bg-white border-gray-300 text-[var(--green-button-color)] hover:bg-[#27a743] hover:text-white"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleLikeClick}
        disabled={loading}
      >
        <ThumbsUp size={15} />
        <span className="text-xs">{likeCount}</span>
      </button>
    </div>
  );
};

export default LikeButton;
