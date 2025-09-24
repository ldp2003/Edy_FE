import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Spin,
  Select,
  Upload,
  Avatar,
  Tag,
} from "antd";
import { ArrowLeft, Upload as UploadIcon, X } from "lucide-react";
import { UserService } from "../../../utils/UserService";
import type { User } from "../../../models/user";
import type { OrganizationDetailed } from "../../../models/organization";
import { OrganizationService } from "../../../utils/OrganizationService";

const { Option } = Select;

interface EditUserForm {
  first_name: string;
  last_name: string;
  contact_email: string;
  organization?: string;
  field_of_study: string[];
  status: string;
  avatar?: string;
}

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationDetailed[]>(
    []
  );
  const [newField, setNewField] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        message.error("ID người dùng không hợp lệ!");
        navigate("/admin/users");
        return;
      }

      try {
        setLoading(true);

        // Fetch user data and organizations in parallel
        const [userData, orgsData] = await Promise.all([
          UserService.getUserById(id),
          OrganizationService.getOrganizations(),
        ]);

        const userInfo = userData.user || userData;
        setUser(userInfo);
        setOrganizations(orgsData || []);
        setFieldOfStudy(userInfo.field_of_study || []);

        // Set form values
        form.setFieldsValue({
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          contact_email: userInfo.contact_email,
          organization:
            typeof userInfo.organization === "object" && userInfo.organization
              ? userInfo.organization._id
              : userInfo.organization,
          status: userInfo.status || "ACTIVE",
          avatar: userInfo.avatar,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải thông tin!");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, form]);

  const handleSave = async (values: EditUserForm) => {
    if (!id) return;

    try {
      setSaving(true);

      // Update user with the form values + field_of_study
      const updateData = {
        ...values,
        field_of_study: fieldOfStudy,
      };

      // Call API to update user (you'll need to implement this in UserService)
      await UserService.updateUser(id, updateData);

      message.success("Cập nhật thông tin người dùng thành công!");
      navigate(`/admin/users/detail/${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = () => {
    if (newField.trim() && !fieldOfStudy.includes(newField.trim())) {
      setFieldOfStudy([...fieldOfStudy, newField.trim()]);
      setNewField("");
    }
  };

  const handleRemoveField = (fieldToRemove: string) => {
    setFieldOfStudy(fieldOfStudy.filter((field) => field !== fieldToRemove));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Không tìm thấy người dùng
          </h2>
          <p className="text-gray-500 mb-4">
            Người dùng bạn đang tìm kiếm không tồn tại.
          </p>
          <Button onClick={() => navigate("/admin/users")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate(`/admin/users/detail/${id}`)}
        >
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa người dùng
          </h1>
          <p className="text-gray-600">
            {user.first_name} {user.last_name} - ID: {user._id}
          </p>
        </div>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Form.Item
                label="Tên"
                name="first_name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>

              <Form.Item
                label="Họ"
                name="last_name"
                rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
              >
                <Input placeholder="Nhập họ" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="contact_email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item label="Tổ chức" name="organization">
                <Select placeholder="Chọn tổ chức" allowClear>
                  {organizations.map((org) => (
                    <Option key={org._id} value={org._id}>
                      {org.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Không hoạt động</Option>
                  <Option value="BANNED">Bị khóa</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar
                </label>
                <div className="flex items-center space-x-4">
                  <Avatar size={64} src={user.avatar}>
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </Avatar>
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => {
                      message.info(
                        "Tính năng upload avatar đang được phát triển"
                      );
                      return false;
                    }}
                  >
                    <Button icon={<UploadIcon size={16} />}>
                      Thay đổi avatar
                    </Button>
                  </Upload>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lĩnh vực quan tâm
                </label>

                {/* Current fields */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {fieldOfStudy.map((field, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => handleRemoveField(field)}
                      closeIcon={<X size={12} />}
                      color="blue"
                    >
                      {field}
                    </Tag>
                  ))}
                </div>

                {/* Add new field */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nhập lĩnh vực mới"
                    value={newField}
                    onChange={(e) => setNewField(e.target.value)}
                    onPressEnter={handleAddField}
                  />
                  <Button onClick={handleAddField}>Thêm</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
            <Button onClick={() => navigate(`/admin/users/detail/${id}`)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserEditPage;
