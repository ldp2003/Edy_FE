/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  message,
  Popconfirm,
  Tooltip,
  Tag,
  Dropdown,
  Checkbox,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Edit, Lock, Unlock, Plus, Eye } from "lucide-react";
import { RoleService } from "../../../utils/RoleService";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import { PERMISSION_LABELS } from "../../../constants/PermissionConstants.ts";
import {
  getPermissionStyle,
  getStatusStyle,
} from "../../../utils/AdminTableStyles";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [filters, setFilters] = useState<any>({});
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      "index",
      "name",
      "code",
      "description",
      "permissions",
      "is_active",
      "actions",
    ])
  );

  const fetchRoles = async (params?: {
    page?: number;
    limit?: number;
    query?: string;
    name?: string;
    code?: string;
    description?: string;
    permissions?: string[];
    is_active?: boolean;
  }) => {
    setLoading(true);
    try {
      const queryParams = {
        page: params?.page || currentPage,
        limit: params?.limit || pageSize,
        query: params?.query !== undefined ? params.query : searchText,
        name: params?.name || filters.name,
        code: params?.code || filters.code,
        description: params?.description || filters.description,
        permissions: params?.permissions || filters.permissions,
        is_active:
          params?.is_active !== undefined
            ? params.is_active
            : filters.is_active,
      };

      const response = await RoleService.getAllRoles(true, queryParams);
      console.log("response:", response);
      setRoles(response?.data || response || []);
      setTotalRoles(response?.pagination?.total || response?.length || 0);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Không thể tải danh sách quyền!");
      setRoles([]);
      setTotalRoles(0);
    } finally {
      setLoading(false);
    }
  };

  // Initialize from URL params
  useEffect(() => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const name = searchParams.get("name");
    const code = searchParams.get("code");
    const description = searchParams.get("description");
    const permissions = searchParams.get("permissions");
    const is_active = searchParams.get("is_active");

    if (page) setCurrentPage(parseInt(page));
    if (limit) setPageSize(parseInt(limit));
    if (search) {
      setSearchText(search);
      setSearchInput(search);
    }
    if (name || code || description || permissions || is_active) {
      const newFilters: any = {};
      if (name) newFilters.name = name;
      if (code) newFilters.code = code;
      if (description) newFilters.description = description;
      if (permissions) newFilters.permissions = permissions.split(",");
      if (is_active) newFilters.is_active = is_active === "true";
      setFilters(newFilters);
    }

    if (
      page ||
      limit ||
      search ||
      name ||
      code ||
      description ||
      permissions ||
      is_active
    ) {
      fetchRoles({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        query: search || "",
        name: name || undefined,
        code: code || undefined,
        description: description || undefined,
        permissions: permissions ? permissions.split(",") : undefined,
        is_active: is_active ? is_active === "true" : undefined,
      });
    } else {
      fetchRoles();
    }
  }, [searchParams]);

  const updateURL = (params: {
    page?: number;
    limit?: number;
    query?: string;
    name?: string;
    code?: string;
    description?: string;
    permissions?: string[];
    is_active?: boolean;
  }) => {
    const newParams = new URLSearchParams();
    if (params.page && params.page !== 1)
      newParams.set("page", params.page.toString());
    if (params.limit && params.limit !== 10)
      newParams.set("limit", params.limit.toString());
    if (params.query) newParams.set("search", params.query);
    if (params.name) newParams.set("name", params.name);
    if (params.code) newParams.set("code", params.code);
    if (params.description) newParams.set("description", params.description);
    if (params.permissions && params.permissions.length > 0)
      newParams.set("permissions", params.permissions.join(","));
    if (params.is_active !== undefined)
      newParams.set("is_active", params.is_active.toString());
    setSearchParams(newParams);
  };

  const toggleColumnVisibility = (columnKey: string, checked: boolean) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(columnKey);
      } else {
        newSet.delete(columnKey);
      }
      return newSet;
    });
  };

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
            const label =
              PERMISSION_LABELS[permission as keyof typeof PERMISSION_LABELS] ||
              permission;
            return (
              <Tag
                key={index}
                className={`text-xs ${isAllPermission ? "font-semibold" : ""}`}
                style={getPermissionStyle(permission)}
              >
                {label}
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
          className="px-2 py-1 rounded text-xs"
          style={getStatusStyle(isActive ? "active" : "inactive")}
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

  // Get total count for pagination
  const getTotalCount = () => {
    return totalRoles;
  };

  const handleSearch = () => {
    setSearchText(searchInput);
    setCurrentPage(1);
    const params = {
      page: 1,
      limit: pageSize,
      query: searchInput,
      name: filters.name,
      code: filters.code,
      description: filters.description,
      permissions: filters.permissions,
      is_active: filters.is_active,
    };
    updateURL(params);
    fetchRoles(params);
  };

  // Filter columns based on visibility
  const filteredColumns = columns.filter((column) =>
    visibleColumns.has(column.key as string)
  );

  const columnVisibilityMenu = {
    items: [
      {
        key: "columns",
        label: (
          <div className="p-2 min-w-48">
            <div className="space-y-2">
              <div>
                <Checkbox
                  checked={visibleColumns.has("index")}
                  onChange={(e) =>
                    toggleColumnVisibility("index", e.target.checked)
                  }
                >
                  STT
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("name")}
                  onChange={(e) =>
                    toggleColumnVisibility("name", e.target.checked)
                  }
                >
                  Tên
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("code")}
                  onChange={(e) =>
                    toggleColumnVisibility("code", e.target.checked)
                  }
                >
                  Mã
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("description")}
                  onChange={(e) =>
                    toggleColumnVisibility("description", e.target.checked)
                  }
                >
                  Mô tả
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("permissions")}
                  onChange={(e) =>
                    toggleColumnVisibility("permissions", e.target.checked)
                  }
                >
                  Quyền hạn
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("is_active")}
                  onChange={(e) =>
                    toggleColumnVisibility("is_active", e.target.checked)
                  }
                >
                  Trạng thái
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("actions")}
                  onChange={(e) =>
                    toggleColumnVisibility("actions", e.target.checked)
                  }
                >
                  Thao tác
                </Checkbox>
              </div>
            </div>
          </div>
        ),
      },
    ],
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
              </div>

              <div className="flex items-center space-x-2">
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "clear",
                        label: "Xóa bộ lọc",
                        onClick: () => {
                          setFilters({});
                          setCurrentPage(1);
                          const params = {
                            page: 1,
                            limit: pageSize,
                            query: searchText,
                          };
                          updateURL(params);
                          fetchRoles(params);
                        },
                      },
                      {
                        key: "status",
                        label: "Trạng thái",
                        children: [
                          {
                            key: "status_all",
                            label: "Tất cả",
                            onClick: () => {
                              const newFilters = { ...filters };
                              delete newFilters.is_active;
                              setFilters(newFilters);
                              setCurrentPage(1);
                              const params = {
                                page: 1,
                                limit: pageSize,
                                query: searchText,
                              };
                              updateURL(params);
                              fetchRoles(params);
                            },
                          },
                          {
                            key: "status_active",
                            label: "Hoạt động",
                            onClick: () => {
                              setFilters({ ...filters, is_active: true });
                              setCurrentPage(1);
                              const params = {
                                page: 1,
                                limit: pageSize,
                                query: searchText,
                                is_active: true,
                              };
                              updateURL(params);
                              fetchRoles(params);
                            },
                          },
                          {
                            key: "status_inactive",
                            label: "Vô hiệu",
                            onClick: () => {
                              setFilters({ ...filters, is_active: false });
                              setCurrentPage(1);
                              const params = {
                                page: 1,
                                limit: pageSize,
                                query: searchText,
                                is_active: false,
                              };
                              updateURL(params);
                              fetchRoles(params);
                            },
                          },
                        ],
                      },
                      {
                        key: "description",
                        label: "Có mô tả",
                        onClick: () => {
                          setFilters({
                            ...filters,
                            description: "{exists:true}",
                          });
                          setCurrentPage(1);
                          const params = {
                            page: 1,
                            limit: pageSize,
                            query: searchText,
                            description: "{exists:true}",
                          };
                          updateURL(params);
                          fetchRoles(params);
                        },
                      },
                      {
                        key: "permissions",
                        label: "Quyền hạn",
                        children: [
                          {
                            key: "perm_manage_role",
                            label: "Quản lý quyền",
                            onClick: () => {
                              setFilters({
                                ...filters,
                                permissions: ["MANAGE_ROLE"],
                              });
                              setCurrentPage(1);
                              const params = {
                                page: 1,
                                limit: pageSize,
                                query: searchText,
                                permissions: ["MANAGE_ROLE"],
                              };
                              updateURL(params);
                              fetchRoles(params);
                            },
                          },
                          {
                            key: "perm_manage_user",
                            label: "Quản lý người dùng",
                            onClick: () => {
                              setFilters({
                                ...filters,
                                permissions: ["MANAGE_USER"],
                              });
                              setCurrentPage(1);
                              const params = {
                                page: 1,
                                limit: pageSize,
                                query: searchText,
                                permissions: ["MANAGE_USER"],
                              };
                              updateURL(params);
                              fetchRoles(params);
                            },
                          },
                          {
                            key: "perm_manage_doc",
                            label: "Quản lý tài liệu",
                            onClick: () => {
                              setFilters({
                                ...filters,
                                permissions: ["MANAGE_DOCUMENT"],
                              });
                              setCurrentPage(1);
                              const params = {
                                page: 1,
                                limit: pageSize,
                                query: searchText,
                                permissions: ["MANAGE_DOCUMENT"],
                              };
                              updateURL(params);
                              fetchRoles(params);
                            },
                          },
                          {
                            key: "perm_all",
                            label: "Tất cả quyền",
                            onClick: () => {
                              setFilters({ ...filters, permissions: ["ALL"] });
                              setCurrentPage(1);
                              const params = {
                                page: 1,
                                limit: pageSize,
                                query: searchText,
                                permissions: ["ALL"],
                              };
                              updateURL(params);
                              fetchRoles(params);
                            },
                          },
                        ],
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <button className="flex items-center text-xs gap-1 border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer">
                    <Filter size={14} />
                    Bộ lọc
                  </button>
                </Dropdown>
                <Dropdown menu={columnVisibilityMenu} trigger={["click"]}>
                  <Button icon={<Eye size={14} />} size="small">
                    Ẩn hiện cột
                  </Button>
                </Dropdown>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, mã..."
                  className="pl-10"
                  size="small"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onPressEnter={handleSearch}
                />
              </div>
              <Button type="primary" size="small" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-hidden">
            <div className="rounded-md border border-gray-200 bg-white shadow-sm">
              <Table
                columns={filteredColumns}
                dataSource={getDisplayData()}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: getTotalCount(),
                  onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize || 10);
                    const params = {
                      page,
                      limit: pageSize || 10,
                      query: searchText,
                      name: filters.name,
                      code: filters.code,
                      description: filters.description,
                      permissions: filters.permissions,
                      is_active: filters.is_active,
                    };
                    updateURL(params);
                    fetchRoles(params);
                  },
                  onShowSizeChange: (current, size) => {
                    setCurrentPage(current);
                    setPageSize(size);
                    const params = {
                      page: current,
                      limit: size,
                      query: searchText,
                      name: filters.name,
                      code: filters.code,
                      description: filters.description,
                      permissions: filters.permissions,
                      is_active: filters.is_active,
                    };
                    updateURL(params);
                    fetchRoles(params);
                  },
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
