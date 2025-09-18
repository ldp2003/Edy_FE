import { Card, Upload, message } from "antd";
import { CloudUpload } from "lucide-react";
import React, { useState } from "react";
import type { UploadFile, UploadProps } from "antd";

interface UploadDocumentProps {
  onFileUploaded?: (fileInfo: {
    url: string;
    originalName: string;
    size: number;
    type: string;
  }) => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ onFileUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    console.log("Starting upload to Cloudinary...");
    console.log("File:", file.name, file.size, file.type);

    // Use auto upload endpoint for documents
    const uploadUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_NAME
    }/auto/upload`;

    console.log("Cloudinary Config:", {
      cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
      preset: import.meta.env.VITE_CLOUDINARY_PRESET,
      url: uploadUrl,
    });

    const formData = new FormData();
    formData.append("file", file);

    // Check if preset exists, otherwise try without preset for debugging
    const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
    if (preset && preset !== "undefined") {
      formData.append("upload_preset", preset);
    } else {
      console.warn(
        "No upload preset found, this might cause authentication issues"
      );
    }

    formData.append("resource_type", "auto"); // Allow any file type

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        console.error("Response error:", responseText);
        throw new Error(`Upload failed: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log("Upload success:", data);
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      // Provide more helpful error message
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          throw new Error(
            "Lỗi xác thực Cloudinary. Vui lòng kiểm tra upload preset."
          );
        } else if (error.message.includes("400")) {
          throw new Error("File không hợp lệ hoặc quá lớn.");
        } else {
          throw new Error(`Lỗi upload: ${error.message}`);
        }
      }
      throw error;
    }
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "word";
      case "ppt":
      case "pptx":
        return "ppt";
      case "xls":
      case "xlsx":
        return "excel";
      default:
        return "other";
    }
  };

  const getDocumentType = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes("báo cáo") || name.includes("report"))
      return "research-report";
    if (name.includes("đề cương") || name.includes("outline"))
      return "study-guide";
    if (name.includes("giáo trình") || name.includes("textbook"))
      return "textbook";
    if (name.includes("tiểu luận") || name.includes("essay")) return "essay";
    if (name.includes("bài giải") || name.includes("solution"))
      return "solution-set";
    if (name.includes("luận văn") || name.includes("thesis")) return "thesis";
    if (name.includes("bài giảng") || name.includes("lecture"))
      return "lecture";
    return "other";
  };

  const customUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    setUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file as File);

      const fileInfo = {
        url: uploadedUrl,
        originalName: (file as File).name,
        size: (file as File).size,
        type: getFileType((file as File).name),
      };

      // Call parent callback with file info
      if (onFileUploaded) {
        onFileUploaded(fileInfo);
      }

      message.success(`${(file as File).name} được tải lên thành công!`);
      onSuccess?.(uploadedUrl);
    } catch (error) {
      console.error("Upload error:", error);
      message.error(`Tải lên ${(file as File).name} thất bại!`);
      onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div>
      <Card
        className="mb-6"
        style={{ backgroundColor: "var(--field-background-color)" }}
        size="small"
      >
        <Upload.Dragger
          multiple={false}
          maxCount={1}
          accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
          customRequest={customUpload}
          fileList={fileList}
          onChange={handleChange}
          disabled={uploading}
        >
          <div className="flex flex-col items-center text-center">
            <CloudUpload
              size={80}
              color={uploading ? "#d1d5db" : "var(--primary-color)"}
            />
            <p className="text-sm font-bold">
              {uploading
                ? "Đang tải lên..."
                : "Kéo thả hoặc tải file tài liệu lên"}
            </p>
            <p className="text-xs text-back italic">
              Các file có thể đăng tải lên hệ thống bao gồm: doc, docx, pdf,
              ppt, pptx, xls, xlsx tối đa 10MB
            </p>
          </div>
        </Upload.Dragger>
      </Card>
    </div>
  );
};

export default UploadDocument;
