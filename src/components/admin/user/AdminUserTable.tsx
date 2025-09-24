import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  Button,
  Input,
  message,
  Popconfirm,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import {
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  Lock,
  Unlock,
  Edit,
} from "lucide-react";
import type { User } from "../../../models/user";
import { UserService } from "../../../utils/UserService";

const { Option } = Select;

interface UserDisplay extends User {
  index: number;
}

const AdminUserTable: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState("");

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await UserService.getAllUsers();

        setUsers(response || []);
        setTotalUsers(response.total || 0);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Không thể tải danh sách người dùng!");
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, searchText]);

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
              <span className="text-xs font-medium">
                {record.first_name.charAt(0)}
                {record.last_name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate">
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
      title: "Follower",
      dataIndex: "follower",
      key: "follower",
      align: "center",
      width: 70,
      render: (follower: string[]) => (
        <span className="text-xs text-blue-600 font-medium">
          {follower ? follower.length : 0}
        </span>
      ),
    },
    {
      title: "Following",
      dataIndex: "following",
      key: "following",
      align: "center",
      width: 70,
      render: (following: string[]) => (
        <span className="text-xs text-purple-600 font-medium">
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
      render: (count: number) => (
        <span className="text-xs text-green-600 font-medium">{count || 0}</span>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
      align: "center",
      width: 60,
      render: (point: number) => (
        <span className="text-xs text-orange-600 font-medium">
          {point || 0}
        </span>
      ),
    },
    {
      title: "Rank",
      dataIndex: "rank_point",
      key: "rank_point",
      align: "center",
      width: 60,
      render: (rankPoint: number) => (
        <span className="text-xs text-indigo-600 font-medium">
          {rankPoint || 0}
        </span>
      ),
    },
    {
      title: "Strike",
      dataIndex: "strike",
      key: "strike",
      align: "center",
      width: 60,
      render: (strike: number) => (
        <span
          className={`text-xs font-medium ${
            strike > 0 ? "text-red-600" : "text-gray-400"
          }`}
        >
          {strike || 0}
        </span>
      ),
    },
    {
      title: "Free DL",
      dataIndex: "free_download_count",
      key: "free_download_count",
      align: "center",
      width: 70,
      render: (count: number) => (
        <span className="text-xs text-teal-600 font-medium">{count || 0}</span>
      ),
    },
    {
      title: "Yêu thích",
      dataIndex: "favorites",
      key: "favorites",
      align: "center",
      width: 70,
      render: (favorites: { document: string; added_at: string }[]) => (
        <span className="text-xs text-pink-600 font-medium">
          {favorites ? favorites.length : 0}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
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
          <span
            className={`px-1 py-0.5 rounded text-xs font-medium ${color} ${bg}`}
          >
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
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<Eye size={12} />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewUser(record._id);
              }}
            />
          </Tooltip>

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
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4">
        {/* Header Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Select defaultValue="2025" size="small" style={{ width: 80 }}>
              <Option value="2025">2025</Option>
              <Option value="2024">2024</Option>
            </Select>
            <Button icon={<Download size={14} />} size="small">
              Download
            </Button>
            <Button icon={<Printer size={14} />} size="small">
              Print
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              icon={<Filter size={14} />}
              size="small"
              type="text"
              onClick={() =>
                message.info("Tính năng bộ lọc đang được phát triển")
              }
            >
              Bộ lọc
            </Button>
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
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-hidden">
          <div className="rounded-md border border-gray-200 bg-white shadow-sm">
            <style>
              {`
              .compact-table .ant-table-tbody > tr > td {
                font-size: 11px !important;
                padding: 4px 8px !important;
                white-space: nowrap;
              }
              .compact-table .ant-table-thead > tr > th {
                font-size: 11px !important;
                padding: 8px 8px !important;
                white-space: nowrap;
              }
              .compact-table .ant-table-container {
                overflow-x: auto !important;
              }
              .compact-table .ant-table {
                font-size: 11px;
              }
              .compact-table .ant-table-fixed-left {
                z-index: 2;
              }
              .compact-table .ant-table-fixed-right {
                z-index: 2;
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
              rowSelection={rowSelection}
              columns={columns}
              dataSource={currentData}
              pagination={false}
              size="small"
              loading={loading}
              rowKey="_id"
              scroll={{ x: 800 }}
              className="compact-table"
            />

            {/* Footer with pagination */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Số dòng:</span>
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
                  {startIndex + 1}-{endIndex} of {totalUsers}
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
      </div>
    </div>
  );
};

export default AdminUserTable;
