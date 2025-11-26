import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SubjectService from "../../../utils/SubjectService";
import type { Subject } from "../../../models/subject";
import type { Organization } from "../../../models/user";
import SubjectDocumentsList from "../../../components/admin/subject/SubjectDocumentsList";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const loadSubjectDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Load subject details
      const subjectData = await SubjectService.getSubjectById(id);
      setSubject(subjectData);

      // Load organization details if subject has organization
      if (
        subjectData.organization &&
        typeof subjectData.organization === "object"
      ) {
        setOrganization(subjectData.organization);
      }
    } catch (error) {
      console.error("Error loading subject detail:", error);
      messageApi.error("Không thể tải thông tin môn học");
    } finally {
      setLoading(false);
    }
  }, [id, messageApi]);

  useEffect(() => {
    loadSubjectDetail();
  }, [loadSubjectDetail]);

  const handleBack = () => {
    navigate("/admin/subjects");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--secondary-text-color)]">
          Không tìm thấy môn học
        </p>
        <Button onClick={handleBack} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div>
      {contextHolder}

      <AdminBreadcrumb
        items={[
          { label: "Admin", path: "/admin" },
          { label: "Quản lý nội dung", path: "/admin/subjects" },
          { label: "Môn học", path: "/admin/subjects" },
          { label: subject.name },
        ]}
      />

      <div className="mt-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-start mb-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                color: "white",
              }}
            >
              Quay lại danh sách môn học
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[color:var(--border-color)]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[var(--primary-text-color)]">
                {subject.name}
              </h1>
              <div className="text-sm text-[var(--secondary-text-color)] bg-gray-100 px-3 py-1 rounded">
                Mã: {subject.code}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded border border-[color:var(--border-color)]">
                <div className="text-sm font-medium text-[var(--secondary-text-color)] mb-1">
                  Số tài liệu
                </div>
                <div className="text-sm font-bold text-[var(--primary-text-color)]">
                  {subject.doc_count || 0}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-[color:var(--border-color)]">
                <div className="text-sm font-medium text-[var(--secondary-text-color)] mb-1">
                  Tổ chức
                </div>
                <div className="text-sm font-semibold text-[var(--primary-text-color)]">
                  {organization?.name || "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-[color:var(--border-color)]">
                <div className="text-sm font-medium text-[var(--secondary-text-color)] mb-1">
                  Ngày tạo
                </div>
                <div className="text-sm font-medium text-[var(--primary-text-color)]">
                  {new Date(subject.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-[color:var(--border-color)]">
                <div className="text-sm font-medium text-[var(--secondary-text-color)] mb-1">
                  Trạng thái
                </div>
                <div className="text-sm font-semibold text-green-600">
                  Hoạt động
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-[color:var(--border-color)]">
                <div className="text-sm font-medium text-[var(--secondary-text-color)] mb-1">
                  Người tạo
                </div>
                <div className="text-sm font-medium text-[var(--primary-text-color)]">
                  {subject.created_by
                    ? `${subject.created_by.first_name} ${subject.created_by.last_name}`
                    : "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-[color:var(--border-color)]">
                <div className="text-sm font-medium text-[var(--secondary-text-color)] mb-1">
                  Cập nhật lần cuối
                </div>
                <div className="text-sm font-medium text-[var(--primary-text-color)]">
                  {new Date(subject.updatedAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>

            {subject.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-[color:var(--border-color)]">
                <h3 className="text-lg font-semibold text-[var(--primary-text-color)] mb-2">
                  Mô tả môn học
                </h3>
                <p className="text-[var(--third-text-color)] leading-relaxed">
                  {subject.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documents List */}
        <SubjectDocumentsList subjectId={id!} subjectName={subject.name} />
      </div>
    </div>
  );
};

export default SubjectDetailPage;
