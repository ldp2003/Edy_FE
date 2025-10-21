import React, { useState } from "react";
import { Download, Heart, ThumbsUp, ThumbsDown, User } from "lucide-react";
import type { Document } from "../../../../models/document";
import AuthorInfo from "../../../common/userInfo/AuthorInfo";

interface DocumentDetailActionsProps {
  document: Document;
}

const DocumentDetailActions: React.FC<DocumentDetailActionsProps> = ({
  document,
}) => {
  const [showAuthorInfo, setShowAuthorInfo] = useState(false);

  return (
    <div className=" bg-white border-t border-gray-200 p-4 z-50">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Nút tải xuống */}
        <button className="px-4 py-2 bg-[var(--green-button-color)] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90">
          <Download size={16} />
          <span>Tải xuống</span>
        </button>

        <div className="flex items-center gap-4">
          {/* Nút yêu thích */}
          <button className="text-[var(--primary-text-color)] hover:text-[var(--primary-color)]/80">
            <Heart size={24} />
          </button>

          {/* Nút xem thông tin người đăng */}
          <button
            onClick={() => setShowAuthorInfo(!showAuthorInfo)}
            className="text-[var(--primary-text-color)] hover:text-[var(--primary-color)]/80"
          >
            <User size={24} />
          </button>
        </div>
      </div>

      {/* Panel thông tin người đăng */}
      {showAuthorInfo && (
        <div className="fixed bottom-[72px] left-0 right-0 bg-white border-t border-gray-200 p-4 animate-in slide-in-from-bottom">
          <div className="max-w-screen-xl mx-auto">
            <AuthorInfo document={document} />
            <div className="flex items-center justify-center gap-8 mt-4">
              <button className="flex items-center gap-2 text-[var(--primary-color)]">
                <ThumbsUp size={20} />
                <span className="text-sm">Thích</span>
              </button>
              <button className="flex items-center gap-2 text-[var(--primary-color)]">
                <ThumbsDown size={20} />
                <span className="text-sm">Không thích</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailActions;
