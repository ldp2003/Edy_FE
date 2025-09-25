import React, { useState } from "react";
import { Table, Button, Tag, message, Modal } from "antd";
import { Edit, Trash2, Plus } from "lucide-react";

interface UserRole {
  id: string;
  name: string;
  status: "active" | "restricted" | "suspended";
  expiryDate?: string;
  restrictedBy?: string;
  permissions: string[];
}

interface UserRoleManagerProps {
  userId: string;
  currentRole?: string;
  onRoleChange?: (newRole: string) => void;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = () => {
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] =
    useState<UserRole | null>(null);

  // Mock data for user roles - replace with actual API call
  const userRoles: UserRole[] = [
    {
      id: "1",
      name: "Người dùng",
      status: "active",
      expiryDate: "2025-12-31",
      restrictedBy: undefined,
      permissions: ["Xem tài liệu", "Tải tài liệu", "Bình luận"],
    },
    {
      id: "2",
      name: "Điều hành viên",
      status: "restricted",
      expiryDate: "2025-06-30",
      restrictedBy: "Admin System",
      permissions: ["Duyệt tài liệu", "Quản lý bình luận", "Xóa nội dung"],
    },
    {
      id: "3",
      name: "Quản trị viên",
      status: "suspended",
      expiryDate: undefined,
      restrictedBy: "Super Admin",
      permissions: ["Toàn quyền hệ thống"],
    },
  ];

  const handleEditRole = (record: UserRole) => {
    setSelectedRoleForEdit(record);
    setEditModalVisible(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    console.log("Deleting role:", roleId);
    try {
      setLoading(true);
      // API call to delete role
      message.success("Xóa quyền thành công!");
    } catch (error) {
      console.error("Delete role error:", error);
      message.error("Xóa quyền thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setSelectedRoleForEdit(null);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: "Tên quyền",
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status: string) => {
        const statusConfig = {
          active: { color: "green", text: "Hoạt động" },
          restricted: { color: "orange", text: "Hạn chế" },
          suspended: { color: "red", text: "Tạm ngưng" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thời hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: "15%",
      render: (date: string) => date || "Vô thời hạn",
    },
    {
      title: "Người hạn chế",
      dataIndex: "restrictedBy",
      key: "restrictedBy",
      width: "20%",
      render: (restrictedBy: string) => restrictedBy || "-",
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_: unknown, record: UserRole) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<Edit size={14} />}
            size="small"
            onClick={() => handleEditRole(record)}
            className="text-blue-500 p-0"
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<Trash2 size={14} />}
            size="small"
            onClick={() => handleDeleteRole(record.id)}
            className="text-red-500 p-0"
            loading={loading}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quản lý quyền</h3>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={handleAddRole}
          className="flex items-center"
        >
          Thêm quyền
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={userRoles}
        rowKey="id"
        pagination={false}
        size="middle"
        className="border border-gray-200 rounded-lg"
      />

      <Modal
        title={selectedRoleForEdit ? "Chỉnh sửa quyền" : "Thêm quyền mới"}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="save" type="primary" loading={loading}>
            Lưu
          </Button>,
        ]}
      >
        <div className="py-4">
          <p className="text-gray-600">
            {selectedRoleForEdit
              ? "Chỉnh sửa thông tin quyền"
              : "Thêm quyền mới cho người dùng"}
          </p>
          {/* Form fields will be added here */}
        </div>
      </Modal>
    </div>
  );
};

export default UserRoleManager;
