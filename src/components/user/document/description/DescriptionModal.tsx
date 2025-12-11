import React, { useState, useContext } from "react";
import { Button, message, Modal } from "antd";
import { Eye } from "lucide-react";
import { PointTransactionService } from "../../../../utils/PointTransaction";
import { UserContext } from "../../../../contexts/UserContext";
import { getCurrentUser } from "../../../../utils/AuthService";

const DescriptionModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user, setUser } = useContext(UserContext);

  // console.log(
  //   "DescriptionModal rendered, user:",
  //   user,
  //   "setUser:",
  //   typeof setUser
  // );

  const refreshUserData = async () => {
    try {
      const data = await getCurrentUser();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const handleViewClick = () => {
    // console.log("handleViewClick called, user:", user);
    // console.log("About to show modal...");

    setShowConfirmModal(true);
  };

  const handleConfirmSpend = async () => {
    // console.log("User confirmed spending points");
    setIsLoading(true);
    try {
      await PointTransactionService.spendPoints({
        amount: 1,
        reason: "Xem tóm tắt tài liệu",
      });
      message.success("Đã trừ 1 điểm để xem tóm tắt!");

      // Refresh user data to update point display
      await refreshUserData();

      setIsVisible(false);
    } catch (error: unknown) {
      console.error("Error spending points:", error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 400) {
        message.error("Bạn không đủ điểm để xem tóm tắt!");
      } else {
        message.error("Có lỗi xảy ra khi trừ điểm!");
      }
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancelConfirm = () => {
    // console.log("User cancelled modal");
    setShowConfirmModal(false);
  };

  return (
    <div className="relative">
      {isVisible && (
        <div className="absolute top-20 bg-white/50 rounded-lg flex items-center justify-center w-full h-full z-10">
          <div className="bg-gradient-to-b from-[#2D6F95] to-[#4BBBFB] p-6 rounded-lg shadow-lg text-center">
            <p className="text-sm font-bold text-white mb-4">
              Dùng 1 điểm để mở xem bản tóm tắt của tài liệu
            </p>
            <Button
              className="hover:bg-[var(--primary-color)] text-sm font-bold text-[var(--primary-text-color)]"
              onClick={handleViewClick}
              size="small"
              loading={isLoading}
              disabled={isLoading}
            >
              {!isLoading && <Eye size={15} />}
              <span className="text-xs">
                {isLoading ? "Đang xử lý..." : "Xem"}
              </span>
            </Button>
          </div>
        </div>
      )}

      <Modal
        title="Xác nhận sử dụng điểm"
        open={showConfirmModal}
        onOk={handleConfirmSpend}
        onCancel={handleCancelConfirm}
        okText="Đồng ý"
        cancelText="Hủy"
        confirmLoading={isLoading}
      >
        <p>Bạn có muốn dùng 1 điểm để xem bản tóm tắt của tài liệu không?</p>
        <p>Điểm hiện tại: {user?.point || 0}</p>
      </Modal>
    </div>
  );
};

export default DescriptionModal;
