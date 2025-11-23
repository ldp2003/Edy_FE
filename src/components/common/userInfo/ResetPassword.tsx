import { useState, useContext } from "react";
import { Button, Input } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { changePassword } from "../../../utils/UserService";
import { UserContext } from "../../../contexts/UserContext";
import OTPModal from "../OTPModal";
import {
  validatePassword,
  validatePasswordConfirm,
} from "../../../utils/ValidationUtils";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    // Reset form when canceling edit
    if (isEditMode) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNewPasswordError("");
      setConfirmPasswordError("");
    }
  };

  return (
    <div
      className="rounded-lg text-center md:text-left border border-gray-200 p-6 shadow"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-[var(--primary-text-color)]">
          Đổi mật khẩu
        </h3>
        <Button
          type="primary"
          size="small"
          onClick={handleEditToggle}
          disabled={loading}
          className="bg-[var(--primary-color)] border-[var(--primary-color)] hover:bg-[var(--secondary-color)] hover:border-[var(--secondary-color)]"
        >
          {isEditMode ? "Vô hiệu hóa chỉnh sửa" : "Cho phép chỉnh sửa"}
        </Button>
      </div>

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
            disabled={!isEditMode}
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
            onChange={(e) => {
              const value = e.target.value;
              setNewPassword(value);
              const validation = validatePassword(value);
              setNewPasswordError(validation.isValid ? "" : validation.message);
              // Re-validate confirm password
              const confirmValidation = validatePasswordConfirm(
                value,
                confirmPassword
              );
              setConfirmPasswordError(
                confirmValidation.isValid ? "" : confirmValidation.message
              );
            }}
            disabled={!isEditMode}
          />
          {newPasswordError && (
            <div className="text-red-500 text-xs">{newPasswordError}</div>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className="text-xs font-medium">
            Nhập lại mật khẩu:
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              setConfirmPassword(value);
              const validation = validatePasswordConfirm(newPassword, value);
              setConfirmPasswordError(
                validation.isValid ? "" : validation.message
              );
            }}
            disabled={!isEditMode}
          />
          {confirmPasswordError && (
            <div className="text-red-500 text-xs">{confirmPasswordError}</div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          size="small"
          disabled={
            !isRequiredFieldsFilled ||
            !passwordsMatch ||
            newPasswordError !== "" ||
            confirmPasswordError !== "" ||
            !isEditMode
          }
          onClick={() => setOtpModalVisible(true)}
          loading={loading}
          style={{
            backgroundColor:
              isRequiredFieldsFilled &&
              passwordsMatch &&
              newPasswordError === "" &&
              confirmPasswordError === "" &&
              isEditMode
                ? "var(--primary-color)"
                : undefined,
            borderColor:
              isRequiredFieldsFilled &&
              passwordsMatch &&
              newPasswordError === "" &&
              confirmPasswordError === "" &&
              isEditMode
                ? "var(--primary-color)"
                : undefined,
            color:
              isRequiredFieldsFilled &&
              passwordsMatch &&
              newPasswordError === "" &&
              confirmPasswordError === "" &&
              isEditMode
                ? "white"
                : undefined,
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
