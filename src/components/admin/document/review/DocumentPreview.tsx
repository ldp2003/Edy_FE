import React from "react";
import { Form, Select } from "antd";
import { Eye } from "lucide-react";
import type { Document } from "../../../../models/document";

const { Option } = Select;

interface DocumentPreviewProps {
  document: Document;
  isIntensive: boolean;
  onIntensiveChange: (value: boolean) => void;
  onViewDocument: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isIntensive,
  onIntensiveChange,
  onViewDocument,
}) => {
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  // Reset states when document changes
  React.useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [document.cover_page]);
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;

    // Prevent infinite loop by checking if we're already trying the fallback
    if (target.src.includes("default_cover.png")) {
      // If default image also fails, hide the image and show error state
      setImageError(true);
      setImageLoading(false);
      target.style.display = "none";
      return;
    }

    target.src = "/image/default_cover.png";
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Function to get the correct image source
  const getImageSource = (coverPage: string | undefined): string => {
    if (!coverPage) {
      return "/image/default_cover.png";
    }

    // Check if it's a base64 image (starts with data:image/)
    if (coverPage.startsWith("data:image/")) {
      return coverPage;
    }

    // Check if it's a full URL
    if (coverPage.startsWith("http://") || coverPage.startsWith("https://")) {
      return coverPage;
    }

    // Assume it's a relative path
    return coverPage;
  };

  // Calculate estimated file size (placeholder since we don't have actual size)
  const estimatedFileSize = 1024 * 1024; // 1MB placeholder

  return (
    <div className="space-y-4">
      <div className="mb-0 relative group">
        {imageLoading && !imageError && (
          <div
            className="border bg-gray-100 border-gray-200 rounded flex items-center justify-center"
            style={{ maxHeight: "300px", width: "100%", minHeight: "200px" }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!imageError && (
          <img
            src={getImageSource(document.cover_page)}
            alt="Document preview"
            className={`border bg-white border-gray-200 rounded object-cover cursor-pointer hover:opacity-90 transition-opacity ${
              imageLoading ? "hidden" : ""
            }`}
            style={{ maxHeight: "300px", width: "100%" }}
            onClick={onViewDocument}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}

        {imageError && (
          <div
            className="border bg-gray-100 border-gray-200 rounded flex items-center justify-center"
            style={{ maxHeight: "300px", width: "100%", minHeight: "200px" }}
          >
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm">Không thể tải ảnh bìa</p>
            </div>
          </div>
        )}

        {/* Overlay with view icon - only show when image is loaded successfully */}
        {!imageLoading && !imageError && (
          <div
            className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center cursor-pointer rounded opacity-0 group-hover:opacity-100"
            onClick={onViewDocument}
          >
            <Eye size={32} className="text-white" />
          </div>
        )}

        <div className="text-xs text-gray-500 mt-1">
          {formatFileSize(estimatedFileSize)}
          {!imageError && (
            <span
              className="ml-2 text-blue-600 cursor-pointer hover:underline"
              onClick={onViewDocument}
            >
              Xem tài liệu
            </span>
          )}
        </div>
      </div>

      <Form.Item
        style={{ marginBottom: 5 }}
        name="public_mode"
        label={<span className="text-xs">Chế độ công khai</span>}
      >
        <Select disabled>
          <Option value="PUBLIC">Công khai</Option>
          <Option value="PRIVATE">Riêng tư</Option>
        </Select>
      </Form.Item>

      <div className="mt-3">
        <div
          className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isIntensive
              ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 shadow-sm"
              : "bg-gray-50 border-gray-200 hover:border-purple-200 hover:bg-purple-50"
          }`}
          onClick={() => onIntensiveChange(!isIntensive)}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`relative flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${
                isIntensive
                  ? "bg-purple-600 border-purple-600"
                  : "bg-white border-gray-300"
              }`}
            >
              {isIntensive && (
                <svg
                  className="w-3 h-3 text-white animate-in fade-in duration-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium transition-colors ${
                  isIntensive ? "text-purple-800" : "text-gray-700"
                }`}
              >
                Tài liệu chuyên sâu
              </span>
              {isIntensive && (
                <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full animate-in fade-in duration-300">
                  Đã chọn
                </span>
              )}
            </div>
          </div>
          <div
            className={`mt-2 text-xs transition-colors ${
              isIntensive ? "text-purple-600" : "text-gray-500"
            }`}
          >
            {isIntensive
              ? "Tài liệu này sẽ được đánh dấu là chuyên sâu và có thể yêu cầu điểm cao hơn để tải xuống"
              : "Đánh dấu tài liệu này là nội dung chuyên sâu nếu nó có chất lượng cao và chi tiết hơn"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
