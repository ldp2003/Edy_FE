import React from "react";
import { Card, Descriptions, Tag } from "antd";
import type { User } from "../../../models/user";

interface UserDetailInfoProps {
  user: User;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  formatDate: (dateString?: string) => string;
}

const UserDetailInfo: React.FC<UserDetailInfoProps> = ({
  user,
  getStatusColor,
  getStatusText,
  formatDate,
}) => {
  return (
    <Card title="Thông tin chi tiết">
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="ID người dùng" span={2}>
          {user._id}
        </Descriptions.Item>

        <Descriptions.Item label="Họ và tên" span={2}>
          {user.first_name} {user.last_name}
        </Descriptions.Item>

        <Descriptions.Item label="Email" span={2}>
          {user.contact_email}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <Tag color={getStatusColor(user.status)}>
            {getStatusText(user.status)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Cảnh cáo">
          {user.strike || 0}
        </Descriptions.Item>

        <Descriptions.Item label="Tổ chức" span={2}>
          {typeof user.organization === "object" && user.organization
            ? user.organization.name
            : "Chưa có tổ chức"}
        </Descriptions.Item>

        <Descriptions.Item label="Lĩnh vực nghiên cứu" span={2}>
          {user.field_of_study && user.field_of_study.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {user.field_of_study.map((field, index) => (
                <Tag key={index} color="blue" className="mb-1">
                  {field}
                </Tag>
              ))}
            </div>
          ) : (
            "Chưa có"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Số tài liệu">
          {user.doc_count || 0}
        </Descriptions.Item>

        <Descriptions.Item label="Điểm tích lũy">
          {user.point || 0}
        </Descriptions.Item>

        <Descriptions.Item label="Điểm xếp hạng">
          {user.rank_point || 0}
        </Descriptions.Item>

        <Descriptions.Item label="Lượt tải miễn phí">
          {user.free_download_count || 0}
        </Descriptions.Item>

        <Descriptions.Item label="Người theo dõi">
          {user.follower?.length || 0}
        </Descriptions.Item>

        <Descriptions.Item label="Đang theo dõi">
          {user.following?.length || 0}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {formatDate(user.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Cập nhật cuối">
          {formatDate(user.updatedAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Thay đổi tổ chức cuối" span={2}>
          {formatDate(user.last_organization_change)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserDetailInfo;
