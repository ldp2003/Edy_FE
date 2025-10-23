import React, { useState } from "react";
import { Button, Input, Select, Upload } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import type { MessageInstance } from "antd/es/message/interface";
import { updateProfile } from "../../../utils/UserService";
import { uploadImageToCloudinary } from "../../../utils/CloudinaryService";
import type { OrganizationDetailed } from "../../../models/organization";

const { Option } = Select;

interface UserProfileHeaderProps {
  firstName: string;
  lastName: string;
  organization: string | { _id: string; name: string };
  email: string;
  organizationOptions: OrganizationDetailed[];
  messageApi: MessageInstance;
  avatar?: string;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  firstName,
  lastName,
  organization,
  email,
  organizationOptions,
  messageApi,
  avatar,
}) => {
  const [firstNameValue, setFirstNameValue] = useState(firstName);
  const [lastNameValue, setLastNameValue] = useState(lastName);

  // Handle organization value properly - extract ID if it's an object
  const getOrganizationId = (
    org: string | { _id: string; name: string }
  ): string => {
    if (typeof org === "string") {
      return org;
    }
    return org._id;
  };

  const initialOrgId = getOrganizationId(organization);
  const [organizationValue, setOrganizationValue] = useState(initialOrgId);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("Bạn chỉ có thể upload file hình ảnh!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      const cloudinaryResponse = await uploadImageToCloudinary(file as RcFile);
      setAvatarUrl(cloudinaryResponse.secure_url);
      onSuccess(cloudinaryResponse);
      messageApi.success("Upload ảnh thành công!");
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      onError(error);
      messageApi.error("Upload ảnh thất bại!");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updateData: {
        first_name: string;
        last_name: string;
        organization: string;
        avatar?: string;
      } = {
        first_name: firstNameValue,
        last_name: lastNameValue,
        organization: organizationValue,
      };

      if (avatarUrl) {
        updateData.avatar = avatarUrl;
      }

      await updateProfile(updateData);
      messageApi.success("Cập nhật thông tin thành công!");

      // Reload page after successful update
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);

      // Extract error message from backend response
      let errorMessage = "Cập nhật thông tin thất bại!";
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
    setFirstNameValue(firstName);
    setLastNameValue(lastName);
    setOrganizationValue(initialOrgId);
    setAvatarUrl(null);
  };
  return (
    <div
      className="rounded-lg text-center md:text-left p-4 shadow-lg"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      <style>
        {`
          .avatar-uploader .ant-upload {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
          .avatar-uploader .ant-upload-select {
            width: 80px !important;
            height: 80px !important;
            border-radius: 50% !important;
          }
        `}
      </style>
      <div className="flex flex-col md:flex-row items-start gap-4">
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          accept="image/*"
          customRequest={customUpload}
          beforeUpload={beforeUpload}
        >
          <div className="relative">
            <img
              src={avatarUrl || avatar || "/avatar-default.svg"}
              alt="avatar"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs">Thay đổi</span>
            </div>
          </div>
        </Upload>

        <div className="flex-1 flex flex-col gap-4">
          {/* Họ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label
              htmlFor="first-name"
              className="text-xs font-medium md:col-span-1"
            >
              Họ:
            </label>
            <div className="md:col-span-3">
              <Input
                id="first-name"
                value={firstNameValue}
                onChange={(e) => setFirstNameValue(e.target.value)}
                className="text-sm"
                size="small"
              />
            </div>
          </div>

          {/* Tên */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label
              htmlFor="last-name"
              className="text-xs font-medium md:col-span-1"
            >
              Tên:
            </label>
            <div className="md:col-span-3">
              <Input
                id="last-name"
                value={lastNameValue}
                onChange={(e) => setLastNameValue(e.target.value)}
                className="text-sm"
                size="small"
              />
            </div>
          </div>

          {/* Học tập/làm việc tại */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label
              htmlFor="hoc-tap"
              className="text-xs font-medium md:col-span-1"
            >
              Học tập/làm việc tại:
            </label>
            <div className="md:col-span-3">
              <Select
                value={organizationValue}
                onChange={(value) => setOrganizationValue(value)}
                className="text-sm"
                size="small"
              >
                {organizationOptions.map((org) => (
                  <Option key={org._id} value={org._id}>
                    {org.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label
              htmlFor="email"
              className="text-xs font-medium md:col-span-1"
            >
              Email:
            </label>
            <div className="md:col-span-3">
              <Input
                id="email"
                defaultValue={email}
                disabled
                className="text-sm"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button danger size="small" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={handleSave}
          loading={loading}
        >
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default UserProfileHeader;
