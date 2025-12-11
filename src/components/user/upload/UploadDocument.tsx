/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Upload, Progress } from "antd";
import { CloudUpload } from "lucide-react";
import React, { useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import * as pdfjsLib from "pdfjs-dist";
import { generateRandomPublicId } from "../../../utils/CloudinaryService";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface UploadDocumentProps {
  onFileUploaded?: (fileInfo: {
    url: string;
    originalName: string;
    size: number;
    type: string;
    thumbnail?: string;
    pageCount?: number;
  }) => void;
  onUploadStart?: () => void;
  onUploadError?: () => void;
  onRemoveFile?: () => void;
  messageApi?: {
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
    info: (content: string) => void;
  };
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  onFileUploaded,
  onUploadStart,
  onUploadError,
  onRemoveFile,
  messageApi,
}) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isPdfDocument = (file: File): boolean => {
    return (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    );
  };

  const createPdfThumbnail = async (file: File): Promise<string | null> => {
    try {
      if (!isPdfDocument(file)) {
        return null;
      }

      // console.log("Generating PDF thumbnail...");

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Get first page
      const page = await pdf.getPage(1);

      // Set scale for high quality thumbnail
      const scale = 1.0;
      const viewport = page.getViewport({ scale });

      // Create canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };

      await page.render(renderContext).promise;

      // Convert to JPEG with good quality
      const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);

      // console.log("PDF thumbnail generated successfully");
      return thumbnailDataUrl;
    } catch (error) {
      console.error("Error creating PDF thumbnail:", error);
      return null;
    }
  };

  const getPdfPageCount = async (file: File): Promise<number | null> => {
    try {
      if (!isPdfDocument(file)) {
        return null;
      }

      // console.log("Counting PDF pages...");

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const pageCount = pdf.numPages;
      // console.log("PDF page count:", pageCount);

      return pageCount;
    } catch (error) {
      // console.error("Error counting PDF pages:", error);
      return null;
    }
  };

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

  const isPdfFile = (file: File): boolean => {
    return (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    );
  };

  const createWordThumbnail = async (file: File): Promise<string | null> => {
    try {
      if (!isWordDocument(file)) {
        return null;
      }

      // console.log("Generating Word document thumbnail...");

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
        scale: 1.0,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 816,
        height: 1056,
      });

      // Clean up
      document.body.removeChild(container);

      // Convert to JPEG with lower quality to reduce size
      const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      return thumbnailDataUrl;
    } catch (error) {
      console.error("Error creating Word thumbnail:", error);
      return null;
    }
  };

  const getWordPageCount = async (file: File): Promise<number | null> => {
    try {
      if (!isWordDocument(file)) {
        return null;
      }

      // console.log("Counting Word document pages...");

      // Create container for rendering
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "816px"; // A4 width
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

      // Count page breaks (pages are usually separated by page-break elements)
      const pageBreaks = container.querySelectorAll(
        '.docx-wrapper .page-break, .docx-wrapper [style*="page-break"]'
      );
      let pageCount = pageBreaks.length + 1; // +1 for the first page

      // Alternative: count by estimated height
      if (pageCount <= 1) {
        const containerHeight = container.scrollHeight;
        const pageHeight = 1056; // A4 height in pixels
        pageCount = Math.max(1, Math.ceil(containerHeight / pageHeight));
      }

      // Clean up
      document.body.removeChild(container);

      // console.log("Word document page count:", pageCount);
      return pageCount;
    } catch (error) {
      // console.error("Error counting Word document pages:", error);
      return null;
    }
  };

  const uploadToCloudinary = async (
    file: File
  ): Promise<{ url: string; thumbnail?: string; pageCount?: number }> => {
    // Hàm upload file lên Cloudinary:
    // - Đếm số trang cho PDF (sử dụng PDF.js) hoặc Word (sử dụng docx-preview và html2canvas)
    // - Tạo thumbnail cho PDF (render trang đầu bằng canvas) hoặc Word (render HTML rồi chụp screenshot)
    // - Upload file chính lên Cloudinary với preset và public_id ngẫu nhiên
    // - Nếu có thumbnail Word, upload riêng và lấy URL
    // - Trả về object chứa url (URL file chính), thumbnail (URL ảnh preview), pageCount (số trang)
    // Tham số: file - đối tượng File từ input upload
    // Trả về: Promise với object {url: string, thumbnail?: string, pageCount?: number}
    // console.log("Starting upload to Cloudinary...");
    // console.log("File:", file.name, file.size, file.type);

    // Count pages for PDF and Word documents
    let pageCount: number | undefined;
    if (isPdfFile(file)) {
      try {
        // console.log("Counting PDF pages...");
        const pdfPageCount = await getPdfPageCount(file);
        if (pdfPageCount !== null) {
          pageCount = pdfPageCount;
          // console.log("PDF page count:", pageCount);
        }
      } catch (error) {
        console.error("Failed to count PDF pages:", error);
      }
    } else if (isWordDocument(file)) {
      try {
        // console.log("Counting Word document pages...");
        const wordPageCount = await getWordPageCount(file);
        if (wordPageCount !== null) {
          pageCount = wordPageCount;
          // console.log("Word page count:", pageCount);
        }
      } catch (error) {
        // console.error("Failed to count Word pages:", error);
      }
    }

    // Generate Word thumbnail if it's a Word document
    let wordThumbnail: string | null = null;
    if (isWordDocument(file)) {
      try {
        // console.log("Generating Word document thumbnail...");
        wordThumbnail = await createWordThumbnail(file);
        if (wordThumbnail) {
          // console.log("Word thumbnail generated successfully");
        }
      } catch (error) {
        // console.error("Failed to generate Word thumbnail:", error);
      }
    }

    // Upload main file first
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
    formData.append("public_id", generateRandomPublicId());

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
      // console.log("Main file upload success:", data);

      let thumbnailUrl: string | undefined;

      // Upload thumbnail if available
      if (wordThumbnail) {
        try {
          // console.log("Uploading Word thumbnail to Cloudinary...");

          const thumbnailFormData = new FormData();
          thumbnailFormData.append("file", wordThumbnail); // Upload base64 data URL directly
          thumbnailFormData.append("upload_preset", preset || "");
          thumbnailFormData.append("resource_type", "image");
          thumbnailFormData.append(
            "public_id",
            `${generateRandomPublicId()}_thumb`
          );

          const thumbnailResponse = await fetch(uploadUrl, {
            method: "POST",
            body: thumbnailFormData,
          });

          if (thumbnailResponse.ok) {
            const thumbnailData = await thumbnailResponse.json();
            thumbnailUrl = thumbnailData.secure_url;
            // console.log("Thumbnail uploaded successfully:", thumbnailUrl);
          } else {
            // console.error("Failed to upload thumbnail");
          }
        } catch (error) {
          // console.error("Error uploading thumbnail:", error);
        }
      }

      return {
        url: data.secure_url,
        thumbnail:
          thumbnailUrl || (await createPdfThumbnail(file)) || undefined,
        pageCount,
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
        return "POWERPOINT";
      case "xls":
      case "xlsx":
        return "EXCEL";
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
      case "flv":
      case "mkv":
      case "webm":
        return "VIDEO";
      default:
        return "OTHER";
    }
  };

  const customUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    // Hàm xử lý upload tùy chỉnh cho Antd Upload component:
    // - Set trạng thái uploading = true, reset progress
    // - Gọi callback onUploadStart để thông báo parent component bắt đầu upload
    // - Gọi uploadToCloudinary để upload file và lấy kết quả
    // - Tạo object fileInfo từ kết quả upload (url, originalName, size, type, thumbnail, pageCount)
    // - Gọi callback onFileUploaded(fileInfo) để truyền dữ liệu file đã upload lên parent (UploadPage)
    // - Hiển thị message success/error qua messageApi
    // - Gọi onSuccess/onError của Upload component
    // - Reset trạng thái uploading và progress sau khi xong
    // Tham số: {file, onSuccess, onError} - từ Antd Upload
    setUploading(true);
    setUploadProgress(0);
    onUploadStart?.();

    try {
      const uploadResult = await uploadToCloudinary(file as File);
      // console.log("Upload result:", uploadResult);
      const fileInfo = {
        url: uploadResult.url,
        originalName: (file as File).name,
        size: (file as File).size,
        type: getFileType((file as File).name),
        thumbnail: uploadResult.thumbnail,
        pageCount: uploadResult.pageCount,
      };

      if (onFileUploaded) {
        onFileUploaded(fileInfo);
      }

      if (messageApi) {
        messageApi.success(`${(file as File).name} được tải lên thành công!`);
      }
      onSuccess?.(uploadResult.url);
    } catch (error) {
      console.error("Upload error:", error);
      if (messageApi) {
        messageApi.error(`Tải lên ${(file as File).name} thất bại!`);
      }
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

  const handleRemove = () => {
    setFileList([]);
    onRemoveFile?.();
    if (messageApi) {
      messageApi.info("Đã gỡ file. Bạn có thể tải file mới.");
    }
    return true;
  };

  return (
    <div>
      <Card
        className="mb-2"
        style={{ backgroundColor: "var(--field-background-color)" }}
        size="small"
      >
        <Upload.Dragger
          multiple={false}
          maxCount={1}
          accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm"
          customRequest={customUpload}
          fileList={fileList}
          onChange={handleChange}
          onRemove={handleRemove}
          disabled={uploading}
          beforeUpload={() => {
            if (uploading || fileList.length > 0) {
              if (messageApi) {
                messageApi.warning(
                  "Chỉ được tải 1 file và chờ hoàn tất trước khi tải mới!"
                );
              }
              return Upload.LIST_IGNORE; // Ngăn upload
            }
            return true;
          }}
        >
          <div className="flex flex-col items-center text-center p-2 sm:p-3">
            <CloudUpload
              size={window.innerWidth < 640 ? 40 : 50}
              color={uploading ? "#d1d5db" : "var(--primary-color)"}
              className={`${uploading ? "animate-pulse" : ""} mb-2`}
            />
            <p className="text-xs sm:text-sm font-bold mb-1">
              {uploading
                ? "Đang tải lên..."
                : "Kéo thả hoặc tải file tài liệu lên"}
            </p>
            <p className="text-xs text-gray-500 italic px-1">
              Các file có thể đăng tải lên hệ thống bao gồm: doc, docx, pdf,
              ppt, pptx, xls, xlsx, mp4, avi, mov, wmv, flv, mkv, webm tối đa
              10MB
            </p>

            {uploading && (
              <div className="mt-2 w-full max-w-xs">
                <Progress
                  percent={uploadProgress}
                  size="small"
                  status={uploadProgress === 100 ? "success" : "active"}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
                <p className="text-xs text-gray-500 mt-0.5">
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
