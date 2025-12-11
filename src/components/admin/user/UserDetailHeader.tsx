import React from "react";
import { Button, Tooltip } from "antd";
import { Edit, Lock, Unlock } from "lucide-react";
import type { User } from "../../../models/user";

interface UserDetailHeaderProps {
  user: User;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onChangeStatus: (newStatus: string) => void;
}

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  user,

  onEdit,
  onToggleStatus,
  // onChangeStatus,
}) => {
  // console.log("Rendering UserDetailHeader with user:", user);
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex flex-col md:flex-row md:gap-3 md:items-center">
          <h1 className="text-sm md:text-base font-bold text-gray-900">
            Thông tin người dùng{" "}
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            {"ID: " + user._id}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* <Select
          value={user.status}
          onChange={onChangeStatus}
          style={{ width: 120 }}
        >
          <Select.Option value="ACTIVE">Hoạt động</Select.Option>
          <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
          <Select.Option value="BANNED">Bị khóa</Select.Option>
        </Select> */}

        <Button icon={<Edit size={16} />} onClick={onEdit}>
          Thao tác
        </Button>

        {user.is_admin ? (
          <Tooltip title="Không thể khóa tài khoản quản trị viên">
            <Button icon={<Lock size={16} />} disabled>
              Khóa tài khoản
            </Button>
          </Tooltip>
        ) : (
          <Button
            icon={
              user.status === "ACTIVE" ? (
                <Lock size={16} />
              ) : (
                <Unlock size={16} />
              )
            }
            onClick={onToggleStatus}
            danger={user.status === "ACTIVE"}
          >
            {user.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserDetailHeader;
