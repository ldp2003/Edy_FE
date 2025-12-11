import { CloudDownload, Copy, ExternalLink, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { Modal, Button, message, Spin } from "antd";
import { DocumentService } from "../../../utils/DocumentService";

interface DownloadButtonProps {
  point: number;
  documentId: string;
  documentTitle?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  point,
  documentId,
  documentTitle = "tài liệu",
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper function to reset modal state
  const resetModalState = () => {
    setDownloadLink(null);
    setErrorMessage(null);
    setLoading(false);
  };

  // First click - show confirmation
  const handleDownloadClick = () => {
    // console.log("Download button clicked, documentId:", documentId);

    if (!documentId) {
      message.error("Không tìm thấy ID tài liệu!");
      return;
    }

    setConfirmModalVisible(true);
  };

  // After confirmation - create download link
  const handleConfirmDownload = async () => {
    // console.log("Confirming download for documentId:", documentId);

    setConfirmModalVisible(false);
    resetModalState(); // Reset all states
    setLoading(true);

    // Show loading message immediately
    message.loading({
      content: "Đang tạo link tải xuống...",
      key: "download-loading",
      duration: 0, // Don't auto-hide
    });

    try {
      // Show modal only after starting the API call
      setModalVisible(true);

      // Call API to create download link
      // console.log("Calling API to create download link...");
      const response = await DocumentService.createDownloadLink(documentId);

      // console.log("Download link response:", response);

      // Debug: Log all available keys
      // console.log("Available response keys:", Object.keys(response));

      // Hide loading message
      message.destroy("download-loading");

      // Extract data from response - API createDownloadLink returns downloadId and url
      const { downloadId, url } = response;

      if (!downloadId || !url) {
        throw new Error("Không nhận được thông tin download từ server");
      }

      // Create full URL - if url is relative, make it absolute
      const fullDownloadUrl = url.startsWith("/")
        ? `${window.location.origin}${url}`
        : url;

      setDownloadLink(fullDownloadUrl);

      message.success("Link tải xuống đã được tạo thành công!");
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating download link:", error);

      // Hide loading message
      message.destroy("download-loading");

      // Stop loading but keep modal open to show error
      setLoading(false);

      // Determine error message
      let errorMsg = "Có lỗi xảy ra khi tạo link tải xuống!";

      if (error?.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        // console.log("API Error details:", { status, responseData });

        switch (status) {
          case 401:
            errorMsg = "Bạn cần đăng nhập để tải tài liệu!";
            break;
          case 403:
            errorMsg =
              responseData?.message ||
              "Bạn không có đủ điểm để tải tài liệu này!";
            break;
          case 404:
            errorMsg = "Không tìm thấy tài liệu!";
            break;
          case 400:
            errorMsg = responseData?.message || "Yêu cầu không hợp lệ!";
            break;
          default:
            errorMsg = responseData?.message || `Lỗi server (${status})`;
        }
      } else if (error?.message) {
        errorMsg = error.message;
      }

      // console.log("Setting error message:", errorMsg);
      setErrorMessage(errorMsg);

      // Also show toast message
      message.error(errorMsg);
    }
  };

  const handleCopyLink = () => {
    if (downloadLink) {
      navigator.clipboard.writeText(downloadLink);
      message.success("Đã sao chép link vào clipboard!");
    }
  };

  const handleOpenInNewTab = () => {
    if (downloadLink) {
      window.open(downloadLink, "_blank");
    }
  };

  return (
    <>
      <div className="flex flex-row items-center space-x-2">
        <button
          onClick={handleDownloadClick}
          className="cursor-pointer text-xs bg-[var(--green-button-color)] hover:bg-green-700 flex flex-row items-center gap-4 text-white font-semibold py-2 px-4 rounded-2xl transition-all duration-200 hover:shadow-lg"
        >
          <CloudDownload size={15} />
          Tải về / {point} UP
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-orange-500" />
            <span>Xác nhận tải xuống</span>
          </div>
        }
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmDownload}
            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
          >
            Đồng ý
          </Button>,
        ]}
        width={400}
      >
        <div className="py-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <AlertCircle size={16} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">
                Tải xuống "{documentTitle}"
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  • Chi phí: <strong>{point} điểm</strong>
                </p>
                <p>• Link sẽ có hiệu lực trong 10 phút</p>
                <p>• Điểm sẽ bị trừ ngay khi tạo link</p>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  ⚠️ Hãy chắc chắn rằng bạn muốn tải tài liệu này. Điểm sẽ không
                  được hoàn lại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Download Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <CloudDownload size={20} className="text-green-600" />
            <span>Tải xuống tài liệu</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          resetModalState();
        }}
        footer={null}
        width={500}
        destroyOnHidden
      >
        <div className="py-4">
          {errorMessage && (
            <div className="text-center py-8">
              <div className="mb-4">
                <AlertCircle size={48} className="mx-auto text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-red-600 mb-4">{errorMessage}</p>
              <Button
                type="primary"
                onClick={() => {
                  setModalVisible(false);
                  resetModalState();
                }}
                className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
              >
                Đóng
              </Button>
            </div>
          )}

          {loading && !downloadLink && !errorMessage && (
            <div className="text-center py-8">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Đang tạo link tải xuống...</p>
              <p className="text-xs text-gray-500 mt-1">
                Vui lòng không đóng cửa sổ này
              </p>
            </div>
          )}

          {downloadLink && !errorMessage && (
            <div className="space-y-4">
              {/* Success message */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-800 font-medium">
                    Link tải xuống đã sẵn sàng!
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Link sẽ hết hạn sau 10 phút.{" "}
                  <strong>
                    Nếu bạn tắt thông báo này, bạn sẽ không thể lấy lại link tải.
                  </strong>
                </p>
              </div>

              {/* Download link display */}
              <div className="p-3 bg-gray-50 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link tải xuống:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={downloadLink}
                    readOnly
                    title="Link tải xuống"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                  />
                  <Button
                    type="default"
                    icon={<Copy size={16} />}
                    onClick={handleCopyLink}
                    title="Sao chép link"
                  />
                  <Button
                    type="default"
                    icon={<ExternalLink size={16} />}
                    onClick={handleOpenInNewTab}
                    title="Mở trong tab mới"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-2">
                <Button
                  type="primary"
                  icon={<CloudDownload size={16} />}
                  onClick={handleOpenInNewTab}
                  className="flex-1 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                >
                  Tải xuống ngay
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    setModalVisible(false);
                    resetModalState();
                  }}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DownloadButton;
