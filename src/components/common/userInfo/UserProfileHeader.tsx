import React from "react";
import { Avatar, Button, Input, Select } from "antd";

const { Option } = Select;

interface UserProfileHeaderProps {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  organizationOptions: string[];
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  firstName,
  lastName,
  organization,
  email,
  organizationOptions,
}) => {
  return (
    <div
      className="rounded-lg text-left p-4 shadow-lg"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      <div className="flex items-start gap-4">
        <Avatar size={80} className="bg-orange-400 text-white text-lg">
          👤
        </Avatar>

        <div className="flex-1 grid grid-cols-4 gap-3">
          {/* Column 1: Labels for Họ and Tên */}
          <div className="flex flex-col gap-3">
            <label htmlFor="ho" className="text-xs font-medium">
              Họ:
            </label>
            <label htmlFor="ten" className="text-xs font-medium">
              Tên:
            </label>
          </div>

          {/* Column 2: Inputs for Họ and Tên */}
          <div className="flex flex-col gap-3">
            <Input
              id="ho"
              defaultValue={firstName}
              className="mt-1 text-sm"
              size="small"
            />
            <Input
              id="ten"
              defaultValue={lastName}
              className="mt-1 text-sm"
              size="small"
            />
          </div>

          {/* Column 3: Labels for Học tập/làm việc tại and Email */}
          <div className="flex flex-col gap-3">
            <label htmlFor="hoc-tap" className="text-xs font-medium">
              Học tập/làm việc tại:
            </label>
            <label htmlFor="email" className="text-xs font-medium">
              Email:
            </label>
          </div>

          {/* Column 4: Inputs for Học tập/làm việc tại and Email */}
          <div className="flex flex-col gap-3">
            <Select
              defaultValue={organization}
              className="mt-1 text-sm"
              size="small"
            >
              {organizationOptions.map((org) => (
                <Option key={org} value={org}>
                  {org}
                </Option>
              ))}
            </Select>
            <Input
              id="email"
              defaultValue={email}
              disabled
              className="mt-1 text-sm"
              size="small"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button danger size="small">
          Hủy
        </Button>
        <Button type="primary" size="small">
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default UserProfileHeader;
