import React, { useState, useEffect } from "react";
import { Table, Button, Input, message, Popconfirm, Tooltip, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  Download,
  Printer,
  Search,
  Filter,
  Edit,
  Lock,
  Unlock,
  Plus,
} from "lucide-react";
import { RoleService } from "../../../utils/RoleService";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import { PERMISSIONS } from "../../../constants/PermissionConstants.ts";

interface Role {
  _id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  is_active: boolean;
}

interface RoleDisplay extends Role {
  index: number;
}

const AdminRoleTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await RoleService.getAllRoles(true);
      console.log("response:", response);
      setRoles(response || []);
      setTotalRoles(response?.length || 0);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Không thể tải danh sách quyền!");
      setRoles([]);
      setTotalRoles(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles from API
  useEffect(() => {
    fetchRoles();
  }, [currentPage, pageSize, searchText]);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    fetchRoles();
    setIsEditModalVisible(false);
    setSelectedRole(null);
  };

  const handleToggleRoleStatus = async (roleId: string, isActive: boolean) => {
    try {
      await RoleService.updateRoleStatus(roleId, !isActive);
      messageApi.success(
        isActive ? "Đã vô hiệu hóa quyền!" : "Đã kích hoạt quyền!"
      );
      // Refresh data
      setRoles(
        roles.map((role) =>
          role._id === roleId ? { ...role, is_active: !isActive } : role
        )
      );
    } catch (error) {
      console.error("Error updating role status:", error);
      messageApi.error("Có lỗi xảy ra khi cập nhật trạng thái quyền!");
    }
  };

  const handleCreateSuccess = () => {
    // Refresh data sau khi tạo thành công
    fetchRoles();
    setIsCreateModalVisible(false);
  };

  const columns: ColumnsType<RoleDisplay> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
      fixed: "left",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 150,
      fixed: "left",
      render: (code: string) => (
        <span className="font-semibold text-xs">
          {code == "CUSTOM_ROLE" ? "Quyền tùy chỉnh" : code}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Quyền hạn",
      key: "permissions",
      width: 300,
      render: (_, record: RoleDisplay) => (
        <div className="flex flex-wrap gap-1">
          {record.permissions.map((permission, index) => {
            const isAllPermission = permission === "ALL";
            return (
              <Tag
                key={index}
                className={`text-xs ${
                  isAllPermission
                    ? "bg-blue-100 text-blue-800 border-blue-300 font-semibold"
                    : ""
                }`}
                color={isAllPermission ? "blue" : undefined}
              >
                {PERMISSIONS[permission as keyof typeof PERMISSIONS] ||
                  permission}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      width: 100,
      render: (isActive: boolean) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          }`}
        >
          {isActive ? "Hoạt động" : "Vô hiệu"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record: RoleDisplay) => {
        // Không hiển thị nút chỉnh sửa và vô hiệu hóa cho SUPER_ADMIN
        if (record.code !== "CUSTOM_ROLE") {
          return null;
        }

        return (
          <div className="flex justify-center space-x-1">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<Edit size={14} />}
                size="small"
                onClick={() => handleEditRole(record)}
              />
            </Tooltip>

            <Popconfirm
              title={
                record.is_active
                  ? "Vô hiệu hóa quyền này?"
                  : "Kích hoạt quyền này?"
              }
              onConfirm={() =>
                handleToggleRoleStatus(record._id, record.is_active)
              }
              okText="Có"
              cancelText="Không"
            >
              <Tooltip title={record.is_active ? "Vô hiệu hóa" : "Kích hoạt"}>
                <Button
                  type="text"
                  icon={
                    record.is_active ? <Lock size={14} /> : <Unlock size={14} />
                  }
                  size="small"
                  danger={record.is_active}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // Transform data
  const getDisplayData = (): RoleDisplay[] => {
    return roles.map((role, index) => ({
      ...role,
      index: (currentPage - 1) * pageSize + index + 1,
    }));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      {contextHolder}
      <div className="w-full max-w-full overflow-hidden">
        <div className="space-y-6">
          {/* Filter and Search Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Button
                  type="primary"
                  icon={<Plus size={14} />}
                  size="small"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  Tạo mới
                </Button>
                <Button icon={<Download size={14} />} size="small">
                  Download
                </Button>
                <Button icon={<Printer size={14} />} size="small">
                  Print
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center text-xs gap-1 border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    message.info("Tính năng bộ lọc đang được phát triển")
                  }
                >
                  <Filter size={14} />
                  Bộ lọc
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã, tên..."
                  className="pl-10"
                  size="small"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-hidden">
            <div className="rounded-md border border-gray-200 bg-white shadow-sm">
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={getDisplayData()}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalRoles,
                  onChange: (page) => setCurrentPage(page),
                  onShowSizeChange: (_, size) => setPageSize(size),
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total}`,
                }}
                size="small"
                loading={loading}
                rowKey="_id"
                scroll={{ x: "max-content" }}
                className="compact-table"
              />
            </div>
          </div>
        </div>

        <CreateRoleModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSuccess={handleCreateSuccess}
        />
        <EditRoleModal
          visible={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedRole(null);
          }}
          onSuccess={handleEditSuccess}
          role={selectedRole}
        />
      </div>
    </>
  );
};

export default AdminRoleTable;
