import React from "react";
import { Select, Button, Tag, Tooltip } from "antd";
import {
  Plus,
  UserCheck,
  UserX,
  MessageSquare,
  Calendar,
  AlertCircle,
} from "lucide-react";
import dayjs from "dayjs";
import type { AccessRequest } from "../../../models/accessRequest";
import type { ShareLinkData } from "./ShareModal";
import AccessRequestService from "../../../utils/AccessRequestService";

const { Option } = Select;

interface AccessRequestsPanelProps {
  shareLinks: ShareLinkData[];
  accessRequests: AccessRequest[];
  selectedLinkId: string | null;
  loading: boolean;
  onLinkSelect: (linkId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onDenyRequest: (requestId: string, reason?: string) => void;
  onCreateTabClick: () => void;
}

const AccessRequestsPanel: React.FC<AccessRequestsPanelProps> = ({
  shareLinks,
  accessRequests,
  selectedLinkId,
  loading,
  onLinkSelect,
  onApproveRequest,
  onDenyRequest,
  onCreateTabClick,
}) => {
  const linksWithRequests = shareLinks.filter(
    (link) =>
      link.request && (link.status === "ACTIVE" || link.status === "INACTIVE")
  );

  return (
    <div>
      {/* Link selector if multiple links with request approval */}
      {linksWithRequests.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn link để xem yêu cầu:
          </label>
          <Select
            value={selectedLinkId}
            onChange={onLinkSelect}
            placeholder="Chọn link chia sẻ"
            className="w-full"
          >
            {linksWithRequests.map((link) => (
              <Option key={link._id} value={link._id}>
                {link.name}{" "}
                <Tag
                  color={link.status === "ACTIVE" ? "green" : "orange"}
                  style={{ fontSize: "11px" }}
                >
                  {link.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                </Tag>
              </Option>
            ))}
          </Select>
        </div>
      )}

      {/* Auto-select single link */}
      {linksWithRequests.length === 1 && !selectedLinkId && (
        <div className="hidden">
          {(() => {
            const singleLink = linksWithRequests[0];
            if (singleLink && selectedLinkId !== singleLink._id) {
              onLinkSelect(singleLink._id);
            }
            return null;
          })()}
        </div>
      )}

      {/* Show requests if link is selected */}
      {selectedLinkId ? (
        <div>
          {accessRequests.length > 0 ? (
            <div className="space-y-4">
              {accessRequests.map((request) => (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-lg p-4 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      {/* User Avatar & Info */}
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {AccessRequestService.getUserAvatar(request.user) ? (
                          <img
                            src={
                              AccessRequestService.getUserAvatar(request.user)!
                            }
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium text-sm">
                            {AccessRequestService.getUserInitials(request.user)}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {AccessRequestService.formatUserName(request.user)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {AccessRequestService.getUserEmail(request.user)}
                          </p>
                          <Tag
                            color={AccessRequestService.getStatusColor(
                              request.status
                            )}
                          >
                            {AccessRequestService.getStatusLabel(
                              request.status
                            )}
                          </Tag>
                        </div>

                        {request.content && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <MessageSquare size={14} className="inline mr-1" />
                            <strong>Lời nhắn:</strong> {request.content}
                          </div>
                        )}
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          Yêu cầu lúc:{" "}
                          {dayjs(request.createdAt).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {request.status === "PENDING" && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Tooltip title="Phê duyệt yêu cầu">
                          <Button
                            size="small"
                            type="primary"
                            icon={<UserCheck size={14} />}
                            onClick={() => onApproveRequest(request._id)}
                            loading={loading}
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                          >
                            Duyệt
                          </Button>
                        </Tooltip>
                        <Tooltip title="Từ chối yêu cầu">
                          <Button
                            size="small"
                            icon={<UserX size={14} />}
                            onClick={() =>
                              onDenyRequest(
                                request._id,
                                "Không đáp ứng yêu cầu"
                              )
                            }
                            loading={loading}
                            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          >
                            Từ chối
                          </Button>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <UserCheck size={48} className="mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Không có yêu cầu truy cập
              </h3>
              <p className="text-sm">
                {shareLinks.find((l) => l._id === selectedLinkId)?.name ||
                  "Link này"}{" "}
                chưa có yêu cầu truy cập nào.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* No link selected or no links with request approval */
        <div className="text-center py-12 text-gray-500">
          {shareLinks.filter((link) => link.request).length === 0 ? (
            <>
              <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Không có link yêu cầu duyệt
              </h3>
              <p className="text-sm mb-4">
                Bạn chưa tạo link nào có tính năng "yêu cầu phê duyệt trước khi
                truy cập".
              </p>
              <Button
                type="link"
                onClick={onCreateTabClick}
                icon={<Plus size={14} />}
              >
                Tạo link với yêu cầu duyệt
              </Button>
            </>
          ) : (
            <>
              <UserCheck size={48} className="mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Chọn link để xem yêu cầu
              </h3>
              <p className="text-sm">
                Chọn một link ở trên để xem các yêu cầu truy cập.
              </p>
            </>
          )}
        </div>
      )}

      {/* Instructions */}
      {selectedLinkId && accessRequests.length > 0 && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="mb-2">
            <strong>💡 Hướng dẫn:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>
              <strong>Phê duyệt:</strong> Người dùng sẽ có quyền truy cập tài
              liệu ngay lập tức
            </li>
            <li>
              <strong>Từ chối:</strong> Yêu cầu sẽ bị từ chối và người dùng
              không thể truy cập
            </li>
            <li>Bạn có thể xem lại các quyết định đã xử lý trong lịch sử</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccessRequestsPanel;
