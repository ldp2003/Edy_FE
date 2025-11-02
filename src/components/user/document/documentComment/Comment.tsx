import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import CommentList from "./CommentList";
import type { Comment as CommentType } from "../../../../models/comment";
import { CommentService } from "../../../../utils/CommentService";
import { DocumentService } from "../../../../utils/DocumentService";
import type { Document } from "../../../../models/document";

interface CommentProps {
  documentId: string;
}

const Comment: React.FC<CommentProps> = ({ documentId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<Document | null>(null);

  // Fetch document info and comments khi component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!documentId) return;

      setLoading(true);
      try {
        // Fetch document info để lấy owner ID
        const documentData = await DocumentService.getDocumentById(documentId);
        setDocument(documentData);

        // Fetch comments
        const result = await CommentService.getCommentsByDocument(documentId);
        if (result.success) {
          setComments(result.data.comments || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  // Hàm cập nhật comments (dùng cho service)
  const handleCommentsUpdate = (updatedComments: CommentType[]) => {
    setComments(updatedComments);
  };

  // Hàm fallback cho mock (backward compatibility)
  const handleAddComment = async (content: string, parentId?: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newComment: CommentType = {
      _id: `temp_${Date.now()}`,
      doc: documentId,
      user: {
        _id: "current_user",
        first_name: "Người dùng",
        last_name: "Hiện tại",
        avatar:
          "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
        organization: {
          _id: "68c664e2db47c87d6578986f",
          name: "Tổ chức mặc định",
        },
      },
      content,
      parent: parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);
  };

  if (loading) {
    return (
      <div className="py-6 border-b-gray-200 border-b text-center">
        <Spin />
        <p className="mt-2 text-gray-500">Đang tải bình luận...</p>
      </div>
    );
  }

  return (
    <CommentList
      documentId={documentId}
      documentOwnerId={document?.user?._id}
      comments={comments}
      onAddComment={handleAddComment}
      onCommentsUpdate={handleCommentsUpdate}
    />
  );
};

export default Comment;
