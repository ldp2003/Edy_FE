import React, { useState } from "react";
import UploadDocument from "../../../components/user/upload/UploadDocument";
import InfomationForm from "../../../components/user/document/documentForm/InfomationForm";
import { message, Steps } from "antd";

interface FileInfo {
  url: string;
  originalName: string;
  size: number;
  type: string;
  thumbnail?: string;
  pageCount?: number;
}

const UploadPage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<FileInfo | undefined>(
    undefined
  );
  const [isUploading, setIsUploading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Calculate current step based on state
  const getCurrentStep = () => {
    if (uploadedFile && !isUploading) return 1; // File uploaded, filling information
    if (isUploading) return 0; // Uploading file
    return 0; // Selecting file
  };

  const uploadSteps = [
    {
      title: "Chọn file",
      description: "Tải lên tài liệu của bạn",
    },
    {
      title: "Điền thông tin",
      description: "Nhập chi tiết tài liệu",
    },
    {
      title: "Đăng tải",
      description: "Hoàn thành và xuất bản",
    },
  ];
  const handleFileUploaded = (fileInfo: FileInfo) => {
    setUploadedFile(fileInfo);
    setIsUploading(false);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadedFile(undefined); // Reset previous file
  };

  const handleUploadError = () => {
    setIsUploading(false);
  };

  const handleUploadSuccess = () => {
    setUploadedFile(undefined); // Reset fileInfo để clear image
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen">
      {contextHolder}

      {/* Progress Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--primary-text-color)] mb-4 text-center md:text-left">
              Đăng tải tài liệu
            </h1>
            <Steps
              current={getCurrentStep()}
              items={uploadSteps}
              size="small"
              className="upload-progress-steps"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h1 className="text-lg sm:text-xl text-gray-900 font-bold mb-4 text-center md:text-left">
              Tải lên tài liệu
            </h1>
            <UploadDocument
              onFileUploaded={handleFileUploaded}
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              onRemoveFile={handleUploadSuccess}
              messageApi={messageApi}
            />
          </div>

          {/* Information Form */}
          <InfomationForm
            fileInfo={uploadedFile}
            isUploading={isUploading}
            onUploadSuccess={handleUploadSuccess}
            messageApi={messageApi}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
