import React, { useState } from "react";
import UploadDocument from "../../../components/user/upload/UploadDocument";
import InfomationForm from "../../../components/user/document/documentForm/InfomationForm";
import { message } from "antd";

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
    <div>
      {contextHolder}
      <div className="bg-white p-6 rounded-lg border border-[var(--border-color)] my-6">
        <h1 className="text-base text-[var(--primary-text-color)] text-left font-bold">
          Tải lên tài liệu
        </h1>
        <UploadDocument
          onFileUploaded={handleFileUploaded}
          onUploadStart={handleUploadStart}
          onUploadError={handleUploadError}
        />
      </div>

      <InfomationForm
        fileInfo={uploadedFile}
        isUploading={isUploading}
        onUploadSuccess={handleUploadSuccess}
        messageApi={messageApi}
      />
    </div>
  );
};

export default UploadPage;
