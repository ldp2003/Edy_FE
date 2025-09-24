import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { UserService } from "../../../utils/UserService";
import type { User } from "../../../models/user";
import UserDetailHeader from "../../../components/admin/user/UserDetailHeader";
import UserProfileCard from "../../../components/admin/user/UserProfileCard";
import UserStatsCard from "../../../components/admin/user/UserStatsCard";
import UserDetailInfo from "../../../components/admin/user/UserDetailInfo";

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
      <UserDetailHeader
        user={user}
        onBack={() => navigate("/admin/users")}
        onEdit={() => navigate(`/admin/users/edit/${id}`)}
        onToggleStatus={handleToggleStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile and Stats */}
        <div className="lg:col-span-1 shadow-sm border border-gray-200 rounded-lg bg-white">
          <UserProfileCard
            user={user}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />

          <UserStatsCard user={user} />
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 shadow-sm border border-gray-200 rounded-lg bg-white">
          <UserDetailInfo
            user={user}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
