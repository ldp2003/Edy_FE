import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Tag, message } from "antd";
import { Edit, Trash2, Plus } from "lucide-react";
import { RoleService } from "../../../utils/RoleService";
import type { Role } from "../../../models/role";
import EditRoleModal from "../role/EditAssigmentModel";

interface UserRoleManagerProps {
  userId: string;
  currentRole?: string;
  onRoleChange?: (newRole: string) => void;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(
    null
  );

  // Fetch roles data
  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      const response = await RoleService.getUserRoles(userId);
      // API trả về { success, permissions, roles }
      const roles = response.roles || [];
      setUserRoles(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Không thể tải danh sách quyền!");
      setUserRoles([]);
    } finally {
      setRolesLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchRoles();
    }
  }, [userId, fetchRoles]);

  const handleEditRole = (record: Role) => {
    setSelectedRoleForEdit(record);
    setEditModalVisible(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    console.log("Deleting role:", roleId);
    try {
      setLoading(true);
      // API call to delete role - you can implement this later
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
      render: (_: string, record: Role) => (
        <span className="font-medium text-xs whitespace-nowrap">
          {record.name}
        </span>
      ),
    },
    {
      title: "Mã quyền",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <Tag color="blue" className="text-xs whitespace-nowrap">
          {code}
        </Tag>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean) => (
        <Tag
          color={is_active ? "green" : "red"}
          className="text-xs whitespace-nowrap"
        >
          {is_active ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <span className="text-gray-500 text-xs whitespace-nowrap">
          {description || "Không có mô tả"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: Role) => (
        <div className="flex space-x-1">
          <Button
            type="link"
            icon={<Edit size={12} />}
            size="small"
            onClick={() => handleEditRole(record)}
            className="text-blue-500 p-0 text-xs"
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<Trash2 size={12} />}
            size="small"
            onClick={() => handleDeleteRole(record._id)}
            className="text-red-500 p-0 text-xs"
            loading={loading}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const assignment = selectedRoleForEdit
    ? {
        _id: selectedRoleForEdit._id,
        role: { _id: selectedRoleForEdit._id, name: selectedRoleForEdit.name },
      }
    : null;

  return (
    <div className="bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h3 className="text-base sm:text-sm font-bold text-[var(--primary-text-color)]">
          Quản lý quyền
        </h3>
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={handleAddRole}
          className="flex items-center text-xs sm:text-sm"
          size="small"
        >
          Thêm quyền
        </Button>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Table
          columns={columns}
          dataSource={userRoles}
          rowKey="_id"
          pagination={false}
          size="small"
          loading={rolesLoading}
        />
      </div>

      {assignment && (
        <EditRoleModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSuccess={() => {
            setEditModalVisible(false);
            fetchRoles();
          }}
          assignment={assignment}
        />
      )}
    </div>
  );
};

export default UserRoleManager;
