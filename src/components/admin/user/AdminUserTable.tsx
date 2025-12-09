/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Select,
  Button,
  Input,
  message,
  Popconfirm,
  Tooltip,
  Tag,
  Dropdown,
  Checkbox,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import {
  Search,
  Filter,
  Lock,
  Unlock,
  Edit,
  List,
  Grid3X3,
  Eye,
} from "lucide-react";
import type { User } from "../../../models/user";
import { UserService } from "../../../utils/UserService";
import { getStatusStyle } from "../../../utils/AdminTableStyles";
import UserFilterModal from "./UserFilterModal";
import UserItem from "./UserItem";
import { UserContext } from "../../../contexts/UserContext";
import UserSuspendModal from "./UserSuspendModal";

const { Option } = Select;

interface UserDisplay extends User {
  index: number;
  role_names?: string[];
}

const AdminUserTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "list">("table");
  const [suspendModalVisible, setSuspendModalVisible] = useState(false);
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      "index",
      "fullName",
      "organization",
      "role_names",
      "field_of_study",
      "follower",
      "following",
      "doc_count",
      "point",
      "rank_point",
      "strike",
      "createdAt",
      "status",
      "changeStatus",
      "actions",
    ])
  );

  useEffect(() => {
    const updateViewMode = () => {
      const isMobile = window.innerWidth < 1024;
      setViewMode(isMobile ? "list" : "table");
    };
    updateViewMode();
    window.addEventListener("resize", updateViewMode);
    return () => window.removeEventListener("resize", updateViewMode);
  }, []);

  // Initialize from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const organization = searchParams.get("organization");
    const field_of_study = searchParams.getAll("field_of_study");
    const rank_point_min = searchParams.get("rank_point_min");
    const rank_point_max = searchParams.get("rank_point_max");
    const strike_min = searchParams.get("strike_min");
    const strike_max = searchParams.get("strike_max");

    setCurrentPage(page);
    setPageSize(limit);
    setSearchText(search);
    setFilters({
      status: status || undefined,
      organization: organization || undefined,
      field_of_study: field_of_study.length > 0 ? field_of_study : undefined,
      point_range:
        rank_point_min || rank_point_max
          ? ([
              rank_point_min ? parseInt(rank_point_min) : undefined,
              rank_point_max ? parseInt(rank_point_max) : undefined,
            ].filter((x) => x !== undefined) as [number, number])
          : undefined,
      strike_range:
        strike_min || strike_max
          ? ([
              strike_min ? parseInt(strike_min) : undefined,
              strike_max ? parseInt(strike_max) : undefined,
            ].filter((x) => x !== undefined) as [number, number])
          : undefined,
    });

    fetchUsers({
      page,
      limit,
      search: search || undefined,
      status: status ? [status] : undefined,
      organization: organization ? [organization] : undefined,
      field_of_study: field_of_study.length > 0 ? field_of_study : undefined,
      rank_point_min: rank_point_min ? parseInt(rank_point_min) : undefined,
      rank_point_max: rank_point_max ? parseInt(rank_point_max) : undefined,
      strike_min: strike_min ? parseInt(strike_min) : undefined,
      strike_max: strike_max ? parseInt(strike_max) : undefined,
    });
  }, [searchParams]);

  // Fetch users from API
  const fetchUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string[];
    organization?: string[];
    field_of_study?: string[];
    rank_point_min?: number;
    rank_point_max?: number;
    strike_min?: number;
    strike_max?: number;
  }) => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers(params);
      //Bỏ qua user hiện tại
      const filteredUsers = (response.data || []).filter(
        (user: User) => user._id !== currentUser?._id
      );
      setUsers(filteredUsers);
      setTotalUsers(
        users.length > 0 ? filteredUsers.length : response.total || 0
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Không thể tải danh sách người dùng!");
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update URL with search params
  const updateURL = (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string[];
    organization?: string[];
    field_of_study?: string[];
    rank_point_min?: number;
    rank_point_max?: number;
    strike_min?: number;
    strike_max?: number;
  }) => {
    const newParams = new URLSearchParams();
    if (params.page && params.page !== 1)
      newParams.set("page", params.page.toString());
    if (params.limit && params.limit !== 10)
      newParams.set("limit", params.limit.toString());
    if (params.search) newParams.set("search", params.search);
    if (params.status && params.status.length > 0)
      newParams.set("status", params.status[0]);
    if (params.organization && params.organization.length > 0)
      newParams.set("organization", params.organization[0]);
    if (params.field_of_study && params.field_of_study.length > 0) {
      params.field_of_study.forEach((field) =>
        newParams.append("field_of_study", field)
      );
    }
    if (params.rank_point_min !== undefined)
      newParams.set("rank_point_min", params.rank_point_min.toString());
    if (params.rank_point_max !== undefined)
      newParams.set("rank_point_max", params.rank_point_max.toString());
    if (params.strike_min !== undefined)
      newParams.set("strike_min", params.strike_min.toString());
    if (params.strike_max !== undefined)
      newParams.set("strike_max", params.strike_max.toString());
    setSearchParams(newParams);
  };

  // Save column visibility to localStorage
  const saveColumnVisibility = (columns: Set<string>) => {
    localStorage.setItem(
      "adminUserTableVisibleColumns",
      JSON.stringify([...columns])
    );
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnKey: string, checked: boolean) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (checked) {
      newVisibleColumns.add(columnKey);
    } else {
      // Don't allow hiding essential columns
      if (
        columnKey === "fullName" ||
        columnKey === "status" ||
        columnKey === "actions"
      ) {
        message.warning(
          "Không thể ẩn cột Tên người dùng, Trạng thái và Thao tác!"
        );
        return;
      }
      newVisibleColumns.delete(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
    saveColumnVisibility(newVisibleColumns);
  };

  // Column visibility menu items
  const columnVisibilityMenu = {
    items: [
      {
        key: "column-group-1",
        label: (
          <div className="grid grid-cols-2 gap-4 p-2 min-w-[300px]">
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
                  checked={visibleColumns.has("fullName")}
                  onChange={(e) =>
                    toggleColumnVisibility("fullName", e.target.checked)
                  }
                >
                  Người dùng
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("organization")}
                  onChange={(e) =>
                    toggleColumnVisibility("organization", e.target.checked)
                  }
                >
                  Tổ chức
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("role_names")}
                  onChange={(e) =>
                    toggleColumnVisibility("role_names", e.target.checked)
                  }
                >
                  Vai trò
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("field_of_study")}
                  onChange={(e) =>
                    toggleColumnVisibility("field_of_study", e.target.checked)
                  }
                >
                  Lĩnh vực
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("follower")}
                  onChange={(e) =>
                    toggleColumnVisibility("follower", e.target.checked)
                  }
                >
                  Người theo dõi
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("following")}
                  onChange={(e) =>
                    toggleColumnVisibility("following", e.target.checked)
                  }
                >
                  Đang theo dõi
                </Checkbox>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <Checkbox
                  checked={visibleColumns.has("doc_count")}
                  onChange={(e) =>
                    toggleColumnVisibility("doc_count", e.target.checked)
                  }
                >
                  Tài liệu
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("point")}
                  onChange={(e) =>
                    toggleColumnVisibility("point", e.target.checked)
                  }
                >
                  Điểm
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("rank_point")}
                  onChange={(e) =>
                    toggleColumnVisibility("rank_point", e.target.checked)
                  }
                >
                  Xếp hạng
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("strike")}
                  onChange={(e) =>
                    toggleColumnVisibility("strike", e.target.checked)
                  }
                >
                  Cảnh cáo
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("createdAt")}
                  onChange={(e) =>
                    toggleColumnVisibility("createdAt", e.target.checked)
                  }
                >
                  Ngày tạo
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={visibleColumns.has("status")}
                  onChange={(e) =>
                    toggleColumnVisibility("status", e.target.checked)
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

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/detail/${userId}`);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus?: string
  ) => {
    if (currentStatus === "ACTIVE") {
      // For suspending, open modal
      const user = users.find((u) => u._id === userId);
      if (user) {
        setSelectedUserForSuspend({
          id: userId,
          name: `${user.first_name} ${user.last_name}`,
        });
        setSuspendModalVisible(true);
      }
    } else {
      // For unsuspending, directly call API
      await handleUnsuspendUser(userId);
    }
  };

  const handleUnsuspendUser = async (userId: string) => {
    try {
      await UserService.unsuspendUser(userId);

      message.success("Đã mở khóa tài khoản!");

      // Refresh data
      setUsers(
        users.map((user) =>
          user._id === userId
            ? { ...user, status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "BANNED" }
            : user
        )
      );
    } catch (error: any) {
      console.error("Error unsuspending user:", error);

      // If unsuspend fails with 400 or "Tài khoản không bị khóa", try updateUserStatus instead
      if (
        error.response?.status === 400 ||
        error.response?.data?.message?.includes("Tài khoản không bị khóa") ||
        error.message?.includes("Tài khoản không bị khóa")
      ) {
        try {
          await UserService.updateUserStatus(userId, "ACTIVE");
          message.success("Đã mở khóa tài khoản!");

          // Refresh data
          setUsers(
            users.map((user) =>
              user._id === userId
                ? {
                    ...user,
                    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "BANNED",
                  }
                : user
            )
          );
        } catch (updateError) {
          console.error("Error updating user status:", updateError);
          message.error("Có lỗi xảy ra khi mở khóa tài khoản!");
        }
      } else {
        message.error("Có lỗi xảy ra khi mở khóa tài khoản!");
      }
    }
  };

  const handleChangeUserStatus = async (userId: string, newStatus: string) => {
    try {
      await UserService.updateUserStatus(userId, newStatus);

      const statusMessages = {
        ACTIVE: "Đã kích hoạt tài khoản!",
        BANNED: "Đã khóa tài khoản!",
        INACTIVE: "Đã vô hiệu hóa tài khoản!",
      };

      message.success(
        statusMessages[newStatus as keyof typeof statusMessages] ||
          "Đã cập nhật trạng thái!"
      );

      // Refresh data
      setUsers(
        users.map((user) =>
          user._id === userId
            ? { ...user, status: newStatus as "ACTIVE" | "INACTIVE" | "BANNED" }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const handleSuspendUser = (userId: string, userName: string) => {
    setSelectedUserForSuspend({ id: userId, name: userName });
    setSuspendModalVisible(true);
  };

  const handleSuspendSuccess = () => {
    // Refresh data after suspend
    fetchUsers();
  };

  const columns: ColumnsType<UserDisplay> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 40,
      fixed: "left",
    },
    {
      title: "Người dùng",
      key: "fullName",
      width: 200,
      fixed: "left",
      sorter: (a: UserDisplay, b: UserDisplay) =>
        `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        ),
      render: (_, record: UserDisplay) => (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {record.avatar ? (
              <img
                src={record.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs ">
                {record.first_name.charAt(0)}
                {record.last_name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-xs truncate">
              {record.first_name} {record.last_name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {record.contact_email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tổ chức",
      key: "organization",
      width: 100,
      ellipsis: true,
      render: (_, record: UserDisplay) => {
        if (typeof record.organization === "object" && record.organization) {
          return (
            <Tooltip title={record.organization.name}>
              <span className="text-xs">{record.organization.name}</span>
            </Tooltip>
          );
        }
        return <span className="text-xs text-gray-400">Chưa có</span>;
      },
    },
    {
      title: "Vai trò",
      key: "role_names",
      width: 100,
      render: (_, record: UserDisplay) => {
        if (record.is_admin) {
          return (
            <Tag
              className="text-xs"
              style={{
                backgroundColor: "var(--permission-all-bg)",
                color: "var(--permission-all-text)",
                borderColor: "var(--permission-all-border)",
              }}
            >
              Admin
            </Tag>
          );
        } else {
          return (
            <Tag
              className="text-xs"
              style={{
                backgroundColor: "var(--color-info-bg)",
                color: "var(--color-info-text)",
                borderColor: "var(--color-info-border)",
              }}
            >
              Người dùng
            </Tag>
          );
        }
      },
    },
    {
      title: "Lĩnh vực",
      dataIndex: "field_of_study",
      key: "field_of_study",
      width: 100,
      ellipsis: true,
      render: (fields: string[]) => {
        const fieldText =
          fields && fields.length > 0
            ? fields.slice(0, 1).join("") + (fields.length > 1 ? "..." : "")
            : "N/A";
        return (
          <Tooltip
            title={
              fields && fields.length > 0
                ? fields.join(", ")
                : "Chưa có lĩnh vực"
            }
          >
            <span className="text-xs">{fieldText}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Người theo dõi",
      dataIndex: "follower",
      key: "follower",
      align: "center",
      width: 70,
      sorter: (a: UserDisplay, b: UserDisplay) =>
        (a.follower?.length || 0) - (b.follower?.length || 0),
      render: (follower: string[]) => (
        <span className="text-xs text-black">
          {follower ? follower.length : 0}
        </span>
      ),
    },
    {
      title: "Đang theo dõi",
      dataIndex: "following",
      key: "following",
      align: "center",
      width: 70,
      sorter: (a: UserDisplay, b: UserDisplay) =>
        (a.following?.length || 0) - (b.following?.length || 0),
      render: (following: string[]) => (
        <span className="text-xs text-black">
          {following ? following.length : 0}
        </span>
      ),
    },
    {
      title: "Tài liệu",
      dataIndex: "doc_count",
      key: "doc_count",
      align: "center",
      width: 70,
      sorter: (a: UserDisplay, b: UserDisplay) =>
        (a.doc_count || 0) - (b.doc_count || 0),
      render: (count: number) => (
        <span className="text-xs text-black">{count || 0}</span>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
      align: "center",
      width: 60,
      sorter: (a: UserDisplay, b: UserDisplay) =>
        (a.point || 0) - (b.point || 0),
      render: (point: number) => (
        <span className="text-xs text-black">{point || 0}</span>
      ),
    },
    {
      title: "Xếp hạng",
      dataIndex: "rank_point",
      key: "rank_point",
      align: "center",
      width: 60,
      sorter: (a: UserDisplay, b: UserDisplay) =>
        (a.rank_point || 0) - (b.rank_point || 0),
      render: (rankPoint: number) => (
        <span className="text-xs text-black">{rankPoint || 0}</span>
      ),
    },
    {
      title: "Cảnh cáo",
      dataIndex: "strike",
      key: "strike",
      align: "center",
      width: 60,
      sorter: (a: UserDisplay, b: UserDisplay) =>
        (a.strike || 0) - (b.strike || 0),
      render: (strike: number) => (
        <span
          className={`text-xs ${strike > 0 ? "text-red-600" : "text-black"}`}
        >
          {strike || 0}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
      sorter: (a: UserDisplay, b: UserDisplay) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
      render: (date: string) => {
        if (!date) return <span className="text-xs text-gray-400">N/A</span>;
        const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
        return <span className="text-xs">{formattedDate}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 90,
      render: (status?: string) => {
        const statusLabels: { [key: string]: string } = {
          ACTIVE: "Hoạt động",
          BANNED: "Bị khóa",
          INACTIVE: "Không hoạt động",
        };
        const text = statusLabels[status || ""] || "N/A";
        return (
          <span
            className="px-1 py-0.5 rounded text-xs"
            style={getStatusStyle(status?.toLowerCase() || "inactive")}
          >
            {text}
          </span>
        );
      },
    },
    // {
    //   title: "Thay đổi trạng thái",
    //   key: "changeStatus",
    //   align: "center",
    //   width: 120,
    //   render: (_, record: UserDisplay) => (
    //     <Select
    //       value={record.status}
    //       onChange={(value) => handleChangeUserStatus(record._id, value)}
    //       size="small"
    //       style={{ width: 100 }}
    //       disabled={record._id === currentUser?._id} // Không cho phép thay đổi trạng thái của chính mình
    //     >
    //       <Select.Option value="ACTIVE">Hoạt động</Select.Option>
    //       <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
    //       <Select.Option value="BANNED">Bị khóa</Select.Option>
    //     </Select>
    //   ),
    // },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 90,
      fixed: "right",
      render: (_, record: UserDisplay) => (
        <div className="flex justify-center space-x-0.5">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<Edit size={12} />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(record._id);
              }}
            />
          </Tooltip>

          {record.is_admin ? (
            <Tooltip title="Không thể khóa tài khoản quản trị viên">
              <Button
                type="text"
                icon={<Lock size={12} />}
                size="small"
                disabled
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          ) : (
            <Popconfirm
              title={
                record.status === "ACTIVE"
                  ? "Khóa tài khoản người dùng?"
                  : "Mở khóa tài khoản người dùng?"
              }
              onConfirm={(e) => {
                e?.stopPropagation();
                handleToggleUserStatus(record._id, record.status);
              }}
              onCancel={(e) => e?.stopPropagation()}
              okText="Có"
              cancelText="Không"
            >
              <Tooltip
                title={
                  record.status === "ACTIVE"
                    ? "Khóa tài khoản"
                    : "Mở khóa tài khoản"
                }
              >
                <Button
                  type="text"
                  icon={
                    record.status === "ACTIVE" ? (
                      <Lock size={12} />
                    ) : (
                      <Unlock size={12} />
                    )
                  }
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  danger={record.status === "ACTIVE"}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  // Filter columns based on visibility
  const filteredColumns = columns.filter((column) =>
    visibleColumns.has(column.key as string)
  );

  // Transform API data to display format
  const getDisplayData = (): UserDisplay[] => {
    return users.map((user, index) => ({
      ...user,
      index: (currentPage - 1) * pageSize + index + 1,
    }));
  };

  // Calculate pagination
  const currentData = getDisplayData();
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalUsers);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
    const params = {
      page: 1,
      limit: value,
      search: searchText || undefined,
      status: filters.status ? [filters.status] : undefined,
      organization: filters.organization ? [filters.organization] : undefined,
      field_of_study: filters.field_of_study,
      rank_point_min: filters.point_range?.[0],
      rank_point_max: filters.point_range?.[1],
      strike_min: filters.strike_range?.[0],
      strike_max: filters.strike_range?.[1],
    };
    updateURL(params);
    fetchUsers(params);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const params = {
        page: newPage,
        limit: pageSize,
        search: searchText || undefined,
        status: filters.status ? [filters.status] : undefined,
        organization: filters.organization ? [filters.organization] : undefined,
        field_of_study: filters.field_of_study,
        rank_point_min: filters.point_range?.[0],
        rank_point_max: filters.point_range?.[1],
        strike_min: filters.strike_range?.[0],
        strike_max: filters.strike_range?.[1],
      };
      updateURL(params);
      fetchUsers(params);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      const params = {
        page: newPage,
        limit: pageSize,
        search: searchText || undefined,
        status: filters.status ? [filters.status] : undefined,
        organization: filters.organization ? [filters.organization] : undefined,
        field_of_study: filters.field_of_study,
        rank_point_min: filters.point_range?.[0],
        rank_point_max: filters.point_range?.[1],
        strike_min: filters.strike_range?.[0],
        strike_max: filters.strike_range?.[1],
      };
      updateURL(params);
      fetchUsers(params);
    }
  };

  const handleSearch = () => {
    const params = {
      page: 1,
      limit: pageSize,
      search: searchText || undefined,
      status: filters.status ? [filters.status] : undefined,
      organization: filters.organization ? [filters.organization] : undefined,
      field_of_study: filters.field_of_study,
      rank_point_min: filters.point_range?.[0],
      rank_point_max: filters.point_range?.[1],
      strike_min: filters.strike_range?.[0],
      strike_max: filters.strike_range?.[1],
    };
    updateURL(params);
    fetchUsers(params);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters: {
    status?: string;
    organization?: string;
    organizationName?: string;
    field_of_study?: string[];
    point_range?: [number, number];
    strike_range?: [number, number];
  }) => {
    setFilters(newFilters);
    const params = {
      page: 1,
      limit: pageSize,
      search: searchText || undefined,
      status: newFilters.status ? [newFilters.status] : undefined,
      organization: newFilters.organization
        ? [newFilters.organization]
        : undefined,
      field_of_study: newFilters.field_of_study,
      rank_point_min: newFilters.point_range?.[0],
      rank_point_max: newFilters.point_range?.[1],
      strike_min: newFilters.strike_range?.[0],
      strike_max: newFilters.strike_range?.[1],
    };
    updateURL(params);
    fetchUsers(params);
    setCurrentPage(1);
  };

  const handleToggleFilterPanel = () => {
    setIsFilterPanelVisible(!isFilterPanelVisible);
  };

  const handleCloseFilterPanel = () => {
    setIsFilterPanelVisible(false);
  };

  return (
    <div className="w-full overflow-hidden relative">
      <div className="space-y-4 md:space-y-6">
        {/* Filter and Search Section */}
        <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-white shadow-sm">
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle - Hidden on mobile, auto-switches */}
            <div className="hidden md:flex items-center border border-gray-300 rounded-md">
              <button
                title="Xem dạng bảng"
                className={`flex items-center px-2 py-1 text-xs cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[var(--color-info-bg)] text-[var(--color-info-text)] border-[var(--color-info-border)]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("table")}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                title="Xem dạng danh sách"
                className={`flex items-center px-2 py-1 text-xs  cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[var(--color-info-bg)] text-[var(--color-info-text)] border-[var(--color-info-border)]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List size={14} />
              </button>
            </div>

            <button
              className="flex items-center text-xs gap-1 rounded-md px-2 py-1 cursor-pointer border border-[var(--border-color)] hover:bg-[var(--color-gray-bg)]"
              onClick={handleToggleFilterPanel}
            >
              <Filter size={14} />
              Bộ lọc
            </button>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                className="pl-10"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Button type="primary" size="small" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Filter and Search Summary */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          {searchText && (
            <span className="px-2 py-1 rounded bg-[var(--color-info-bg)] text-[var(--color-info-text)] border border-[var(--color-info-border)]">
              Tìm kiếm: "{searchText}"
            </span>
          )}
          {filters?.status && (
            <span className="px-2 py-1 rounded bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-success-border)]">
              Trạng thái:{" "}
              {filters.status === "ACTIVE"
                ? "Hoạt động"
                : filters.status === "INACTIVE"
                ? "Không hoạt động"
                : "Bị khóa"}
            </span>
          )}
          {filters?.organization && (
            <span className="px-2 py-1 rounded bg-[var(--color-purple-bg)] text-[var(--color-purple-text)] border border-[var(--color-purple-border)]">
              Tổ chức: {filters.organizationName || filters.organization}
            </span>
          )}
          {filters?.point_range &&
            (filters.point_range[0] || filters.point_range[1]) && (
              <span className="px-2 py-1 rounded bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border border-[var(--color-warning-border)]">
                Điểm: {filters.point_range[0] || 0} -{" "}
                {filters.point_range[1] || "∞"}
              </span>
            )}
          {filters?.strike_range &&
            (filters.strike_range[0] || filters.strike_range[1]) && (
              <span className="px-2 py-1 rounded bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-[var(--color-error-border)]">
                Cảnh cáo: {filters.strike_range[0] || 0} -{" "}
                {filters.strike_range[1] || "∞"}
              </span>
            )}
          {(searchText ||
            filters?.status ||
            filters?.organization ||
            filters?.point_range ||
            filters?.strike_range) && (
            <button
              className="underline text-xs text-[var(--color-info-text)] hover:opacity-80"
              onClick={() => {
                setSearchText("");
                setFilters({});
                const params = { page: 1, limit: pageSize };
                updateURL(params);
                fetchUsers(params);
                setCurrentPage(1);
              }}
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Data Display */}
        {viewMode === "table" ? (
          <div className="w-full overflow-hidden">
            <div className="rounded-md border border-gray-200 bg-white shadow-sm">
              <style>
                {`
                .compact-table .ant-table-tbody > tr > td {
                  font-size: 13px !important;
                  padding: 10px 12px !important;
                  white-space: nowrap;
                }
                .compact-table .ant-table-thead > tr > th {
                  font-size: 13px !important;
                  padding: 12px 12px !important;
                  white-space: nowrap;
                  font-weight: 600;
                }
                .compact-table .ant-table-container {
                  overflow-x: auto !important;
                }
                .compact-table .ant-table {
                  font-size: 13px;
                }
                .compact-table .ant-table-fixed-left {
                  z-index: 2;
                }
                .compact-table .ant-table-fixed-right {
                  z-index: 2;
                }
                
                /* Make rows clickable with hover effect */
                .compact-table .ant-table-tbody > tr:hover > td {
                  background-color: var(--color-gray-bg) !important;
                }
                
                /* Responsive adjustments */
                @media (max-width: 1400px) {
                  .compact-table .ant-table-tbody > tr > td {
                    font-size: 12px !important;
                    padding: 8px 10px !important;
                  }
                  .compact-table .ant-table-thead > tr > th {
                    font-size: 12px !important;
                    padding: 10px 10px !important;
                  }
                }
                
                @media (max-width: 1600px) {
                  .compact-table .ant-table-tbody > tr > td {
                    font-size: 12.5px !important;
                    padding: 9px 11px !important;
                  }
                  .compact-table .ant-table-thead > tr > th {
                    font-size: 12.5px !important;
                    padding: 11px 11px !important;
                  }
                }
                
                /* Hide less important columns on smaller screens */
                @media (max-width: 1200px) {
                  .compact-table th:nth-child(n+6):nth-child(-n+10),
                  .compact-table td:nth-child(n+6):nth-child(-n+10) {
                    display: none !important;
                  }
                }
              `}
              </style>
              <Table
                title={() => (
                  <div className="flex justify-end">
                    <Dropdown menu={columnVisibilityMenu} trigger={["click"]}>
                      <Button icon={<Eye size={14} />} size="small">
                        Ẩn hiện cột
                      </Button>
                    </Dropdown>
                  </div>
                )}
                columns={filteredColumns}
                dataSource={currentData}
                pagination={false}
                size="middle"
                loading={loading}
                rowKey="_id"
                scroll={{ x: "max-content", y: 700 }}
                className="compact-table"
                onRow={(record) => ({
                  onClick: () => handleViewUser(record._id),
                  style: { cursor: "pointer" },
                })}
              />

              {/* Footer with pagination */}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Số hàng:</span>
                  <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    size="small"
                    style={{ width: 70 }}
                  >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {startIndex + 1}-{endIndex} trên {totalUsers}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      className="px-3 py-1.5 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)] hover:bg-[var(--color-gray-bg)]"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)] hover:bg-[var(--color-gray-bg)]"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* List View */}
            <div className="space-y-2">
              {currentData.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  onViewUser={handleViewUser}
                  onEditUser={handleEditUser}
                  onToggleUserStatus={handleUnsuspendUser}
                  onSuspendUser={handleSuspendUser}
                  onChangeUserStatus={handleChangeUserStatus}
                  currentUserId={currentUser?._id}
                />
              ))}
            </div>

            {/* Footer with pagination for list view */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Số hàng:</span>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  size="small"
                  style={{ width: 70 }}
                >
                  <Option value={5}>5</Option>
                  <Option value={10}>10</Option>
                  <Option value={20}>20</Option>
                  <Option value={50}>50</Option>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="text-sm text-gray-700">
                  {startIndex + 1}-{endIndex} trên {totalUsers}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="px-3 py-1.5 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)] hover:bg-[var(--color-gray-bg)]"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)] hover:bg-[var(--color-gray-bg)]"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Filter Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isFilterPanelVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Bộ lọc nâng cao</h3>
            <button
              onClick={handleCloseFilterPanel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            <UserFilterModal
              visible={true}
              onClose={() => {}}
              onApply={(filters) => {
                handleApplyFilters(filters);
                handleCloseFilterPanel();
              }}
              initialFilters={filters}
              isInDrawer={true}
            />
          </div>
        </div>
      </div>

      {/* Overlay for filter panel */}
      {isFilterPanelVisible && (
        <div
          className="fixed inset-0 bg-black/60 bg-opacity-50 z-40"
          onClick={handleCloseFilterPanel}
        />
      )}

      {/* Suspend Modal */}
      <UserSuspendModal
        visible={suspendModalVisible}
        onClose={() => {
          setSuspendModalVisible(false);
          setSelectedUserForSuspend(null);
        }}
        onSuccess={handleSuspendSuccess}
        userId={selectedUserForSuspend?.id || ""}
        userName={selectedUserForSuspend?.name || ""}
      />
    </div>
  );
};

export default AdminUserTable;
