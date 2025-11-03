/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
  Download,
  Printer,
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
import { getRoleDisplayName } from "../../../constants/RoleConstants";
import UserFilterModal from "./UserFilterModal";
import UserItem from "./UserItem";

const { Option } = Select;

interface UserDisplay extends User {
  index: number;
  role_names?: string[];
}

const AdminUserTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "list">("table");

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
      setUsers(response.data || []);
      setTotalUsers(response.pagination?.totalUsers || 0);
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
        key: "index",
        label: (
          <Checkbox
            checked={visibleColumns.has("index")}
            onChange={(e) => toggleColumnVisibility("index", e.target.checked)}
          >
            STT
          </Checkbox>
        ),
      },
      {
        key: "fullName",
        label: (
          <Checkbox
            checked={visibleColumns.has("fullName")}
            onChange={(e) =>
              toggleColumnVisibility("fullName", e.target.checked)
            }
            disabled
          >
            Người dùng
          </Checkbox>
        ),
      },
      {
        key: "organization",
        label: (
          <Checkbox
            checked={visibleColumns.has("organization")}
            onChange={(e) =>
              toggleColumnVisibility("organization", e.target.checked)
            }
          >
            Tổ chức
          </Checkbox>
        ),
      },
      {
        key: "role_names",
        label: (
          <Checkbox
            checked={visibleColumns.has("role_names")}
            onChange={(e) =>
              toggleColumnVisibility("role_names", e.target.checked)
            }
          >
            Vai trò
          </Checkbox>
        ),
      },
      {
        key: "field_of_study",
        label: (
          <Checkbox
            checked={visibleColumns.has("field_of_study")}
            onChange={(e) =>
              toggleColumnVisibility("field_of_study", e.target.checked)
            }
          >
            Lĩnh vực
          </Checkbox>
        ),
      },
      {
        key: "follower",
        label: (
          <Checkbox
            checked={visibleColumns.has("follower")}
            onChange={(e) =>
              toggleColumnVisibility("follower", e.target.checked)
            }
          >
            Người theo dõi
          </Checkbox>
        ),
      },
      {
        key: "following",
        label: (
          <Checkbox
            checked={visibleColumns.has("following")}
            onChange={(e) =>
              toggleColumnVisibility("following", e.target.checked)
            }
          >
            Đang theo dõi
          </Checkbox>
        ),
      },
      {
        key: "doc_count",
        label: (
          <Checkbox
            checked={visibleColumns.has("doc_count")}
            onChange={(e) =>
              toggleColumnVisibility("doc_count", e.target.checked)
            }
          >
            Tài liệu
          </Checkbox>
        ),
      },
      {
        key: "point",
        label: (
          <Checkbox
            checked={visibleColumns.has("point")}
            onChange={(e) => toggleColumnVisibility("point", e.target.checked)}
          >
            Điểm
          </Checkbox>
        ),
      },
      {
        key: "rank_point",
        label: (
          <Checkbox
            checked={visibleColumns.has("rank_point")}
            onChange={(e) =>
              toggleColumnVisibility("rank_point", e.target.checked)
            }
          >
            Xếp hạng
          </Checkbox>
        ),
      },
      {
        key: "strike",
        label: (
          <Checkbox
            checked={visibleColumns.has("strike")}
            onChange={(e) => toggleColumnVisibility("strike", e.target.checked)}
          >
            Cảnh cáo
          </Checkbox>
        ),
      },
      {
        key: "createdAt",
        label: (
          <Checkbox
            checked={visibleColumns.has("createdAt")}
            onChange={(e) =>
              toggleColumnVisibility("createdAt", e.target.checked)
            }
          >
            Ngày tạo
          </Checkbox>
        ),
      },
      {
        key: "status",
        label: (
          <Checkbox
            checked={visibleColumns.has("status")}
            onChange={(e) => toggleColumnVisibility("status", e.target.checked)}
            disabled
          >
            Trạng thái
          </Checkbox>
        ),
      },
      {
        key: "actions",
        label: (
          <Checkbox
            checked={visibleColumns.has("actions")}
            onChange={(e) =>
              toggleColumnVisibility("actions", e.target.checked)
            }
            disabled
          >
            Thao tác
          </Checkbox>
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
    try {
      const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
      await UserService.updateUserStatus(userId, newStatus);

      message.success(
        newStatus === "BANNED" ? "Đã khóa tài khoản!" : "Đã mở khóa tài khoản!"
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
      message.error("Có lỗi xảy ra khi cập nhật trạng thái tài khoản!");
    }
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
      width: 150,
      render: (_, record: UserDisplay) => {
        const roles = record.role_names || [];
        if (roles.length === 0) {
          return <Tag>Người dùng</Tag>;
        }

        // Chia roles thành các nhóm của 2
        const roleGroups = [];
        for (let i = 0; i < roles.length; i += 2) {
          roleGroups.push(roles.slice(i, i + 2));
        }

        return (
          <div className="flex flex-col gap-1">
            {roleGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="flex gap-1">
                {group.map((role, index) => (
                  <Tag
                    key={`${groupIndex}-${index}`}
                    color="blue"
                    className="text-xs"
                  >
                    {getRoleDisplayName(role)}
                  </Tag>
                ))}
              </div>
            ))}
          </div>
        );
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
        const getStatusDisplay = (status?: string) => {
          switch (status) {
            case "ACTIVE":
              return {
                text: "Hoạt động",
                color: "text-green-600",
                bg: "bg-green-50",
              };
            case "BANNED":
              return {
                text: "Bị khóa",
                color: "text-red-600",
                bg: "bg-red-50",
              };
            case "INACTIVE":
              return {
                text: "Không hoạt động",
                color: "text-gray-600",
                bg: "bg-gray-50",
              };
            default:
              return {
                text: "N/A",
                color: "text-gray-600",
                bg: "bg-gray-50",
              };
          }
        };

        const { text, color, bg } = getStatusDisplay(status);
        return (
          <span className={`px-1 py-0.5 rounded text-xs ${color} ${bg}`}>
            {text}
          </span>
        );
      },
    },
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

          <Popconfirm
            title={
              record.status === "ACTIVE"
                ? "Khóa tài khoản?"
                : "Mở khóa tài khoản?"
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
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="hidden md:flex items-center space-x-2">
              <Button icon={<Download size={14} />} size="small">
                Download
              </Button>
              <Button icon={<Printer size={14} />} size="small">
                Print
              </Button>
              <Dropdown menu={columnVisibilityMenu} trigger={["click"]}>
                <Button icon={<Eye size={14} />} size="small">
                  Ẩn hiện cột
                </Button>
              </Dropdown>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {/* View Mode Toggle - Hidden on mobile, auto-switches */}
              <div className="hidden md:flex items-center border border-gray-300 rounded-md">
                <button
                  title="Xem dạng bảng"
                  className={`flex items-center px-2 py-1 text-xs ${
                    viewMode === "table"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  <Grid3X3 size={14} />
                </button>
                <button
                  title="Xem dạng danh sách"
                  className={`flex items-center px-2 py-1 text-xs ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={14} />
                </button>
              </div>

              <button
                className="flex items-center text-xs gap-1 border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={handleToggleFilterPanel}
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
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
              Tìm kiếm: "{searchText}"
            </span>
          )}
          {filters?.status && (
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
              Trạng thái:{" "}
              {filters.status === "ACTIVE"
                ? "Hoạt động"
                : filters.status === "INACTIVE"
                ? "Không hoạt động"
                : "Bị khóa"}
            </span>
          )}
          {filters?.organization && (
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
              Tổ chức: {filters.organizationName || filters.organization}
            </span>
          )}
          {filters?.point_range &&
            (filters.point_range[0] || filters.point_range[1]) && (
              <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                Điểm: {filters.point_range[0] || 0} -{" "}
                {filters.point_range[1] || "∞"}
              </span>
            )}
          {filters?.strike_range &&
            (filters.strike_range[0] || filters.strike_range[1]) && (
              <span className="bg-red-50 text-red-700 px-2 py-1 rounded">
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
              className="text-blue-500 hover:text-blue-700 underline text-xs"
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
                  background-color: #f5f5f5 !important;
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
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="space-y-3">
              {currentData.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  onViewUser={handleViewUser}
                  onEditUser={handleEditUser}
                  onToggleUserStatus={handleToggleUserStatus}
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
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default AdminUserTable;
