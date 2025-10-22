import { useState } from "react";
import { Button, Input } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { changePassword } from "../../../utils/UserService";

interface ResetPasswordProps {
  messageApi: MessageInstance;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ messageApi }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if required fields are filled
  const isRequiredFieldsFilled =
    oldPassword.trim() !== "" && newPassword.trim() !== "";

  // Check if passwords match
  const passwordsMatch = newPassword === confirmPassword;

  const handleConfirm = async () => {
    if (!passwordsMatch) {
      messageApi.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        current_password: oldPassword,
        new_password: newPassword,
      });
      messageApi.success("Đổi mật khẩu thành công!");

      // Reset form and reload page
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOTP(false);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: unknown) {
      console.error("Failed to change password:", error);

      // Extract error message from backend response
      let errorMessage = "Đổi mật khẩu thất bại!";
      if (error && typeof error === "object" && "response" in error) {
        const response = error.response as { data?: { message?: string } };
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }

      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOTP(false);
  };

  return (
    <div
      className="rounded-lg text-center md:text-left border border-gray-200 p-6 shadow"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      <div className="space-y-2">
        <div>
          <label htmlFor="old-password" className="text-xs font-medium">
            Mật khẩu cũ:
          </label>
          <Input
            id="old-password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="new-password" className="text-xs font-medium">
            Mật khẩu mới:
          </label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="text-xs font-medium">
            Nhập lại mật khẩu:
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {showOTP && (
          <div>
            <label htmlFor="otp" className="text-xs font-medium">
              Xác thực OTP:
            </label>
            <Input id="otp" placeholder="Nhập mã OTP" />
          </div>
        )}

        {showOTP && (
          <div className="text-center text-xs text-red-500 mb-4">
            OTP đã được gửi về Email, hết hạn sau 60s
          </div>
        )}

        <div className="flex justify-end gap-3">
          {showOTP && (
            <Button
              type="default"
              size="small"
              disabled={!isRequiredFieldsFilled}
            >
              <span className="text-xs">Gửi lại OTP</span>
            </Button>
          )}
          {!showOTP && (
            <Button
              size="small"
              disabled={!isRequiredFieldsFilled}
              onClick={() => setShowOTP(true)}
              style={{
                backgroundColor: isRequiredFieldsFilled
                  ? "var(--primary-color)"
                  : undefined,
                borderColor: isRequiredFieldsFilled
                  ? "var(--primary-color)"
                  : undefined,
                color: isRequiredFieldsFilled ? "white" : undefined,
              }}
            >
              <span className="text-xs">Lấy OTP</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button danger size="small" onClick={handleCancel} disabled={loading}>
          <span className="text-xs">Hủy</span>
        </Button>
        <Button
          type="primary"
          size="small"
          disabled={!isRequiredFieldsFilled || !passwordsMatch}
          onClick={handleConfirm}
          loading={loading}
        >
          <span className="text-xs">Xác nhận</span>
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
