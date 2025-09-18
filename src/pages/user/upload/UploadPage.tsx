import React, { useState } from "react";
import UploadDocument from "../../../components/user/upload/UploadDocument";
import InfomationForm from "../../../components/user/document/documentForm/InfomationForm";

interface FileInfo {
  url: string;
  originalName: string;
  size: number;
  type: string;
  thumbnail?: string;
}

const UploadPage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<FileInfo | undefined>(
    undefined
  );
  const [isUploading, setIsUploading] = useState(false);

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
      <h1 className="text-base text-left font-bold mb-4">Tải lên tài liệu</h1>
      <UploadDocument 
        onFileUploaded={handleFileUploaded}
        onUploadStart={handleUploadStart}
        onUploadError={handleUploadError}
      />
      <InfomationForm 
        fileInfo={uploadedFile} 
        isUploading={isUploading}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default UploadPage;