import { useState, useContext } from "react";
import { Button, Input } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { changePassword } from "../../../utils/UserService";
import { UserContext } from "../../../contexts/UserContext";
import OTPModal from "../OTPModal";

interface ResetPasswordProps {
  messageApi: MessageInstance;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ messageApi }) => {
  const { user } = useContext(UserContext);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if required fields are filled
  const isRequiredFieldsFilled =
    oldPassword.trim() !== "" && newPassword.trim() !== "";

  // Check if passwords match
  const passwordsMatch = newPassword === confirmPassword;

  const handleOTPVerified = async () => {
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
      setOtpModalVisible(false);

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
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          size="small"
          disabled={!isRequiredFieldsFilled || !passwordsMatch}
          onClick={() => setOtpModalVisible(true)}
          loading={loading}
          style={{
            backgroundColor:
              isRequiredFieldsFilled && passwordsMatch
                ? "var(--primary-color)"
                : undefined,
            borderColor:
              isRequiredFieldsFilled && passwordsMatch
                ? "var(--primary-color)"
                : undefined,
            color:
              isRequiredFieldsFilled && passwordsMatch ? "white" : undefined,
          }}
        >
          <span className="text-xs">Lấy OTP</span>
        </Button>
      </div>

      <OTPModal
        visible={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        onSuccess={handleOTPVerified}
        email={user?.contact_email || ""}
        type="RESET_PASSWORD"
      />
    </div>
  );
};

export default ResetPassword;
