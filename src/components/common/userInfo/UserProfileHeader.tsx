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
      className="rounded-lg text-left p-6 shadow-lg"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      <div className="flex items-start gap-6">
        <Avatar size={120} className="bg-orange-400 text-white text-2xl">
          👤
        </Avatar>

        <div className="flex-1 grid grid-cols-4 gap-4">
          {/* Column 1: Labels for Họ and Tên */}
          <div className="flex flex-col gap-4">
            <label htmlFor="ho" className="text-sm font-medium">
              Họ:
            </label>
            <label htmlFor="ten" className="text-sm font-medium">
              Tên:
            </label>
          </div>

          {/* Column 2: Inputs for Họ and Tên */}
          <div className="flex flex-col gap-4">
            <Input id="ho" defaultValue={firstName} className="mt-1" />
            <Input id="ten" defaultValue={lastName} className="mt-1" />
          </div>

          {/* Column 3: Labels for Học tập/làm việc tại and Email */}
          <div className="flex flex-col gap-4">
            <label htmlFor="hoc-tap" className="text-sm font-medium">
              Học tập/làm việc tại:
            </label>
            <label htmlFor="email" className="text-sm font-medium">
              Email:
            </label>
          </div>

          {/* Column 4: Inputs for Học tập/làm việc tại and Email */}
          <div className="flex flex-col gap-4">
            <Select defaultValue={organization} className="mt-1">
              {organizationOptions.map((org) => (
                <Option key={org} value={org}>
                  {org}
                </Option>
              ))}
            </Select>
            <Input id="email" defaultValue={email} disabled className="mt-1" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button danger size="middle">
          Hủy
        </Button>
        <Button type="primary" size="middle">
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default UserProfileHeader;
