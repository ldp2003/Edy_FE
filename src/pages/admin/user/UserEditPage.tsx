import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message, Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import { UserService } from "../../../utils/UserService";
import type { User } from "../../../models/user";
import UserInfoView from "../../../components/admin/user/UserInfoView";
import UserRoleManager from "../../../components/admin/user/UserRoleManager";
import UserViolationHistory from "../../../components/admin/user/UserViolationHistory";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        message.error("ID người dùng không hợp lệ!");
        navigate("/admin/users");
        return;
      }

      try {
        setLoading(true);
        const userData = await UserService.getUserById(id);
        const userInfo = userData.user || userData;
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải thông tin!");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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
    <div className="p-4 text-left">
      <AdminBreadcrumb
        items={[
          { label: "Admin", path: "/admin" },
          { label: "Quản lý người dùng", path: "/admin/users" },
          {
            label:
              `Chỉnh sửa ${user?.first_name || ""} ${
                user?.last_name || ""
              }`.trim() || "Chỉnh sửa người dùng",
          },
        ]}
      />

      <div className="mt-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(`/admin/users/detail/${id}`)}
          >
            Quay lại
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Thông tin chi tiết người dùng
            </h1>
            <p className="text-gray-600">
              {user?.first_name} {user?.last_name} - ID: {user?._id}
            </p>
          </div>
        </div>

        {/* User Info Section */}
        <UserInfoView user={user!} />

        {/* Role & Violations Section */}
        <div className="mt-8 flex flex-row bg-white rounded-lg border border-[var(--border-color)]">
          {/* Left Column - Role Management */}
          <div className="w-1/2 p-6 border-r border-[var(--border-color)]">
            <UserRoleManager userId={id!} currentRole={user?.role || "USER"} />
          </div>

          {/* Right Column - Violation History */}
          <div className="w-1/2 p-6">
            <div className="font-bold text-sm mb-4">Lịch sử vi phạm</div>
            <UserViolationHistory userId={id!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
