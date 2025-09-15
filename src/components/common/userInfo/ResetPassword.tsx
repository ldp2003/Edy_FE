import { useState } from "react";
import { Button, Input } from "antd";

const ResetPassword: React.FC = () => {
  const [showOTP, setShowOTP] = useState(false);

  return (
    <div
      className="rounded-lg text-left border border-gray-200 p-6 shadow"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
          <div className="">
        <div>
          <label htmlFor="old-password" className="text-sm font-medium">
            Mật khẩu cũ:
          </label>
          <Input id="old-password" type="password" />
        </div>

        <div>
          <label htmlFor="new-password" className="text-sm font-medium">
            Mật khẩu mới:
          </label>
          <Input id="new-password" type="password" />
        </div>

        <div>
          <label htmlFor="confirm-password" className="text-sm font-medium">
            Nhập lại mật khẩu:
          </label>
          <Input id="confirm-password" type="password" />
        </div>

        {showOTP && (
          <div>
            <label htmlFor="otp" className="text-sm font-medium">
              Xác thực OTP:
            </label>
            <Input id="otp" placeholder="Nhập mã OTP" />
          </div>
        )}

        <div className="text-center text-sm text-red-500 mb-4">
          OTP đã được gửi về Email, hết hạn sau 60s
        </div>

        <div className="flex justify-center gap-3">
          <Button type="default" size="small">
            Gửi lại OTP
          </Button>
          <Button size="small" onClick={() => setShowOTP(true)}>
            Lấy OTP
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button danger size="small">
          Hủy
        </Button>
        <Button type="primary" size="small">
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
