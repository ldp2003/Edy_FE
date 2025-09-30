import {
  Forward,
  Copy,
  Check,
  Plus,
  Users,
  Clock,
  Lock,
  Ban,
  Eye,
  Settings,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  message,
  Tabs,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Tooltip,
  Checkbox,
  DatePicker,
} from "antd";
import { DocumentAPI } from "../../../api/API";
import dayjs from "dayjs";

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface ShareLinkData {
  _id: string;
  name: string;
  limited_access: number;
  access_count: number;
  request: boolean;
  time_limited: boolean;
  start_date: string;
  end_date: string;
  status: "ACTIVE" | "INACTIVE" | "DISABLED";
  createdAt: string;
  access_url: string;
  user_accessed: Array<{
    _id: string;
    first_name: string;
    last_name: string;
    contact_email: string;
    avatar?: string;
  }>;
}

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  isPublic?: boolean;
  isSharedWithOrganization?: boolean;
  isPrivate?: boolean;
  isPrivateShared?: boolean;
  isOwner?: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  documentId,
  documentTitle,
  isPublic = false,
  isSharedWithOrganization = false,
  isPrivate = false,
  isPrivateShared = false,
  isOwner = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Form states for creating new link
  const [linkName, setLinkName] = useState("");
  const [maxUsers, setMaxUsers] = useState<number>(10);
  const [requiresRequest, setRequiresRequest] = useState(false);
  const [shareWithOrganization, setShareWithOrganization] = useState(false);
  const [timeLimited, setTimeLimited] = useState(true);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([dayjs(), dayjs().add(7, "day")]);

  // Share links data
  const [shareLinks, setShareLinks] = useState<ShareLinkData[]>([]);

  // Determine if can share
  const canShare =
    isPublic ||
    isSharedWithOrganization ||
    ((isPrivate || isPrivateShared) && isOwner);

  const shareUrl = `${window.location.origin}/document-detail/${documentId}`;

  const fetchShareLinks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DocumentAPI.getShareLinks(documentId);
      setShareLinks(response.data || []);
    } catch (error: unknown) {
      let errorMessage = "Không thể tải danh sách link chia sẻ!";

      if (error && typeof error === "object" && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiError = error as any;
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.response?.status === 403) {
          errorMessage = "Bạn không có quyền xem danh sách link chia sẻ!";
        } else if (apiError.response?.status === 404) {
          errorMessage = "Tài liệu không tồn tại!";
        }
      }
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [documentId, messageApi]);

  // Fetch share links when modal opens
  useEffect(() => {
    if (visible && (isPrivate || isPrivateShared) && isOwner) {
      fetchShareLinks();
    }
  }, [visible, isPrivate, isPrivateShared, isOwner, fetchShareLinks]);

  const handleCopyLink = async (linkOrUrl: string) => {
    try {
      const fullUrl = linkOrUrl.startsWith("http")
        ? linkOrUrl
        : `${window.location.origin}${linkOrUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      messageApi.success("Đã sao chép link!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      messageApi.error("Không thể sao chép link!");
    }
  };

  const handleCreateLink = async () => {
    if (!linkName.trim()) {
      messageApi.error("Vui lòng nhập tên link!");
      return;
    }

    if (timeLimited && (!dateRange[0] || !dateRange[1])) {
      messageApi.error("Vui lòng chọn thời gian bắt đầu và kết thúc!");
      return;
    }

    try {
      setLoading(true);

      const createData = {
        name: linkName,
        limited_access: maxUsers === -1 ? 999999 : maxUsers,
        request: requiresRequest,
        time_limited: timeLimited,
        // share_with_organization: shareWithOrganization,
        start_date: timeLimited ? dateRange[0]!.toISOString() : undefined,
        end_date: timeLimited ? dateRange[1]!.toISOString() : undefined,
      };

      await DocumentAPI.createShareLink(documentId, createData);

      messageApi.success("Tạo link chia sẻ thành công!");

      // Reset form
      setLinkName("");
      setMaxUsers(10);
      setRequiresRequest(false);
      setShareWithOrganization(false);
      setTimeLimited(true);
      setDateRange([dayjs(), dayjs().add(7, "day")]);

      // Refresh list and switch to manage tab
      await fetchShareLinks();
      setActiveTab("manage");
    } catch (error: unknown) {
      let errorMessage = "Không thể tạo link chia sẻ!";

      if (error && typeof error === "object" && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiError = error as any;
        if (apiError.response) {
          // Server responded with error status
          const serverMessage =
            apiError.response.data?.message || apiError.response.data?.error;

          if (serverMessage) {
            errorMessage = serverMessage;
          } else if (apiError.response.status === 403) {
            errorMessage =
              "Bạn không có quyền tạo link chia sẻ cho tài liệu này!";
          } else if (apiError.response.status === 404) {
            errorMessage = "Tài liệu không tồn tại!";
          } else if (apiError.response.status === 400) {
            errorMessage = "Dữ liệu không hợp lệ!";
          }
        } else if ("request" in apiError) {
          // Network error
          errorMessage = "Không thể kết nối đến server!";
        }
      }

      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    linkId: string,
    newStatus: "ACTIVE" | "INACTIVE" | "DISABLED"
  ) => {
    try {
      setLoading(true);

      await DocumentAPI.updateShareLinkStatus(linkId, newStatus);

      // Update local state
      setShareLinks(
        shareLinks.map((link) =>
          link._id === linkId ? { ...link, status: newStatus } : link
        )
      );

      const statusText = {
        ACTIVE: "kích hoạt",
        INACTIVE: "khóa",
        DISABLED: "vô hiệu hóa",
      }[newStatus];

      messageApi.success(`Đã ${statusText} link chia sẻ thành công!`);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message ||
            "Không thể cập nhật trạng thái link!"
          : "Không thể cập nhật trạng thái link!";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "orange";
      case "DISABLED":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Đã khóa";
      case "DISABLED":
        return "Vô hiệu hóa";
      default:
        return status;
    }
  };

  const handleModalClose = () => {
    onClose();
    setCopied(false);
    setActiveTab("create");
  };

  if (!canShare) {
    return null;
  }

  // Columns for share links table
  const columns = [
    {
      title: "Tên Link",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ShareLinkData) => (
        <div>
          <span className="font-medium">{text}</span>
          {record.request && (
            <Tag color="blue" className="ml-2" style={{ fontSize: "12px" }}>
              Yêu cầu duyệt
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Người dùng",
      key: "users",
      render: (record: ShareLinkData) => (
        <span className="text-sm">
          {record.access_count}/
          {record.limited_access === 999999 ? "∞" : record.limited_access}
        </span>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (record: ShareLinkData) => (
        <div className="text-xs text-gray-600">
          {record.time_limited ? (
            <>
              <div>Từ: {formatDate(record.start_date)}</div>
              <div>Đến: {formatDate(record.end_date)}</div>
            </>
          ) : (
            <span className="text-green-600">Không giới hạn</span>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (record: ShareLinkData) => (
        <div className="flex items-center space-x-2">
          {record.status === "ACTIVE" && (
            <>
              <Tooltip title="Sao chép link">
                <Button
                  size="small"
                  icon={<Copy size={12} />}
                  onClick={() => handleCopyLink(record.access_url)}
                />
              </Tooltip>
              <Tooltip title="Khóa link">
                <Button
                  size="small"
                  icon={<Lock size={12} />}
                  onClick={() => handleUpdateStatus(record._id, "INACTIVE")}
                  className="text-orange-600 hover:text-orange-700"
                  loading={loading}
                />
              </Tooltip>
              <Tooltip title="Vô hiệu hóa">
                <Button
                  size="small"
                  icon={<Ban size={12} />}
                  onClick={() => handleUpdateStatus(record._id, "DISABLED")}
                  className="text-red-600 hover:text-red-700"
                  loading={loading}
                />
              </Tooltip>
            </>
          )}

          {record.status === "INACTIVE" && (
            <>
              <Tooltip title="Sao chép link">
                <Button
                  size="small"
                  icon={<Copy size={12} />}
                  onClick={() => handleCopyLink(record.access_url)}
                />
              </Tooltip>
              <Tooltip title="Kích hoạt lại">
                <Button
                  size="small"
                  icon={<Eye size={12} />}
                  onClick={() => handleUpdateStatus(record._id, "ACTIVE")}
                  className="text-green-600 hover:text-green-700"
                  loading={loading}
                />
              </Tooltip>
              <Tooltip title="Vô hiệu hóa">
                <Button
                  size="small"
                  icon={<Ban size={12} />}
                  onClick={() => handleUpdateStatus(record._id, "DISABLED")}
                  className="text-red-600 hover:text-red-700"
                  loading={loading}
                />
              </Tooltip>
            </>
          )}

          {record.status === "DISABLED" && (
            <Tooltip title="Không thể khôi phục">
              <span className="text-xs text-gray-400">Đã vô hiệu hóa</span>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <Forward size={20} className="text-blue-600" />
            <span>Chia sẻ tài liệu</span>
          </div>
        }
        open={visible}
        onCancel={handleModalClose}
        footer={null}
        width={900}
      >
        <div className="py-4">
          {/* Document Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 truncate">
              {documentTitle}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {isPublic && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Công khai
                </span>
              )}
              {isSharedWithOrganization && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Chia sẻ với tổ chức
                </span>
              )}
              {(isPrivate || isPrivateShared) && isOwner && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  Riêng tư - Chủ sở hữu
                </span>
              )}
            </div>
          </div>

          {/* For Public/Organization documents */}
          {(isPublic || isSharedWithOrganization) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link chia sẻ:
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full bg-transparent text-sm text-gray-700 outline-none cursor-text"
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
                <button
                  onClick={() => handleCopyLink(shareUrl)}
                  className={`flex items-center space-x-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                    copied
                      ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 hover:border-green-400"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:scale-105"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* For Private documents - Owner only */}
          {(isPrivate || isPrivateShared) && isOwner && (
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="mt-4"
            >
              <TabPane
                tab={
                  <span className="flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Tạo Link Chia Sẻ</span>
                  </span>
                }
                key="create"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên link chia sẻ *
                    </label>
                    <Input
                      placeholder="Nhập tên cho link chia sẻ (vd: Link cho nhóm A)"
                      value={linkName}
                      onChange={(e) => setLinkName(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users size={16} className="inline mr-1" />
                        Giới hạn người dùng
                      </label>
                      <Select
                        value={maxUsers}
                        onChange={setMaxUsers}
                        className="w-full"
                      >
                        <Option value={-1}>Không giới hạn</Option>
                        <Option value={1}>1 người</Option>
                        <Option value={5}>5 người</Option>
                        <Option value={10}>10 người</Option>
                        <Option value={20}>20 người</Option>
                        <Option value={50}>50 người</Option>
                        <Option value={100}>100 người</Option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock size={16} className="inline mr-1" />
                        Giới hạn thời gian
                      </label>
                      <Checkbox
                        checked={timeLimited}
                        onChange={(e) => setTimeLimited(e.target.checked)}
                      >
                        Có giới hạn thời gian
                      </Checkbox>
                    </div>
                  </div>

                  {timeLimited && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian hiệu lực
                      </label>
                      <RangePicker
                        showTime
                        value={dateRange}
                        onChange={(dates) =>
                          setDateRange(dates || [null, null])
                        }
                        className="w-full"
                        placeholder={[
                          "Thời gian bắt đầu",
                          "Thời gian kết thúc",
                        ]}
                      />
                    </div>
                  )}

                  <div>
                    <Checkbox
                      checked={requiresRequest}
                      onChange={(e) => setRequiresRequest(e.target.checked)}
                    >
                      <span className="text-sm font-medium">
                        Yêu cầu phê duyệt trước khi truy cập
                      </span>
                    </Checkbox>
                    {requiresRequest && (
                      <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        💡 Người dùng sẽ phải gửi yêu cầu và được bạn phê duyệt
                        trước khi có thể truy cập tài liệu
                      </div>
                    )}
                  </div>

                  <div>
                    <Checkbox
                      checked={shareWithOrganization}
                      onChange={(e) =>
                        setShareWithOrganization(e.target.checked)
                      }
                    >
                      <span className="text-sm font-medium">
                        Chia sẻ với tổ chức
                      </span>
                    </Checkbox>
                    {shareWithOrganization && (
                      <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                        💡 Link này sẽ được chia sẻ với tất cả thành viên trong
                        tổ chức của bạn
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    <p className="mb-2">
                      <strong>Lưu ý:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Link sẽ tự động hết hạn sau thời gian đã chọn (nếu có)
                      </li>
                      <li>
                        Chỉ số lượng người dùng được phép mới có thể truy cập
                      </li>
                      <li>
                        Bạn có thể quản lý và thu hồi quyền truy cập bất cứ lúc
                        nào
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={handleCreateLink}
                    className="w-full"
                    disabled={!linkName.trim()}
                    loading={loading}
                  >
                    Tạo Link Chia Sẻ
                  </Button>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span className="flex items-center space-x-2">
                    <Settings size={16} />
                    <span>Quản Lý Link ({shareLinks.length})</span>
                  </span>
                }
                key="manage"
              >
                <div>
                  {shareLinks.length > 0 ? (
                    <Table
                      columns={columns}
                      dataSource={shareLinks}
                      rowKey="_id"
                      pagination={false}
                      size="small"
                      className="mt-4"
                      loading={loading}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Settings size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Chưa có link chia sẻ nào được tạo</p>
                      <Button
                        type="link"
                        onClick={() => setActiveTab("create")}
                      >
                        Tạo link đầu tiên
                      </Button>
                    </div>
                  )}
                </div>

                {shareLinks.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
                    <p className="mb-2">
                      <strong>Giải thích trạng thái:</strong>
                    </p>
                    <ul className="space-y-1">
                      <li>
                        <Tag color="green" style={{ fontSize: "12px" }}>
                          Hoạt động
                        </Tag>
                        - Link có thể sử dụng bình thường
                      </li>
                      <li>
                        <Tag color="orange" style={{ fontSize: "12px" }}>
                          Đã khóa
                        </Tag>
                        - Không cho người mới truy cập, nhưng người đã có quyền
                        vẫn xem được
                      </li>
                      <li>
                        <Tag color="red" style={{ fontSize: "12px" }}>
                          Vô hiệu hóa
                        </Tag>
                        - Thu hồi hoàn toàn quyền truy cập của tất cả người dùng
                      </li>
                      <li>
                        <Tag color="blue" style={{ fontSize: "12px" }}>
                          Yêu cầu duyệt
                        </Tag>
                        - Người dùng phải được phê duyệt trước khi truy cập
                      </li>
                      <li>
                        <strong style={{ color: "red", fontWeight: 700 }}>
                          Lưu ý!
                        </strong>{" "}
                        <span style={{ color: "red", fontWeight: 700 }}>
                          Khi đã vô hiệu hóa, link sẽ không thể khôi phục lại và
                          quyền truy cập sẽ bị thu hồi vĩnh viễn!
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </TabPane>
            </Tabs>
          )}

          {/* Instructions for public/org documents */}
          {(isPublic || isSharedWithOrganization) && (
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
              <p className="mb-1">
                💡 <strong>Hướng dẫn:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sao chép link và chia sẻ với những người bạn muốn</li>
                <li>Người khác có thể truy cập trực tiếp qua link này</li>
                {isPublic && (
                  <li>Tài liệu công khai - mọi người đều có thể xem</li>
                )}
                {isSharedWithOrganization && (
                  <li>Chỉ thành viên cùng tổ chức mới có thể truy cập</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ShareModal;
