import { Card, Upload, message, Progress } from "antd";
import { CloudUpload } from "lucide-react";
import React, { useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";

interface UploadDocumentProps {
  onFileUploaded?: (fileInfo: {
    url: string;
    originalName: string;
    size: number;
    type: string;
    thumbnail?: string;
  }) => void;
  onUploadStart?: () => void;
  onUploadError?: () => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  onFileUploaded,
  onUploadStart,
  onUploadError,
}) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Word thumbnail generation utilities
  const isWordDocument = (file: File): boolean => {
    const wordTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const wordExtensions = [".doc", ".docx"];

    return (
      wordTypes.includes(file.type) ||
      wordExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
  };

  const createWordThumbnail = async (file: File): Promise<string | null> => {
    try {
      if (!isWordDocument(file)) {
        return null;
      }

      // Create container for rendering
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "816px"; // A4 width
      container.style.height = "1056px"; // A4 height
      container.style.backgroundColor = "white";
      container.style.padding = "72px"; // 1 inch margins
      container.style.boxSizing = "border-box";
      container.style.fontFamily = "Times, serif";
      container.style.fontSize = "12pt";
      container.style.lineHeight = "1.5";
      document.body.appendChild(container);

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Render document using docx-preview
      await renderAsync(arrayBuffer, container, undefined, {
        className: "docx-wrapper",
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: false,
        debug: false,
      });

      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Take screenshot with high quality
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 816,
        height: 1056,
      });

      // Clean up
      document.body.removeChild(container);

      // Convert to JPEG with good quality
      const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      return thumbnailDataUrl;
    } catch (error) {
      console.error("Error creating Word thumbnail:", error);
      return null;
    }
  };

  const uploadToCloudinary = async (
    file: File
  ): Promise<{ url: string; thumbnail?: string }> => {
    console.log("Starting upload to Cloudinary...");
    console.log("File:", file.name, file.size, file.type);

    // Generate Word thumbnail if it's a Word document
    let wordThumbnail: string | null = null;
    if (isWordDocument(file)) {
      try {
        console.log("Generating Word document thumbnail...");
        wordThumbnail = await createWordThumbnail(file);
        if (wordThumbnail) {
          console.log("Word thumbnail generated successfully");
        }
      } catch (error) {
        console.error("Failed to generate Word thumbnail:", error);
      }
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_NAME
    }/auto/upload`;

    const formData = new FormData();
    formData.append("file", file);

    const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
    if (preset && preset !== "undefined") {
      formData.append("upload_preset", preset);
    } else {
      console.warn(
        "No upload preset found, this might cause authentication issues"
      );
    }

    formData.append("resource_type", "auto");

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 200);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${responseText}`);
      }

      const data = await response.json();
      console.log("Upload success:", data);

      let thumbnailUrl;
      if (data.format === "pdf") {
        thumbnailUrl = data.secure_url.replace(
          "/upload/",
          "/upload/c_thumb,w_300,h_400,f_jpg/"
        );
      } else if (wordThumbnail) {
        // Use generated Word thumbnail
        thumbnailUrl = wordThumbnail;
      }

      return {
        url: data.secure_url,
        thumbnail: thumbnailUrl,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setUploadProgress(0);

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
        return "PDF";
      case "doc":
      case "docx":
        return "WORD";
      case "ppt":
      case "pptx":
        return "PPT";
      case "xls":
      case "xlsx":
        return "EXCEL";
      default:
        return "OTHER";
    }
  };

  const customUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    setUploading(true);
    setUploadProgress(0);
    onUploadStart?.();

    try {
      const uploadResult = await uploadToCloudinary(file as File);

      const fileInfo = {
        url: uploadResult.url,
        originalName: (file as File).name,
        size: (file as File).size,
        type: getFileType((file as File).name),
        thumbnail: uploadResult.thumbnail,
      };

      if (onFileUploaded) {
        onFileUploaded(fileInfo);
      }

      message.success(`${(file as File).name} được tải lên thành công!`);
      onSuccess?.(uploadResult.url);
    } catch (error) {
      console.error("Upload error:", error);
      message.error(`Tải lên ${(file as File).name} thất bại!`);
      onError?.(error as Error);
      onUploadError?.();
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after 1s
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
              className={uploading ? "animate-pulse" : ""}
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

            {uploading && (
              <div className="mt-4 w-full max-w-xs">
                <Progress
                  percent={uploadProgress}
                  size="small"
                  status={uploadProgress === 100 ? "success" : "active"}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Đang tải lên... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </Upload.Dragger>
      </Card>
    </div>
  );
};

export default UploadDocument;
