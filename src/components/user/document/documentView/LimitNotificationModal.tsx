import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../../common/entry/LoginForm";
import { DocumentService } from "../../../../utils/DocumentService";

interface LimitNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  icon?: string;
  isLoggedIn?: boolean;
  onDownload?: () => void;
  documentId?: string;
}

const LimitNotificationModal: React.FC<LimitNotificationModalProps> = ({
  visible,
  onClose,
  message,
  title = "Đã xem hết giới hạn xem trước",
  icon = "📖",
  isLoggedIn = false,
  onDownload,
  documentId,
}) => {
  const navigate = useNavigate();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadClick = async () => {
    if (!isLoggedIn) {
      setLoginModalVisible(true);
    } else if (documentId) {
      setDownloadLoading(true);
      setDownloadModalVisible(true);
      try {
        const response = await DocumentService.createDownloadLink(documentId);
        const { url } = response;
        const fullDownloadUrl = url.startsWith("/")
          ? `${window.location.origin}${url}`
          : url;
        setDownloadLink(fullDownloadUrl);
        // message.success("Link tải xuống đã được tạo thành công!");
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        let errorMsg = "Có lỗi xảy ra khi tạo link tải xuống!";
        if (err?.response) {
          const status = err.response.status;
          const responseData = err.response.data;
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
            default:
              errorMsg = responseData?.message || `Lỗi server (${status})`;
          }
        }
        setDownloadError(errorMsg);
        // message.error(errorMsg);
      } finally {
        setDownloadLoading(false);
      }
    } else if (onDownload) {
      onClose();
      onDownload();
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="border rounded-lg shadow-lg p-6 max-w-md mx-4 w-full bg-[var(--primary-background-color)] border-[var(--border-color)]">
          <div className="text-center space-y-4">
            <div className="text-4xl">{icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--primary-text-color)]">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-[var(--secondary-text-color)]">
              {message}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 border rounded hover:bg-gray-50 border-[var(--border-color)] text-[var(--secondary-text-color)]"
              >
                Để sau
              </button>
              <button
                onClick={handleDownloadClick}
                className="px-6 py-2 text-white rounded hover:opacity-90 bg-[var(--primary-color)]"
              >
                Tải về ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {loginModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <LoginForm
              onSuccess={() => setLoginModalVisible(false)}
              onSwitchToRegister={() => {
                setLoginModalVisible(false);
                navigate("/auth/register");
              }}
            />
          </div>
        </div>
      )}

      {/* Download Modal */}
      {downloadModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              {downloadLoading && (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Đang tạo link tải xuống...</p>
                </div>
              )}
              {downloadError && (
                <div className="py-8">
                  <p className="text-red-600 mb-4">{downloadError}</p>
                  <button
                    onClick={() => setDownloadModalVisible(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Đóng
                  </button>
                </div>
              )}
              {downloadLink && (
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Link tải xuống đã sẵn sàng!
                  </h3>
                  <input
                    type="text"
                    value={downloadLink}
                    readOnly
                    className="w-full px-3 py-2 border rounded mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(downloadLink)
                      }
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Sao chép
                    </button>
                    <button
                      onClick={() => window.open(downloadLink, "_blank")}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Tải về
                    </button>
                  </div>
                  <button
                    onClick={() => setDownloadModalVisible(false)}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded w-full"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LimitNotificationModal;
