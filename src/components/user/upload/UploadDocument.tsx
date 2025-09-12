import { Card, Upload } from "antd";
import { CloudUpload } from "lucide-react";
import React from "react";

const UploadDocument: React.FC = () => {
  return (
    <div>
      <Card
        className="mb-6"
        style={{ backgroundColor: "var(--field-background-color)" }}
      >
        <Upload.Dragger
          multiple={false}
          maxCount={1}
          accept=".doc,.docx,.pdf,.ppt,.xls,.xlsx"
        >
          <div className="flex flex-col items-center text-center">
            <CloudUpload size={150} color="var(--primary-color)" />
            <p className="text-lg font-bold mt-4">
              Kéo thả hoặc tải file tài liệu lên
            </p>
            <p className="text-base text-back italic mt-4">
              Các file có thể đăng tải lên hệ thống bao gồm: doc, docx, pdf,
              ppt, xls, xlsx tối đa 10MB
            </p>
          </div>
        </Upload.Dragger>
      </Card>
    </div>
  );
};

export default UploadDocument;
