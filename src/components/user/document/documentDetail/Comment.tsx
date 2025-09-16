import { Button } from "antd";
import React from "react";

const Comment: React.FC = () => {
  return (
    <div className="py-6 border-b-gray-200 border-b">
      <h4 className="font-medium text-lg mb-3">Bình luận:</h4>
      <textarea
        placeholder="Hãy nêu cảm nhận của bạn"
        className="w-full p-2 border border-gray-200 rounded text-xs resize-none"
        rows={3}
      />
      <Button size="small" className="mt-2 bg-blue-500 hover:bg-blue-600">
        Gửi
      </Button>
    </div>
  );
};

export default Comment;
