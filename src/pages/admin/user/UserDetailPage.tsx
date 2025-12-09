/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { UserService } from "../../../utils/UserService";
import type { User } from "../../../models/user";
import UserDetailHeader from "../../../components/admin/user/UserDetailHeader";
import UserProfileCard from "../../../components/admin/user/UserProfileCard";
import UserStatsCard from "../../../components/admin/user/UserStatsCard";
import UserDetailInfo from "../../../components/admin/user/UserDetailInfo";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";
import UserSuspendModal from "../../../components/admin/user/UserSuspendModal";

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspendModalVisible, setSuspendModalVisible] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!id) {
      message.error("ID người dùng không hợp lệ!");
      navigate("/admin/users");
      return;
    }

    try {
      setLoading(true);
      const userData = await UserService.getUserById(id);
      setUser({
        ...(userData.user || userData),
        is_admin: userData.account?.is_admin,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      message.error("Không thể tải thông tin người dùng!");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleToggleStatus = async () => {
    if (!user || !id) return;

    if (user.status === "ACTIVE") {
      // For suspending, open modal
      setSuspendModalVisible(true);
    } else {
      // For unsuspending, directly call API
      await handleUnsuspendUser();
    }
  };

  const handleUnsuspendUser = async () => {
    if (!user || !id) return;

    try {
      await UserService.unsuspendUser(id);

      setUser({
        ...user,
        status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "BANNED",
      });
      message.success("Đã mở khóa tài khoản!");
    } catch (error: any) {
      console.error("Error unsuspending user:", error);

      // If unsuspend fails with 400 or "Tài khoản không bị khóa", try updateUserStatus instead
      if (
        error.response?.status === 400 ||
        error.response?.data?.message?.includes("Tài khoản không bị khóa") ||
        error.message?.includes("Tài khoản không bị khóa")
      ) {
        try {
          await UserService.updateUserStatus(id, "ACTIVE");
          setUser({
            ...user,
            status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "BANNED",
          });
          message.success("Đã mở khóa tài khoản!");
        } catch (updateError) {
          console.error("Error updating user status:", updateError);
          message.error("Có lỗi xảy ra khi mở khóa tài khoản!");
        }
      } else {
        message.error("Có lỗi xảy ra khi mở khóa tài khoản!");
      }
    }
  };

  const handleSuspendSuccess = () => {
    // Refresh user data after suspend
    fetchUser();
  };

  const handleChangeStatus = async (newStatus: string) => {
    if (!user || !id) return;

    try {
      await UserService.updateUserStatus(id, newStatus);

      setUser({
        ...user,
        status: newStatus as "ACTIVE" | "INACTIVE" | "BANNED",
      });

      const statusMessages = {
        ACTIVE: "Đã kích hoạt tài khoản!",
        BANNED: "Đã khóa tài khoản!",
        INACTIVE: "Đã vô hiệu hóa tài khoản!",
      };

      message.success(
        statusMessages[newStatus as keyof typeof statusMessages] ||
          "Đã cập nhật trạng thái!"
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
    <div className="">
      <AdminBreadcrumb
        items={[
          { label: "Admin", path: "/admin" },
          { label: "Quản lý người dùng", path: "/admin/users" },
          {
            label:
              `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              "Chi tiết người dùng",
          },
        ]}
      />

      <div className="mt-4">
        {/* Header */}
        <UserDetailHeader
          user={user}
          onBack={() => navigate("/admin/users")}
          onEdit={() => navigate(`/admin/users/edit/${id}`)}
          onToggleStatus={handleToggleStatus}
          onChangeStatus={handleChangeStatus}
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

      {/* Suspend Modal */}
      <UserSuspendModal
        visible={suspendModalVisible}
        onClose={() => setSuspendModalVisible(false)}
        onSuccess={handleSuspendSuccess}
        userId={id || ""}
        userName={
          user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : ""
        }
      />
    </div>
  );
};

export default UserDetailPage;
