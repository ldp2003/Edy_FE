import React, { useState, useEffect } from "react";
import { Table, Dropdown, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  Trash,
  Edit,
  Settings,
  Globe,
  Lock,
  Users,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createStatusTag,
  createPublicModeTag,
  createFileTypeTag,
} from "../../../locales/translationUtils";
import {
  PublicMode,
  publicModeLabels,
  type PublicModeType,
} from "../../../models/document";
import ShareModal from "../share/ShareModal";
import { DocumentService } from "../../../utils/DocumentService";
import { fetchMultipleDocumentRatings } from "../../../utils/CalcRate";

interface Post {
  key: string;
  _id?: string; // Add _id for API calls
  index: number;
  title: string;
  views: number;
  comments: number;
  download_count: number;
  rating: string;
  status: string;
  mode: string;
  public_mode: string;
  url: string;
  createdAt: string;
  content_rejection?: {
    message: string;
  };
}

interface PostTableProps {
  data: Post[];
  loading?: boolean;
}

const PostTable: React.FC<PostTableProps> = ({ data, loading }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State for visibility management
  const [visibilityLoading, setVisibilityLoading] = useState<string | null>(
    null
  );
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingMode, setPendingMode] = useState<PublicModeType | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [updatedData, setUpdatedData] = useState<Post[]>(data);
  const [postRatings, setPostRatings] = useState<
    Map<string, { ratingPercentage: number; formattedRating: string }>
  >(new Map());

  // Fetch ratings khi data thay đổi
  useEffect(() => {
    const fetchRatings = async () => {
      if (data && data.length > 0) {
        const documentIds = data.map((post) => post._id || post.key);
        try {
          const ratingsMap = await fetchMultipleDocumentRatings(documentIds);
          setPostRatings(ratingsMap);
        } catch (error) {
          console.error("Error fetching post ratings:", error);
          setPostRatings(new Map());
        }
      } else {
        setPostRatings(new Map());
      }
    };

    fetchRatings();
  }, [data]);

  // Get icon for public mode
  const getPublicModeIcon = (mode: string) => {
    switch (mode) {
      case PublicMode.PUBLIC:
        return <Globe size={12} />;
      case PublicMode.PRIVATE:
        return <Lock size={12} />;
      case PublicMode.SHARE_ORGANIZATION:
        return <Users size={12} />;
      case PublicMode.PRIVATE_SHARED:
        return <Share2 size={12} />;
      default:
        return <Settings size={12} />;
    }
  };

  // Get available options (exclude current mode)
  const getAvailableOptions = (currentMode: string) => {
    const options: { mode: PublicModeType; label: string }[] = [];

    if (currentMode !== PublicMode.PUBLIC) {
      options.push({ mode: PublicMode.PUBLIC, label: "Công khai" });
    }
    if (currentMode !== PublicMode.PRIVATE) {
      if (currentMode !== PublicMode.PRIVATE_SHARED) {
        options.push({ mode: PublicMode.PRIVATE, label: "Riêng tư" });
      }
    }
    // if (currentMode !== PublicMode.PRIVATE_SHARED) {
    //   options.push({
    //     mode: PublicMode.PRIVATE_SHARED,
    //     label: "Chia sẻ cá nhân",
    //   });
    // }
    if (currentMode !== PublicMode.SHARE_ORGANIZATION) {
      options.push({
        mode: PublicMode.SHARE_ORGANIZATION,
        label: "Chỉ tổ chức",
      });
    }

    return options;
  };

  // Handle visibility change with confirmation
  const handleVisibilityChange = async (
    post: Post,
    newMode: PublicModeType
  ) => {
    setSelectedPost(post);

    // Nếu chọn "Chia sẻ cá nhân" thì mở ShareModal
    if (newMode === PublicMode.PRIVATE_SHARED) {
      setShareModalVisible(true);
      return;
    }

    // Với các chế độ khác: PUBLIC, PRIVATE - hiển thị modal xác nhận
    setPendingMode(newMode);
    setConfirmModalVisible(true);
  };

  // Handle confirm change visibility
  const handleConfirmChangeVisibility = async () => {
    if (!pendingMode || !selectedPost) return;

    setConfirmModalVisible(false);
    setVisibilityLoading(selectedPost.key);

    try {
      // Use _id or key for API call
      const documentId = selectedPost._id || selectedPost.key;
      await DocumentService.updateDocumentPublicMode(documentId, pendingMode);

      // Update local data
      const newData = updatedData.map((item) =>
        item.key === selectedPost.key
          ? { ...item, public_mode: pendingMode }
          : item
      );
      setUpdatedData(newData);

      messageApi.success(
        `Đã thay đổi chế độ hiển thị thành "${publicModeLabels[pendingMode]}"!`
      );
    } catch (error) {
      console.error("Error changing visibility:", error);
      messageApi.error("Không thể cập nhật chế độ hiển thị!");
    } finally {
      setVisibilityLoading(null);
      setPendingMode(null);
      setSelectedPost(null);
    }
  };

  // Handle cancel change visibility
  const handleCancelChangeVisibility = () => {
    setConfirmModalVisible(false);
    setPendingMode(null);
    setSelectedPost(null);
  };

  const columns: ColumnsType<Post> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
      fixed: true,
    },
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
      width: 300,
      fixed: "left",
      render: (text: string, record: Post) => {
        const isRejected = record.status === "REJECTED";
        const isRequestedEdit =
          record.status === "REQUESTED_EDIT" ||
          record.status === "PENDING_EDIT";
        const hasRejectionMessage = record.content_rejection?.message;
        const showRejectionReason =
          (isRejected || isRequestedEdit) && hasRejectionMessage;

        return (
          <div
            onClick={
              isRejected
                ? undefined
                : () =>
                    navigate(`/personal-posts/document-detail/${record.key}`)
            }
            className={isRejected ? "cursor-not-allowed" : "cursor-pointer"}
          >
            <div
              className={`text-[var(--primary-text-color)] font-medium ${
                isRejected ? "line-through text-gray-400" : ""
              }`}
              style={{ fontSize: isRejected ? "12px" : "14px" }}
            >
              {text}
            </div>
            {showRejectionReason && (
              <div
                style={{
                  fontSize: "11px",
                  color: isRejected ? "#e74c3c" : "#f39c12",
                  fontStyle: "italic",
                  marginTop: "4px",
                }}
              >
                {isRejected ? "Lý do từ chối" : "Yêu cầu chỉnh sửa"}:{" "}
                {record.content_rejection?.message}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 120,
      render: (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (status: string) => createStatusTag(status),
    },
    {
      title: "Chế độ",
      dataIndex: "public_mode",
      key: "public_mode",
      align: "center",
      width: 120,
      render: (mode: string) => createPublicModeTag(mode),
    },

    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      align: "center",
      width: 100,
    },
    {
      title: "Bình luận",
      dataIndex: "comments",
      key: "comments",
      align: "center",
      width: 100,
    },
    {
      title: "Lượt tải",
      dataIndex: "download_count",
      key: "download_count",
      align: "center",
      width: 100,
    },
    {
      title: "Loại file",
      dataIndex: "mode",
      key: "mode",
      align: "center",
      width: 100,
      render: (fileType: string) => createFileTypeTag(fileType),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      width: 100,
      render: (_, record: Post) => {
        const documentId = record._id || record.key;
        const rating = postRatings.get(documentId);

        if (!rating) {
          return <span className="text-gray-400">-</span>;
        }

        const percentage = rating.ratingPercentage;
        let colorClass = "text-gray-600";

        if (percentage >= 90) colorClass = "text-green-600 font-semibold";
        else if (percentage >= 70) colorClass = "text-blue-600 font-medium";
        else if (percentage >= 50) colorClass = "text-yellow-600";
        else if (percentage >= 30) colorClass = "text-orange-600";
        else if (percentage > 0) colorClass = "text-red-600";

        return (
          <span
            className={colorClass}
            title={`${rating.ratingPercentage}% tích cực`}
          >
            {rating.formattedRating}
          </span>
        );
      },
    },

    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const isRejected = record.status === "REJECTED";
        const isLoading = visibilityLoading === record.key;

        // Create dropdown items for visibility change
        const dropdownItems = getAvailableOptions(record.public_mode).map(
          (option) => ({
            key: option.mode,
            label: (
              <div className="flex items-center gap-2">
                {getPublicModeIcon(option.mode)}
                <span>{option.label}</span>
              </div>
            ),
            onClick: () => handleVisibilityChange(record, option.mode),
          })
        );

        return (
          <div className="flex gap-1 justify-center">
            {/* Edit Button */}
            <button
              className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                isRejected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--green-button-color)] hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
              }`}
              onClick={
                isRejected
                  ? undefined
                  : () => navigate(`/personal-posts/edit/${record.key}`)
              }
              title={
                isRejected
                  ? "Không thể sửa tài liệu bị từ chối"
                  : "Chỉnh sửa tài liệu"
              }
              disabled={isRejected}
            >
              <Edit size={13} />
            </button>

            {/* Visibility Dropdown Button */}
            <Dropdown
              menu={{ items: dropdownItems }}
              placement="bottomRight"
              disabled={isRejected || isLoading}
            >
              <button
                className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                  isRejected
                    ? "bg-gray-400 cursor-not-allowed"
                    : isLoading
                    ? "bg-blue-300 cursor-wait"
                    : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
                }`}
                title={
                  isRejected
                    ? "Không thể thay đổi chế độ hiển thị tài liệu bị từ chối"
                    : "Thay đổi chế độ hiển thị"
                }
                disabled={isRejected || isLoading}
              >
                {isLoading ? (
                  <Settings size={13} className="animate-spin" />
                ) : (
                  getPublicModeIcon(record.public_mode)
                )}
              </button>
            </Dropdown>

            {/* Delete Button */}
            <button
              className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                isRejected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--red-button-color)] hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
              }`}
              onClick={
                isRejected
                  ? undefined
                  : () => console.log("Delete action triggered")
              }
              title={
                isRejected
                  ? "Không thể xóa tài liệu bị từ chối"
                  : "Xóa tài liệu"
              }
              disabled={isRejected}
            >
              <Trash size={13} />
            </button>
          </div>
        );
      },
    },
  ];

  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading
    ? []
    : updatedData.length > 0
    ? updatedData
    : data;

  return (
    <>
      {contextHolder}
      <div className="rounded-md overflow-hidden w-full border border-[rgba(0,0,0,0.2)]">
        <Table
          columns={columns}
          dataSource={displayData}
          loading={loading}
          pagination={false}
          size="small"
          scroll={{ x: 1200, y: 600 }}
          bordered
          sticky={{ offsetHeader: 0 }}
        />
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Xác nhận thay đổi chế độ hiển thị"
        open={confirmModalVisible}
        onOk={handleConfirmChangeVisibility}
        onCancel={handleCancelChangeVisibility}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={!!visibilityLoading}
      >
        {pendingMode && selectedPost && (
          <div>
            <p>
              Bạn có muốn thay đổi chế độ hiển thị của tài liệu "
              {selectedPost.title}" từ "
              {publicModeLabels[selectedPost.public_mode as PublicModeType] ||
                selectedPost.public_mode}
              " sang "{publicModeLabels[pendingMode]}" không?
            </p>
            {pendingMode === PublicMode.SHARE_ORGANIZATION && (
              <p className="mt-2 text-orange-600 bg-orange-50 p-2 rounded">
                ⚠️ Nếu bạn để chế độ này, chỉ có người trong tổ chức mới có thể
                xem tài liệu.
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* ShareModal */}
      {selectedPost && (
        <ShareModal
          visible={shareModalVisible}
          onClose={() => {
            setShareModalVisible(false);
            setSelectedPost(null);
          }}
          documentId={selectedPost._id || selectedPost.key}
          documentTitle={selectedPost.title}
          isPublic={selectedPost.public_mode === PublicMode.PUBLIC}
          isSharedWithOrganization={
            selectedPost.public_mode === PublicMode.SHARE_ORGANIZATION
          }
          isPrivate={selectedPost.public_mode === PublicMode.PRIVATE}
          isPrivateShared={
            selectedPost.public_mode === PublicMode.PRIVATE_SHARED
          }
          isOwner={true}
        />
      )}
    </>
  );
};

export default PostTable;
