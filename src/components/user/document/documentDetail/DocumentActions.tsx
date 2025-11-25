/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import DownloadButton from "../../../common/buttons/DownloadButton";
import ReportButton from "../../../common/buttons/ReportButton";
import LikeButton from "../../../common/buttons/LikeButton";
import DislikeButton from "../../../common/buttons/DislikeButton";
import FavoriteButton from "../../../common/buttons/FavoriteButton";
import ShareButton from "../../../common/buttons/ShareButton";
import type { Document } from "../../../../models/document";
import { UserContext } from "../../../../contexts/UserContext";
import { DocumentService } from "../../../../utils/DocumentService";

interface DocumentActionsProps {
  document: Document;
  isUser?: boolean;
}

interface ReactionData {
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  isUser = false,
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const { user, account } = React.useContext(UserContext);
  const [reactionData, setReactionData] = useState<ReactionData>({
    likes: 0,
    dislikes: 0,
    userReaction: null,
  });
  const [reactionsLoading, setReactionsLoading] = useState(true);

  //fetch reactions
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setReactionsLoading(true);
        const response = await DocumentService.getDocumentReactions(
          document._id
        );

        const userReactionValue =
          response.reacted === "NONE" ? null : response.reacted;

        setReactionData({
          likes: response.likes || 0,
          dislikes: response.dislikes || 0,
          userReaction: userReactionValue,
        });
      } catch (error) {
        console.error("Error fetching reactions:", error);
        // Set default values on error
        setReactionData({
          likes: 0,
          dislikes: 0,
          userReaction: null,
        });
      } finally {
        setReactionsLoading(false);
      }
    };

    if (user) {
      fetchReactions();
    } else {
      setReactionsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document._id, user?._id]);

  const refetchReactions = useCallback(async () => {
    try {
      const response = await DocumentService.getDocumentReactions(document._id);
      const userReactionValue =
        response.reacted === "NONE" ? null : response.reacted;

      const newReactionData = {
        likes: response.likes || 0,
        dislikes: response.dislikes || 0,
        userReaction: userReactionValue,
      };

      setReactionData(newReactionData);

      // Dispatch event để update cả 2 buttons
      window.dispatchEvent(
        new CustomEvent("reactionRefetch", {
          detail: {
            documentId: document._id,
            ...newReactionData,
          },
        })
      );
    } catch (error) {
      console.error("Error refetching reactions:", error);
    }
  }, [document._id]);

  // Listen for reaction changes from Like/Dislike buttons
  useEffect(() => {
    const handleReactionChanged = (event: any) => {
      if (event.detail.documentId === document._id) {
        refetchReactions();
      }
    };

    window.addEventListener("reactionChanged", handleReactionChanged);
    return () =>
      window.removeEventListener("reactionChanged", handleReactionChanged);
  }, [document._id, refetchReactions]);

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

  // Show message for deleted documents
  if (document.is_deleted) {
    return (
      <div className="flex flex-col items-center justify-center m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <span className="text-red-600 font-medium mb-2">
          Tài liệu này đã bị xóa
        </span>
        {document.is_delete_by_admin ? (
          <div className="text-sm text-red-500 text-center">
            <div>
              Lý do:{" "}
              {document.delete_by_admin_reason || "Không có lý do cụ thể"}
            </div>
            {document.delete_by_admin_at && (
              <div>
                Thời gian xóa:{" "}
                {new Date(document.delete_by_admin_at).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            Tài liệu đã bị xóa bởi người dùng
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-document-actions={document._id}
      className={`flex items-center justify-between p-2 transition-all duration-300 ${
        isFixed
          ? `absolute top-0 bg-[var(--secondary-background-color)] shadow-md z-10 mx-[-16px] px-4 w-[calc(100%-335px)]`
          : ""
      }`}
    >
      {!isUser && (
        <DownloadButton
          point={
            account?.is_vip
              ? document.intensive
                ? 5
                : 3
              : document.intensive
              ? 6
              : 4
          }
          documentId={document._id}
          documentTitle={document.title}
        />
      )}

      <div className="flex items-center space-x-4">
        {!isUser && (
          <ReportButton
            documentId={document._id}
            documentTitle={document.title}
          />
        )}
        {user && !reactionsLoading && (
          <>
            <LikeButton
              documentId={document._id}
              initialLikeCount={reactionData.likes}
              initialUserReaction={reactionData.userReaction}
              documentOwnerId={document.user._id}
              documentTitle={document.title}
            />
            <DislikeButton
              documentId={document._id}
              initialDislikeCount={reactionData.dislikes}
              initialUserReaction={reactionData.userReaction}
              documentOwnerId={document.user._id}
              documentTitle={document.title}
            />
          </>
        )}

        {/* Show loading state for reactions */}
        {user && reactionsLoading && (
          <>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl border border-gray-300 px-3 py-1">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <span className="text-xs text-gray-400">-</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl border border-gray-300 px-3 py-1">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <span className="text-xs text-gray-400">-</span>
            </div>
          </>
        )}
        <FavoriteButton documentId={document._id} />
        {!document.is_deleted && (
          <ShareButton
            documentId={document._id}
            documentTitle={document.title}
            isPublic={document.public_mode === "PUBLIC"}
            isSharedWithOrganization={
              document.public_mode === "SHARE_ORGANIZATION"
            }
            isPrivate={document.public_mode === "PRIVATE"}
            isPrivateShared={document.public_mode === "PRIVATE_SHARED"}
            isOwner={document.user._id === user?._id}
          />
        )}
      </div>
    </div>
  );
};
export default DocumentActions;
