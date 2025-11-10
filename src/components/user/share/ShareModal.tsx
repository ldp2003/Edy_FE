import { Forward, Copy, Check, Plus, Settings, UserCheck } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, message, Tabs, Button, Tag } from "antd";
import dayjs from "dayjs";
import { DocumentService } from "../../../utils/DocumentService";
import AccessRequestService from "../../../utils/AccessRequestService";
import type { AccessRequest } from "../../../models/accessRequest";
import ShareLinksTable from "./ShareLinksTable";
import ShareLinkCreateForm from "./ShareLinkCreateForm";
import AccessRequestsPanel from "./AccessRequestsPanel";

const { TabPane } = Tabs;

export interface ShareLinkData {
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
  const [timeLimited, setTimeLimited] = useState(true);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([dayjs(), dayjs().add(7, "day")]);

  // Share links data
  const [shareLinks, setShareLinks] = useState<ShareLinkData[]>([]);

  // Access requests data
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Determine if can share
  const canShare =
    isPublic ||
    isSharedWithOrganization ||
    ((isPrivate || isPrivateShared) && isOwner);

  const shareUrl = `${window.location.origin}/document-detail/${documentId}`;

  const fetchShareLinks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DocumentService.getShareLinks(documentId);
      const links = response.data || [];
      setShareLinks(links);

      // Count total pending requests across all links that require approval
      let totalPending = 0;
      for (const link of links.filter(
        (l: ShareLinkData) => l.request && l.status === "ACTIVE"
      )) {
        try {
          const requestsResponse =
            await AccessRequestService.getAccessRequestsByPrivateShare(
              link._id,
              {
                status: "PENDING",
                limit: 1000, // Get all pending requests for counting
              }
            );
          totalPending += requestsResponse.accessRequests?.length || 0;
        } catch {
          // Ignore errors when counting requests
        }
      }
      setPendingRequestsCount(totalPending);
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
        start_date: timeLimited ? dateRange[0]!.toISOString() : undefined,
        end_date: timeLimited ? dateRange[1]!.toISOString() : undefined,
      };

      await DocumentService.createShareLink(documentId, createData);

      messageApi.success("Tạo link chia sẻ thành công!");

      // Reset form
      setLinkName("");
      setMaxUsers(10);
      setRequiresRequest(false);
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

  const fetchAccessRequests = useCallback(
    async (linkId: string) => {
      if (!linkId) return;

      try {
        setLoading(true);
        const response =
          await AccessRequestService.getAccessRequestsByPrivateShare(linkId);
        setAccessRequests(response.accessRequests || []);
      } catch (error: unknown) {
        let errorMessage = "Không thể tải danh sách yêu cầu truy cập!";
        if (error && typeof error === "object" && "response" in error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const apiError = error as any;
          if (apiError.response?.data?.message) {
            errorMessage = apiError.response.data.message;
          }
        }
        messageApi.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  const handleApproveRequest = async (requestId: string) => {
    try {
      setLoading(true);
      await AccessRequestService.approveAccessRequest(requestId);
      messageApi.success("Đã phê duyệt yêu cầu truy cập!");

      // Refresh both requests and share links (to update counts)
      if (selectedLinkId) {
        await fetchAccessRequests(selectedLinkId);
      }
      await fetchShareLinks();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message ||
            "Không thể phê duyệt yêu cầu!"
          : "Không thể phê duyệt yêu cầu!";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDenyRequest = async (requestId: string) => {
    try {
      setLoading(true);
      await AccessRequestService.denyAccessRequest(requestId);
      messageApi.success("Đã từ chối yêu cầu truy cập!");

      // Refresh both requests and share links (to update counts)
      if (selectedLinkId) {
        await fetchAccessRequests(selectedLinkId);
      }
      await fetchShareLinks();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message ||
            "Không thể từ chối yêu cầu!"
          : "Không thể từ chối yêu cầu!";
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

      await DocumentService.updateShareLinkStatus(linkId, newStatus);

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

      // Refresh pending count
      await fetchShareLinks();
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

  const handleModalClose = () => {
    onClose();
    setCopied(false);
    setActiveTab("create");
    setSelectedLinkId(null);
    setAccessRequests([]);
  };

  if (!canShare) {
    return null;
  }

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
                      ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-300 hover:border-green-400"
                      : "bg-blue-600 text-white hover:bg-blue-800 hover:shadow-md transform hover:scale-105"
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
                <ShareLinkCreateForm
                  linkName={linkName}
                  maxUsers={maxUsers}
                  requiresRequest={requiresRequest}
                  timeLimited={timeLimited}
                  dateRange={dateRange}
                  loading={loading}
                  onLinkNameChange={setLinkName}
                  onMaxUsersChange={setMaxUsers}
                  onRequiresRequestChange={setRequiresRequest}
                  onTimeLimitedChange={setTimeLimited}
                  onDateRangeChange={setDateRange}
                  onCreateLink={handleCreateLink}
                />
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
                    <ShareLinksTable
                      shareLinks={shareLinks}
                      loading={loading}
                      onCopyLink={handleCopyLink}
                      onUpdateStatus={(id, status) =>
                        handleUpdateStatus(id, status)
                      }
                      onViewRequests={(id) => {
                        setSelectedLinkId(id);
                        setActiveTab("requests");
                        fetchAccessRequests(id);
                      }}
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

              {/* New Access Requests Tab */}
              <TabPane
                tab={
                  <span className="flex items-center space-x-2">
                    <UserCheck size={16} />
                    <span>Yêu cầu truy cập</span>
                    {pendingRequestsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </span>
                }
                key="requests"
              >
                <AccessRequestsPanel
                  shareLinks={shareLinks}
                  accessRequests={accessRequests}
                  selectedLinkId={selectedLinkId}
                  loading={loading}
                  onLinkSelect={(linkId) => {
                    setSelectedLinkId(linkId);
                    fetchAccessRequests(linkId);
                  }}
                  onApproveRequest={handleApproveRequest}
                  onDenyRequest={handleDenyRequest}
                  onCreateTabClick={() => setActiveTab("create")}
                />
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
