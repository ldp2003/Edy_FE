import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Table, Button, Card, Avatar, Tag } from "antd";
import {
  ArrowLeftOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { OrganizationService } from "../../../utils/OrganizationService";
import type { OrganizationDetailed } from "../../../models/organization";
import type { ColumnsType } from "antd/es/table";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";
import AdminSubjectCard from "../../../components/admin/subject/AdminSubjectCard";

const OrganizationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<OrganizationDetailed | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const loadOrganization = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const org = await OrganizationService.getOrganizationById(id);
      setOrganization(org);
      console.log("Loaded organization:", org);
    } catch (error) {
      console.error("Error loading organization:", error);
      messageApi.error("Không thể tải thông tin tổ chức");
    } finally {
      setLoading(false);
    }
  }, [id, messageApi]);

  useEffect(() => {
    loadOrganization();
  }, [loadOrganization]);

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/detail/${userId}`);
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/admin/subjects/${subjectId}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userColumns: ColumnsType<any> = [
    {
      title: "Avatar",
      key: "avatar",
      className: "text-left text-base sm:text-sm xs:text-xs",
      render: (_, record) => (
        <Avatar src={record.avatar} icon={<UserOutlined />} size="small" />
      ),
    },
    {
      title: "Tên",
      key: "name",
      className: "text-left text-base sm:text-sm xs:text-xs",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleUserClick(record._id)}
          className="text-left text-base sm:text-sm xs:text-xs p-0 h-auto"
        >
          {record.first_name} {record.last_name}
        </Button>
      ),
    },
    {
      title: "Điểm xếp hạng",
      dataIndex: "rank_point",
      key: "rank_point",
      className: "text-left text-base sm:text-sm xs:text-xs",
      sorter: (a, b) => a.rank_point - b.rank_point,
    },
    {
      title: "Số tài liệu",
      dataIndex: "doc_count",
      key: "doc_count",
      className: "text-left text-base sm:text-sm xs:text-xs",
      sorter: (a, b) => a.doc_count - b.doc_count,
    },
    {
      title: "VIP",
      dataIndex: "is_vip",
      key: "is_vip",
      className: "text-left text-base sm:text-sm xs:text-xs",
      render: (is_vip: boolean) => (
        <Tag color={is_vip ? "gold" : "default"}>
          {is_vip ? "VIP" : "Thường"}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!organization) {
    return <div className="text-center py-8">Không tìm thấy tổ chức</div>;
  }

  return (
    <div>
      {contextHolder}
      <AdminBreadcrumb
        items={[
          { label: "Admin", path: "/admin" },
          { label: "Quản lý người dùng", path: "/admin/organizations" },
          { label: "Tổ chức", path: "/admin/organizations" },
          { label: organization.name },
        ]}
      />
      <div className="mt-4">
        <div className="mb-4">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/organizations")}
            className="mb-4 text-base sm:text-sm xs:text-xs"
          >
            Quay lại danh sách
          </Button>
          <h1 className="text-xl sm:text-lg xs:text-base font-bold text-[var(--primary-text-color)] mb-4 text-left">
            {organization.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card title="Thông tin cơ bản" className="shadow-sm">
            <div className="space-y-3 text-left">
              <div>
                <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                  Mã tổ chức:
                </strong>
                <p className="text-left text-base sm:text-sm xs:text-xs">
                  {organization.code}
                </p>
              </div>
              <div>
                <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                  Quốc gia:
                </strong>
                <p className="text-left text-base sm:text-sm xs:text-xs">
                  {organization.country}
                </p>
              </div>
              <div>
                <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                  Địa chỉ:
                </strong>
                <p className="text-left text-base sm:text-sm xs:text-xs flex items-start gap-2">
                  <EnvironmentOutlined className="mt-1" />
                  {organization.address}
                </p>
              </div>
              {organization.website && (
                <div>
                  <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                    Website:
                  </strong>
                  <p className="text-left text-base sm:text-sm xs:text-xs">
                    <a
                      href={
                        organization.website.startsWith("http")
                          ? organization.website
                          : `https://${organization.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--link-color)] hover:underline flex items-center gap-2"
                    >
                      <GlobalOutlined />
                      {organization.website}
                    </a>
                  </p>
                </div>
              )}
              {organization.created_by && (
                <div>
                  <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                    Người tạo:
                  </strong>
                  <p className="text-left text-base sm:text-sm xs:text-xs">
                    {organization.created_by.first_name}{" "}
                    {organization.created_by.last_name}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Thống kê" className="shadow-sm">
            <div className="space-y-3 text-left">
              <div>
                <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                  Số người dùng:
                </strong>
                <p className="text-left text-base sm:text-sm xs:text-xs">
                  {organization.user_count}
                </p>
              </div>
              <div>
                <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                  Số môn học:
                </strong>
                <p className="text-left text-base sm:text-sm xs:text-xs">
                  {organization.subjects?.length || 0}
                </p>
              </div>
              <div>
                <strong className="text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                  Danh mục nội dung:
                </strong>
                <p className="text-left text-base sm:text-sm xs:text-xs">
                  {organization.content_categories?.length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {organization.subjects && organization.subjects.length > 0 && (
          <Card title="Môn học" className="mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {organization.subjects.map((subject, index) => (
                <AdminSubjectCard
                  key={index}
                  subject={subject}
                  onClick={handleSubjectClick}
                />
              ))}
            </div>
          </Card>
        )}

        {organization.content_categories &&
          organization.content_categories.length > 0 && (
            <Card title="Danh mục nội dung" className="mb-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {organization.content_categories.map((category, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[var(--card-background-color)] rounded-md"
                  >
                    <h4 className="font-medium text-[var(--primary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                      {category.doc_type}
                    </h4>
                    <p className="text-[var(--secondary-text-color)] text-left text-base sm:text-sm xs:text-xs">
                      {category.document_count} tài liệu
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

        {organization.users && organization.users.length > 0 && (
          <Card title="Người dùng" className="shadow-sm">
            <Table
              columns={userColumns}
              dataSource={organization.users}
              rowKey="_id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} người dùng`,
              }}
              className="min-w-full"
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetailPage;
