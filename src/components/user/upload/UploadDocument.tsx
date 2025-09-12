import { Card, Upload } from "antd";
import React from "react";

const UploadDocument: React.FC = () => {
  return (
    <div>
      <Card className="mb-6">
        <Upload.Dragger
          multiple={false}
          maxCount={1}
          accept=".doc,.docx,.pdf,.ppt,.xls,.xlsx"
        >
          <p className="text-lg font-medium">
            Kéo thả hoặc tải file tài liệu lên
          </p>
          <p className="text-sm text-gray-500">
            Các file hỗ trợ: doc, docx, pdf, ppt, xls, xlsx (≤10MB)
          </p>
        </Upload.Dragger>
      </Card>
    </div>
  );
};

export default UploadDocument;
