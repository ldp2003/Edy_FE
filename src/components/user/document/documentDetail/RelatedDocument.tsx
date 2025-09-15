import { ThumbsUp } from "lucide-react";
import React from "react";

const RelatedDocument: React.FC = () => {
  return (
    <div className="pt-6">
      <h4 className="font-medium text-sm mb-3">Gợi ý cho bạn:</h4>
      <div className="space-y-3">
        <div className="flex space-x-2">
          <img
            src="/placeholder.svg?height=40&width=30"
            alt="Document"
            className="w-8 h-10 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-xs font-medium">
              Tài liệu tổng hợp Kinh tế chính trị Mác LêNin
            </p>
            <p className="text-xs text-gray-500">Kinh tế chính trị Mác-Lênin</p>
            <div className="flex items-center space-x-2 mt-1">
              <ThumbsUp className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-gray-500">160 Lượt thích</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedDocument;
