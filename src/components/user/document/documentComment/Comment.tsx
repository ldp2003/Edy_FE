import React, { useState } from "react";
import CommentList from "./CommentList";
import type { Comment as CommentType } from "../../../../models/comment";

// Dữ liệu mẫu cho comments
const mockComments: CommentType[] = [
  {
    _id: "comment1",
    doc: "doc123",
    user: {
      _id: "user1",
      first_name: "Nguyễn",
      last_name: "Văn A",
      contact_email: "nguyenvana@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c664e2db47c87d6578986f",
      shared_documents: [],
    },
    content: "Tài liệu này rất hữu ích và dễ hiểu. Cảm ơn tác giả đã chia sẻ!",
    createdAt: "2025-09-28T10:30:00.000Z",
  },
  {
    _id: "comment2",
    doc: "doc123",
    user: {
      _id: "user2",
      first_name: "Trần",
      last_name: "Thị B",
      contact_email: "tranthib@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c795c71a66e9f08445909e",
      shared_documents: [],
    },
    content:
      "Có thể giải thích thêm về phần này không ạ? Tôi chưa hiểu rõ lắm.",
    createdAt: "2025-09-28T14:15:00.000Z",
  },
  {
    _id: "reply1",
    doc: "doc123",
    user: {
      _id: "user3",
      first_name: "Lê",
      last_name: "Văn C",
      contact_email: "levanc@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c664e2db47c87d6578986f",
      shared_documents: [],
    },
    content:
      "Mình cũng có cùng thắc mắc với bạn. Hy vọng tác giả sẽ giải đáp thêm.",
    parent: "comment2",
    createdAt: "2025-09-28T15:45:00.000Z",
  },
  {
    _id: "reply3",
    doc: "doc123",
    user: {
      _id: "user5",
      first_name: "Hoàng",
      last_name: "Thị E",
      contact_email: "hoangthie@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c664e2db47c87d6578986f",
      shared_documents: [],
    },
    content: "Tôi cũng chưa hiểu rõ, mong được giải thích thêm!",
    parent: "comment2",
    createdAt: "2025-09-28T16:00:00.000Z",
  },
  {
    _id: "reply4",
    doc: "doc123",
    user: {
      _id: "user6",
      first_name: "Vũ",
      last_name: "Minh F",
      contact_email: "vuminhf@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c795c71a66e9f08445909e",
      shared_documents: [],
    },
    content: "Có ai có tài liệu tham khảo về chủ đề này không?",
    parent: "comment2",
    createdAt: "2025-09-28T16:10:00.000Z",
  },
  {
    _id: "reply5",
    doc: "doc123",
    user: {
      _id: "user7",
      first_name: "Mai",
      last_name: "Thị G",
      contact_email: "maithig@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c795c71a66e9f08445909e",
      shared_documents: [],
    },
    content: "Mình nghĩ nên hỏi giảng viên để được giải thích kỹ hơn!",
    parent: "comment2",
    createdAt: "2025-09-28T16:20:00.000Z",
  },
  {
    _id: "comment3",
    doc: "doc123",
    user: {
      _id: "user4",
      first_name: "Phạm",
      last_name: "Minh D",
      contact_email: "phamminhd@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c795c71a66e9f08445909e",
      shared_documents: [],
    },
    content:
      "Nội dung rất chất lượng! Tôi đã áp dụng được một số ý tưởng từ tài liệu này vào công việc của mình.",
    createdAt: "2025-09-29T09:20:00.000Z",
  },
  {
    _id: "reply2",
    doc: "doc123",
    user: {
      _id: "user1",
      first_name: "Nguyễn",
      last_name: "Văn A",
      contact_email: "nguyenvana@example.com",
      avatar:
        "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
      organization: "68c664e2db47c87d6578986f",
      shared_documents: [],
    },
    content:
      "Cảm ơn bạn đã chia sẻ! Rất vui khi biết tài liệu có ích cho công việc của bạn.",
    parent: "comment3",
    createdAt: "2025-09-29T10:15:00.000Z",
  },
];

const Comment: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>(mockComments);

  const handleAddComment = async (content: string, parentId?: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newComment: CommentType = {
      _id: `temp_${Date.now()}`,
      doc: "doc123",
      user: {
        _id: "current_user",
        first_name: "Người dùng",
        last_name: "Hiện tại",
        contact_email: "user@example.com",
        avatar:
          "https://res.cloudinary.com/dze57n4oa/image/upload/v1758269410/sheep-47527_1280_q53az1.png",
        organization: "68c664e2db47c87d6578986f",
        shared_documents: [],
      },
      content,
      parent: parentId || null,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);
  };

  return <CommentList comments={comments} onAddComment={handleAddComment} />;
};

export default Comment;
