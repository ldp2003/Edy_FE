import React, { useState, useEffect } from "react";
import { Table, Dropdown, Modal, message, Checkbox } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  Trash,
  Edit,
  Settings,
  Globe,
  Lock,
  Users,
  Share2,
  Eye,
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
  type Document,
  documentTypeLabels,
} from "../../../models/document";
import ShareModal from "../share/ShareModal";
import { DocumentService } from "../../../utils/DocumentService";
import { calculateDocumentRating } from "../../../utils/CalcRate";

interface PostTableProps {
  data: Document[];
  loading?: boolean;
  onDataChange?: (updatedData: Document[]) => void;
  currentPage?: number;
  pageSize?: number;
}

const PostTable: React.FC<PostTableProps> = ({
  data,
  loading,
  onDataChange,
  currentPage = 1,
  pageSize = 5,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State for visibility management
  const [visibilityLoading, setVisibilityLoading] = useState<string | null>(
    null
  );
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingMode, setPendingMode] = useState<PublicModeType | null>(null);
  const [selectedPost, setSelectedPost] = useState<Document | null>(null);
  const [updatedData, setUpdatedData] = useState<Document[]>(data);

  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      "index",
      "title",
      "createdAt",
      "status",
      "public_mode",
      "author",
      "subject",
      "level",
      "view",
      "comment_count",
      "download_count",
      "rating",
      "action",
    ])
  );

  // Update updatedData when data prop changes
  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  // Save column visibility to localStorage
  const saveColumnVisibility = (columns: Set<string>) => {
    localStorage.setItem(
      "postTableVisibleColumns",
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
      if (columnKey === "title" || columnKey === "action") {
        messageApi.warning("Không thể ẩn cột Tên tài liệu và Thao tác!");
        return;
      }
      newVisibleColumns.delete(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
    saveColumnVisibility(newVisibleColumns);
  };

  console.log("PostTable data:", data);
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
    post: Document,
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
    setVisibilityLoading(selectedPost._id);

    try {
      // Use _id for API call
      const documentId = selectedPost._id;
      await DocumentService.updateDocumentPublicMode(documentId, pendingMode);

      // Update local data
      const newData = updatedData.map((item) =>
        item._id === selectedPost._id
          ? { ...item, public_mode: pendingMode }
          : item
      );
      setUpdatedData(newData);

      // Notify parent component about data change
      if (onDataChange) {
        onDataChange(newData);
      }

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

  const columns: ColumnsType<Document> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
      fixed: true,
      responsive: ["md"],
      render: (_: unknown, __: Document, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      className: "text-xs",
      width: 300,
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: Document) => {
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
                    navigate(`/personal-posts/document-detail/${record._id}`)
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
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ["ascend", "descend"],
      responsive: ["sm"],
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
      responsive: ["md"],
      render: (status: string) => createStatusTag(status),
    },
    {
      title: "Chế độ",
      dataIndex: "public_mode",
      key: "public_mode",
      align: "center",
      width: 120,
      responsive: ["md"],
      render: (mode: string) => createPublicModeTag(mode),
    },

    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
      align: "center",
      width: 100,
      sorter: (a, b) => (a.view || 0) - (b.view || 0),
      sortDirections: ["ascend", "descend"],
      responsive: ["sm"],
    },
    {
      title: "Bình luận",
      dataIndex: "comment_count",
      key: "comment_count",
      align: "center",
      width: 100,
      sorter: (a, b) => (a.comment_count || 0) - (b.comment_count || 0),
      sortDirections: ["ascend", "descend"],
      responsive: ["sm"],
    },
    {
      title: "Lượt tải",
      dataIndex: "download_count",
      key: "download_count",
      align: "center",
      width: 100,
      sorter: (a, b) => (a.download_count || 0) - (b.download_count || 0),
      sortDirections: ["ascend", "descend"],
      responsive: ["sm"],
    },
    {
      title: "Loại file",
      dataIndex: "file_type",
      key: "file_type",
      align: "center",
      width: 100,
      responsive: ["lg"],
      render: (fileType: string) => createFileTypeTag(fileType),
    },
    {
      title: "Loại tài liệu",
      dataIndex: "doc_type",
      key: "doc_type",
      align: "center",
      width: 120,
      responsive: ["md"],
      render: (docType: string) => {
        if (!docType) return <span className="text-gray-400">-</span>;
        const label =
          documentTypeLabels[docType as keyof typeof documentTypeLabels] ||
          docType;
        return (
          <span className="text-[var(--primary-text-color)] text-sm">
            {label}
          </span>
        );
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      width: 100,
      sorter: (a, b) => {
        const ratingA = calculateDocumentRating(
          a.like || 0,
          a.dislike || 0
        ).ratingPercentage;
        const ratingB = calculateDocumentRating(
          b.like || 0,
          b.dislike || 0
        ).ratingPercentage;
        return ratingA - ratingB;
      },
      sortDirections: ["ascend", "descend"],
      responsive: ["md"],
      render: (_, record: Document) => {
        const rating = calculateDocumentRating(
          record.like || 0,
          record.dislike || 0
        );
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
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: 150,
      responsive: ["lg"],
      render: (authors: string[]) => {
        if (!authors || authors.length === 0)
          return <span className="text-gray-400">-</span>;
        return (
          <span className="text-[var(--primary-text-color)] text-sm">
            {authors.join(", ")}
          </span>
        );
      },
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      width: 120,
      responsive: ["md"],
      render: (subject: { name: string }) => {
        if (!subject) return <span className="text-gray-400">-</span>;
        return (
          <span className="text-[var(--primary-text-color)] text-sm">
            {subject.name}
          </span>
        );
      },
    },
    {
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      align: "center",
      width: 100,
      responsive: ["md"],
      render: (level: string) => {
        if (!level) return <span className="text-gray-400">-</span>;
        const levelLabels: Record<string, string> = {
          STUDENT: "Sinh viên",
          UNIVERSITY: "Đại học",
          LECTURER: "Giảng viên",
          RESEARCHER: "Nghiên cứu",
          OTHER: "Khác",
        };
        return (
          <span className="text-[var(--primary-text-color)] text-sm">
            {levelLabels[level] || level}
          </span>
        );
      },
    },
    {
      title: "Chuyên sâu",
      dataIndex: "intensive",
      key: "intensive",
      align: "center",
      width: 100,
      responsive: ["md"],
      render: (intensive: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            intensive
              ? "bg-orange-100 text-orange-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {intensive ? "Có" : "Không"}
        </span>
      ),
    },
    {
      title: "Năm XB",
      dataIndex: "published_year",
      key: "published_year",
      align: "center",
      width: 80,
      responsive: ["lg"],
      render: (year: number) => {
        if (!year) return <span className="text-gray-400">-</span>;
        return (
          <span className="text-[var(--primary-text-color)] text-sm">
            {year}
          </span>
        );
      },
    },
    {
      title: "Nhà XB",
      dataIndex: "publisher",
      key: "publisher",
      width: 120,
      responsive: ["lg"],
      render: (publisher: string) => {
        if (!publisher) return <span className="text-gray-400">-</span>;
        return (
          <span className="text-[var(--primary-text-color)] text-sm">
            {publisher}
          </span>
        );
      },
    },
    {
      title: "Số trang",
      dataIndex: "page",
      key: "page",
      align: "center",
      width: 80,
      responsive: ["lg"],
      render: (page: number) => {
        if (!page) return <span className="text-gray-400">-</span>;
        return (
          <span className="text-[var(--primary-text-color)] text-sm">
            {page}
          </span>
        );
      },
    },
    {
      title: "Từ khóa",
      dataIndex: "keyword",
      key: "keyword",
      width: 150,
      responsive: ["xl"],
      render: (keywords: string[]) => {
        if (!keywords || keywords.length === 0)
          return <span className="text-gray-400">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {keywords.slice(0, 2).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {keyword}
              </span>
            ))}
            {keywords.length > 2 && (
              <span className="text-xs text-gray-500">
                +{keywords.length - 2}
              </span>
            )}
          </div>
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
        const isPendingApproval =
          record.status === "PENDING" || record.status === "PENDING_EDIT";
        const isLoading = visibilityLoading === record._id;

        // Create dropdown items for visibility change
        const dropdownItems = getAvailableOptions(
          record.public_mode || "PRIVATE"
        ).map((option) => ({
          key: option.mode,
          label: (
            <div className="flex items-center gap-2">
              {getPublicModeIcon(option.mode)}
              <span>{option.label}</span>
            </div>
          ),
          onClick: () => handleVisibilityChange(record, option.mode),
        }));

        return (
          <div className="flex gap-1 justify-center">
            {/* Edit Button */}
            <button
              className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                isRejected || isPendingApproval
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--green-button-color)] hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
              }`}
              onClick={
                isRejected || isPendingApproval
                  ? undefined
                  : () => navigate(`/personal-posts/edit/${record._id}`)
              }
              title={
                isRejected
                  ? "Không thể sửa tài liệu bị từ chối"
                  : isPendingApproval
                  ? "Không thể chỉnh sửa tài liệu đang chờ duyệt"
                  : "Chỉnh sửa tài liệu"
              }
              disabled={isRejected || isPendingApproval}
            >
              <Edit size={13} />
            </button>

            {/* Visibility Dropdown Button */}
            <Dropdown
              menu={{
                items: dropdownItems,
                style: { maxHeight: "200px", overflowY: "auto" },
              }}
              placement="bottomRight"
              disabled={isRejected || isLoading || isPendingApproval}
            >
              <button
                className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                  isRejected || isPendingApproval
                    ? "bg-gray-400 cursor-not-allowed"
                    : isLoading
                    ? "bg-blue-300 cursor-wait"
                    : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
                }`}
                title={
                  isRejected
                    ? "Không thể thay đổi chế độ hiển thị tài liệu bị từ chối"
                    : isPendingApproval
                    ? "Không thể thay đổi chế độ hiển thị tài liệu đang chờ duyệt"
                    : "Thay đổi chế độ hiển thị"
                }
                disabled={isRejected || isLoading || isPendingApproval}
              >
                {isLoading ? (
                  <Settings size={13} className="animate-spin" />
                ) : (
                  getPublicModeIcon(record.public_mode || "PRIVATE")
                )}
              </button>
            </Dropdown>

            {/* Delete Button */}
            <button
              className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                isRejected || isPendingApproval
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--red-button-color)] hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
              }`}
              onClick={
                isRejected || isPendingApproval
                  ? undefined
                  : () => {
                      setSelectedPost(record);
                      setConfirmModalVisible(true);
                    }
              }
              title={
                isRejected
                  ? "Không thể xóa tài liệu bị từ chối"
                  : isPendingApproval
                  ? "Không thể xóa tài liệu đang chờ duyệt"
                  : "Xóa tài liệu"
              }
              disabled={isRejected || isPendingApproval}
            >
              <Trash size={13} />
            </button>
          </div>
        );
      },
    },
  ];

  // Filter columns based on visibility
  const filteredColumns = columns.filter((column) =>
    visibleColumns.has(column.key as string)
  );

  // Column options for visibility toggle
  const columnOptions = [
    { key: "index", label: "STT" },
    { key: "title", label: "Tên tài liệu", disabled: true },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "status", label: "Trạng thái" },
    { key: "public_mode", label: "Chế độ" },
    { key: "view", label: "Lượt xem" },
    { key: "comment_count", label: "Bình luận" },
    { key: "download_count", label: "Lượt tải" },
    { key: "file_type", label: "Loại file" },
    { key: "doc_type", label: "Loại tài liệu" },
    { key: "rating", label: "Đánh giá" },
    { key: "author", label: "Tác giả" },
    { key: "subject", label: "Môn học" },
    { key: "level", label: "Cấp độ" },
    { key: "intensive", label: "Chuyên sâu" },
    { key: "published_year", label: "Năm XB" },
    { key: "publisher", label: "Nhà XB" },
    { key: "page", label: "Số trang" },
    { key: "keyword", label: "Từ khóa" },
    { key: "action", label: "Thao tác", disabled: true },
  ];

  // Dropdown menu for column visibility
  const columnVisibilityMenu = {
    items: columnOptions.map((option) => ({
      key: option.key,
      label: (
        <Checkbox
          checked={visibleColumns.has(option.key)}
          disabled={option.disabled}
          onChange={(e) => toggleColumnVisibility(option.key, e.target.checked)}
        >
          {option.label}
        </Checkbox>
      ),
    })),
  };

  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading
    ? []
    : updatedData.length > 0
    ? updatedData
    : data;

  return (
    <>
      {contextHolder}
      <div className="w-full">
        {/* Table Header with Column Visibility Controls */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[var(--primary-text-color)]">
            Danh sách tài liệu cá nhân
          </h3>
          <Dropdown
            menu={{
              ...columnVisibilityMenu,
              style: { maxHeight: "300px", overflowY: "auto" },
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
              <Eye size={16} />
              <span className="text-sm">Ẩn/Hiện cột</span>
            </button>
          </Dropdown>
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block rounded-md overflow-hidden border border-[rgba(0,0,0,0.2)]">
          <Table
            columns={filteredColumns}
            dataSource={displayData}
            loading={loading}
            pagination={false}
            size="small"
            scroll={{ x: 1200, y: 600 }}
            bordered
            sticky={{ offsetHeader: 0 }}
          />
        </div>
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
          documentId={selectedPost._id}
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
