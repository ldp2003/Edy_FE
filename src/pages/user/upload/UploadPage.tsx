import React, { useState } from "react";
import UploadDocument from "../../../components/user/upload/UploadDocument";
import InfomationForm from "../../../components/user/document/documentForm/InfomationForm";

interface FileInfo {
  url: string;
  originalName: string;
  size: number;
  type: string;
}

const UploadPage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<FileInfo | undefined>(
    undefined
  );

  const handleFileUploaded = (fileInfo: FileInfo) => {
    setUploadedFile(fileInfo);
  };

  return (
    <div>
      <h1 className="text-base text-left font-bold mb-4">Tải lên tài liệu</h1>
      <UploadDocument onFileUploaded={handleFileUploaded} />
      <InfomationForm fileInfo={uploadedFile} />
    </div>
  );
};

export default UploadPage;
