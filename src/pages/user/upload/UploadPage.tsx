import React, { useState, useEffect } from "react";
import UploadDocument from "../../../components/user/upload/UploadDocument";
import InfomationForm from "../../../components/user/document/documentForm/InfomationForm";
import { message, Steps } from "antd";
import { CloudinaryService } from "../../../utils/CloudinaryService";

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
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [cleanupTimer, setCleanupTimer] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Handle cleanup when user tries to leave the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadedFileUrl && isUploading) {
        // Show browser's native confirmation dialog
        e.preventDefault();
        e.returnValue =
          "Bạn có file đang tải lên. Bạn có chắc muốn thoát? File đã tải lên sẽ bị xóa.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadedFileUrl, isUploading]);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Clear cleanup timer
      if (cleanupTimer) {
        clearTimeout(cleanupTimer);
      }

      // Cleanup when component unmounts (user navigates away)
      if (uploadedFileUrl && isUploading) {
        // Note: This cleanup runs when component unmounts, but async operations
        // might not complete. The beforeunload handler above handles browser close/refresh
        console.log(
          "Component unmounting with uploaded file, cleanup may be needed"
        );
      }
    };
  }, [uploadedFileUrl, isUploading, cleanupTimer]);

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
    setUploadedFileUrl(fileInfo.url); // Store URL for cleanup
    setIsUploading(false);

    // Set cleanup timer for 30 minutes (30 * 60 * 1000 ms)
    // Capture the URL value for the timeout callback
    const currentUrl = fileInfo.url;
    const timer = window.setTimeout(async () => {
      try {
        await CloudinaryService.deleteFile(currentUrl);
        console.log("Auto-cleanup: Deleted uploaded file after timeout");
      } catch (error) {
        console.error("Auto-cleanup failed:", error);
      }
    }, 30 * 60 * 1000);

    setCleanupTimer(timer);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadedFile(undefined); // Reset previous file
    setUploadedFileUrl(null); // Reset URL

    // Clear any existing cleanup timer
    if (cleanupTimer) {
      clearTimeout(cleanupTimer);
      setCleanupTimer(null);
    }
  };

  const handleUploadError = () => {
    setIsUploading(false);
    setUploadedFileUrl(null); // Clear URL on error

    // Clear cleanup timer
    if (cleanupTimer) {
      clearTimeout(cleanupTimer);
      setCleanupTimer(null);
    }
  };

  const handleRemoveFile = async () => {
    // Clear cleanup timer first
    if (cleanupTimer) {
      clearTimeout(cleanupTimer);
      setCleanupTimer(null);
    }

    if (uploadedFileUrl) {
      try {
        await CloudinaryService.deleteFile(uploadedFileUrl);
        messageApi.success("Đã xóa file tải lên");
      } catch (error) {
        console.error("Failed to delete uploaded file:", error);
        messageApi.error("Không thể xóa file đã tải lên");
      }
    }
    setUploadedFile(undefined);
    setUploadedFileUrl(null);
    setIsUploading(false);
  };

  const handleUploadSuccess = () => {
    // Clear cleanup timer since upload was successful
    if (cleanupTimer) {
      clearTimeout(cleanupTimer);
      setCleanupTimer(null);
    }

    setUploadedFile(undefined); // Reset fileInfo để clear image
    setUploadedFileUrl(null); // Clear URL after successful upload
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen">
      {contextHolder}

      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-base sm:text-base font-bold text-[var(--primary-text-color)] mb-2 text-center md:text-left">
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Upload Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h1 className="text-base sm:text-base text-[var(--primary-text-color)] font-bold mb-4 text-center md:text-left">
              Tải lên tài liệu
            </h1>
            <UploadDocument
              onFileUploaded={handleFileUploaded}
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              onRemoveFile={handleRemoveFile}
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
