/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import { UserService } from "../../../utils/UserService";

interface UserSuspendModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  userName: string;
}

const UserSuspendModal: React.FC<UserSuspendModalProps> = ({
  visible,
  onClose,
  onSuccess,
  userId,
  userName,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    reason: string;
    duration_days: number;
  }) => {
    setLoading(true);
    try {
      await UserService.suspendUser(userId, values);
      await UserService.updateUserStatus(userId, "BANNED");
      message.success("Đã khóa tài khoản người dùng thành công!");
      onSuccess();
      onClose();
      form.resetFields();
    } catch (error: any) {
      console.error("Error suspending user:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi khóa tài khoản!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Khóa tài khoản: ${userName}`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          duration_days: 7,
        }}
      >
        <Form.Item
          label="Lý do khóa tài khoản"
          name="reason"
          rules={[
            { required: true, message: "Vui lòng nhập lý do khóa tài khoản!" },
            { min: 10, message: "Lý do phải có ít nhất 10 ký tự!" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do khóa tài khoản..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Thời hạn khóa (ngày)"
          name="duration_days"
          rules={[
            { required: true, message: "Vui lòng nhập thời hạn khóa!" },
            { type: "number", min: 1, message: "Thời hạn phải lớn hơn 0!" },
            {
              type: "number",
              max: 365,
              message: "Thời hạn không được vượt quá 365 ngày!",
            },
          ]}
        >
          <InputNumber
            min={1}
            max={365}
            style={{ width: "100%" }}
            placeholder="Nhập số ngày khóa"
          />
        </Form.Item>

        <div className="flex justify-end space-x-2 mt-6">
          <Button onClick={handleCancel} disabled={loading}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} danger>
            Khóa tài khoản
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserSuspendModal;
