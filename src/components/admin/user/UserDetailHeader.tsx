import React from "react";
import { Button, Popconfirm } from "antd";
import { ArrowLeft, Edit, Lock, Unlock } from "lucide-react";
import type { User } from "../../../models/user";

interface UserDetailHeaderProps {
  user: User;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
}

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  user,
  onBack,
  onEdit,
  onToggleStatus,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button icon={<ArrowLeft size={16} />} onClick={onBack}>
          Quay lại
        </Button>
        <div className="flex flex-row gap-3 items-center">
          <h1 className="text-base font-bold text-gray-900">
            Thông tin người dùng{" "}
          </h1>
          <p className="text-gray-600">{"ID: " + user._id}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button icon={<Edit size={16} />} onClick={onEdit}>
          Thao tác
        </Button>

        <Popconfirm
          title={
            user.status === "ACTIVE"
              ? "Bạn có chắc muốn khóa tài khoản này?"
              : "Bạn có chắc muốn mở khóa tài khoản này?"
          }
          onConfirm={onToggleStatus}
          okText="Có"
          cancelText="Không"
        >
          <Button
            icon={
              user.status === "ACTIVE" ? (
                <Lock size={16} />
              ) : (
                <Unlock size={16} />
              )
            }
            danger={user.status === "ACTIVE"}
          >
            {user.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default UserDetailHeader;
