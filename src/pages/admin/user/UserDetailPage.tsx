import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Descriptions,
  Spin,
  message,
  Popconfirm,
} from "antd";
import {
  ArrowLeft,
  Edit,
  Lock,
  Unlock,
  Mail,
  Calendar,
  MapPin,
  BookOpen,
  Award,
  Users,
} from "lucide-react";
import { UserService } from "../../../utils/UserService";
import type { User } from "../../../models/user";

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        message.error("ID người dùng không hợp lệ!");
        navigate("/admin/users");
        return;
      }

      try {
        setLoading(true);
        const userData = await UserService.getUserById(id);
        setUser(userData.user || userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        message.error("Không thể tải thông tin người dùng!");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleToggleStatus = async () => {
    if (!user || !id) return;

    try {
      const newStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await UserService.updateUserStatus(id, newStatus);

      setUser({
        ...user,
        status: newStatus as "ACTIVE" | "INACTIVE" | "BANNED",
      });
      message.success(
        newStatus === "BANNED" ? "Đã khóa tài khoản!" : "Đã mở khóa tài khoản!"
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "BANNED":
        return "red";
      case "INACTIVE":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "BANNED":
        return "Bị khóa";
      case "INACTIVE":
        return "Không hoạt động";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không có";
    return new Date(dateString).toLocaleDateString("vi-VN");
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
            Người dùng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => navigate("/admin/users")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate("/admin/users")}
          >
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết người dùng
            </h1>
            <p className="text-gray-600">ID: {user._id}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            icon={<Edit size={16} />}
            onClick={() => navigate(`/admin/users/edit/${id}`)}
          >
            Chỉnh sửa
          </Button>

          <Popconfirm
            title={
              user.status === "ACTIVE"
                ? "Bạn có chắc muốn khóa tài khoản này?"
                : "Bạn có chắc muốn mở khóa tài khoản này?"
            }
            onConfirm={handleToggleStatus}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <Avatar size={120} src={user.avatar} className="mb-4">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </Avatar>

              <h2 className="text-xl font-bold mb-2">
                {user.first_name} {user.last_name}
              </h2>

              <Tag color={getStatusColor(user.status)} className="mb-4">
                {getStatusText(user.status)}
              </Tag>

              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{user.contact_email}</span>
                </div>

                {typeof user.organization === "object" && user.organization && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="text-sm">{user.organization.name}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Tham gia: {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Card */}
          <Card title="Thống kê" className="mt-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="flex items-center space-x-2">
                  <BookOpen size={16} />
                  <span>Số tài liệu:</span>
                </span>
                <span className="font-semibold">{user.doc_count || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center space-x-2">
                  <Award size={16} />
                  <span>Điểm:</span>
                </span>
                <span className="font-semibold">{user.point || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>Người theo dõi:</span>
                </span>
                <span className="font-semibold">
                  {user.follower?.length || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>Đang theo dõi:</span>
                </span>
                <span className="font-semibold">
                  {user.following?.length || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2">
          <Card title="Thông tin chi tiết">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên">
                {user.first_name}
              </Descriptions.Item>
              <Descriptions.Item label="Họ">{user.last_name}</Descriptions.Item>
              <Descriptions.Item label="Email">
                {user.contact_email}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(user.status)}>
                  {getStatusText(user.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổ chức" span={2}>
                {typeof user.organization === "object" && user.organization
                  ? user.organization.name
                  : "Chưa có tổ chức"}
              </Descriptions.Item>
              <Descriptions.Item label="Lĩnh vực nghiên cứu" span={2}>
                {user.field_of_study && user.field_of_study.length > 0
                  ? user.field_of_study.join(", ")
                  : "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm">
                {user.point || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm xếp hạng">
                {user.rank_point || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Cảnh cáo">
                {user.strike || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Lượt tải miễn phí">
                {user.free_download_count || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {formatDate(user.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">
                {formatDate(user.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Thay đổi tổ chức cuối" span={2}>
                {formatDate(user.last_organization_change)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Field of Study */}
          {user.field_of_study && user.field_of_study.length > 0 && (
            <Card title="Lĩnh vực quan tâm" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {user.field_of_study.map((field, index) => (
                  <Tag key={index} color="blue">
                    {field}
                  </Tag>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
