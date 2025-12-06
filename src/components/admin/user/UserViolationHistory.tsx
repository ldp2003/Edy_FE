/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Table, Tag, Button, message, Modal } from "antd";
import { Eye } from "lucide-react";
import { UserService } from "../../../utils/UserService";
import { VIOLATION_TYPE_TRANSLATIONS } from "../../../models/violationLog";
import { RESTRICTION_TYPE_TRANSLATIONS } from "../../../models/restriction";
import type { ViolationLog } from "../../../models/violationLog";
import type { Restriction } from "../../../models/restriction";

interface Violation {
  id: string;
  type: string;
  description: string;
  date: string;
  status: string;
}

interface UserViolationHistoryProps {
  userId: string;
  type: "violations" | "restrictions";
}

const UserViolationHistory: React.FC<UserViolationHistoryProps> = ({
  userId,
  type,
}) => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);

  const translateViolationType = (type: string): string => {
    return (
      VIOLATION_TYPE_TRANSLATIONS[
        type as keyof typeof VIOLATION_TYPE_TRANSLATIONS
      ] || type
    );
  };

  const translateRestrictionType = (type: string): string => {
    return (
      RESTRICTION_TYPE_TRANSLATIONS[
        type as keyof typeof RESTRICTION_TYPE_TRANSLATIONS
      ] || type
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        if (type === "violations") {
          data = await UserService.getUserViolations(userId);
        } else {
          data = await UserService.getUserRestrictions(userId);
        }
        let items;
        if (type === "violations") {
          items = data.violations || [];
        } else {
          items = data.restrictions || data.data || [];
        }
        const mappedViolations: Violation[] = items.map(
          (item: ViolationLog | Restriction) => {
            if (type === "violations") {
              const v = item as any;
              const docTitle = v.document?.title || "N/A";
              const commentContent = v.comment?.content
                ? ` - Bình luận: ${v.comment.content}`
                : "";
              return {
                id: v.id,
                type: v.type
                  .map((t: string) => translateViolationType(t))
                  .join(", "),
                description: `${v.reason} (Tài liệu: ${docTitle}${commentContent})`,
                date: new Date(v.createdAt).toLocaleDateString("vi-VN"),
                status: "Đã xử lý",
              };
            } else {
              const r = item as any;
              return {
                id: r.id,
                type: translateRestrictionType(r.type),
                description: r.reason || "N/A",
                date: new Date(r.startAt).toLocaleDateString("vi-VN"),
                status:
                  r.status === "ACTIVE"
                    ? "Đang áp dụng"
                    : r.status === "EXPIRED"
                    ? "Đã hết hạn"
                    : "Đã hủy",
              };
            }
          }
        );
        setViolations(mappedViolations);
        setAllData(items);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, type]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã xử lý":
        return "green";
      case "Đang xử lý":
        return "orange";
      case "Chưa xử lý":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Tên sự vi phạm",
      dataIndex: "type",
      key: "type",
      width: "25%",
      render: (text: string) => (
        <span className="font-medium text-sm">{text}</span>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="text-xs">
          {status}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (date: string) => (
        <span className="text-sm text-gray-600">{date}</span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_: unknown, record: Violation) => (
        <Button
          type="link"
          icon={<Eye size={14} />}
          size="small"
          onClick={() => handleViewDetail(record)}
          className="text-blue-500 p-0"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleViewMore = () => {
    setDetailModalVisible(true);
  };

  const handleViewDetail = (violation: Violation) => {
    message.info(`Xem chi tiết vi phạm: ${violation.type}`);
    // Implement detail view logic
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-sm">
            {type === "violations" ? "Lịch sử vi phạm" : "Lịch sử bị phạt"}
          </h3>
          <Button
            type="link"
            className="text-blue-500 text-sm p-0"
            onClick={handleViewMore}
          >
            Xem thêm
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={violations}
          loading={loading}
          pagination={false}
          size="small"
          className="text-sm"
          rowKey="id"
          locale={{
            emptyText:
              type === "violations" ? "Chưa có vi phạm" : "Chưa có bị phạt",
          }}
        />

        {violations.length > 0 && (
          <div className="text-xs text-gray-500 text-right mt-2">
            Tổng cộng: {violations.length}{" "}
            {type === "violations" ? "vi phạm" : "bị phạt"}
          </div>
        )}
      </div>

      <Modal
        title={
          type === "violations"
            ? "Chi tiết lịch sử vi phạm"
            : "Chi tiết lịch sử bị phạt"
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={allData.map((item: any) => {
            if (type === "violations") {
              const v = item;
              const docTitle = v.document?.title || "N/A";
              const commentContent = v.comment?.content
                ? ` - Bình luận: ${v.comment.content}`
                : "";
              return {
                id: v.id,
                type: v.type
                  .map((t: string) => translateViolationType(t))
                  .join(", "),
                description: `${v.reason} (Tài liệu: ${docTitle}${commentContent})`,
                date: new Date(v.createdAt).toLocaleDateString("vi-VN"),
                status: "Đã xử lý",
              };
            } else {
              const r = item;
              return {
                id: r.id,
                type: translateRestrictionType(r.type),
                description: r.reason || "N/A",
                date: new Date(r.startAt).toLocaleDateString("vi-VN"),
                status:
                  r.status === "ACTIVE"
                    ? "Đang áp dụng"
                    : r.status === "EXPIRED"
                    ? "Đã hết hạn"
                    : "Đã hủy",
              };
            }
          })}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Modal>
    </>
  );
};

export default UserViolationHistory;
