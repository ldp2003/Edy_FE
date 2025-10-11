/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThumbsDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DocumentService } from "../../../utils/DocumentService";
import { message } from "antd";

interface DislikeButtonProps {
  documentId: string;
  initialDislikeCount?: number;
  initialUserReaction?: "LIKE" | "DISLIKE" | null;
}

const DislikeButton: React.FC<DislikeButtonProps> = ({
  documentId,
  initialDislikeCount = 0,
  initialUserReaction = null,
import React, { useState, useEffect } from "react";
import { DocumentAPI } from "../../../api/API";
import { message } from "antd";

interface DislikeButtonProps {
  documentId: string;
  initialDislikeCount?: number;
  initialUserReaction?: "LIKE" | "DISLIKE" | null;
}

const DislikeButton: React.FC<DislikeButtonProps> = ({
  documentId,
  initialDislikeCount = 0,
  initialUserReaction = null
}) => {
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [userReaction, setUserReaction] = useState<"LIKE" | "DISLIKE" | null>(
    initialUserReaction
  );
  const [loading, setLoading] = useState(false);

  const handleDislikeClick = async () => {
    try {
      setLoading(true);

      let newReaction: "LIKE" | "DISLIKE" | "UNREACT";

      if (userReaction === "DISLIKE") {
        newReaction = "UNREACT";
      } else {
        newReaction = "DISLIKE";
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
        setDislikeCount(event.detail.dislikes);
        setUserReaction(event.detail.userReaction);
      }
    };

    window.addEventListener("reactionRefetch", handleReactionRefetch);
    return () =>
      window.removeEventListener("reactionRefetch", handleReactionRefetch);
  }, [documentId]);

  const isDisliked = userReaction === "DISLIKE";

  return (
    <div>
      <button
        className={`text-xs flex items-center space-x-2 rounded-2xl border px-3 py-1 font-semibold cursor-pointer transition-colors duration-300 ${
          isDisliked
            ? "bg-[var(--red-button-color)] text-white border-[var(--red-button-color)]"
            : "bg-white border-gray-300 text-[var(--red-button-color)] hover:bg-[#d63847] hover:text-white"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleDislikeClick}
        disabled={loading}
      >
        <ThumbsDown size={15} />
        <span className="text-xs">{dislikeCount}</span>
      </button>
    </div>
  );
};

export default DislikeButton;