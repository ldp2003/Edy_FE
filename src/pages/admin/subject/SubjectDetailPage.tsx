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
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mb-4"
          >
            Quay lại danh sách môn học
          </Button>

          <div className="bg-white p-6 rounded-md shadow-sm border">
            <h1 className="text-2xl font-bold text-[var(--primary-text-color)] mb-2">
              {subject.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-[var(--secondary-text-color)]">
                  Mã môn học:
                </span>
                <span className="ml-2 text-[var(--primary-text-color)]">
                  {subject.code}
                </span>
              </div>

              <div>
                <span className="font-medium text-[var(--secondary-text-color)]">
                  Tổ chức:
                </span>
                <span className="ml-2 text-[var(--primary-text-color)]">
                  {organization?.name || "N/A"}
                </span>
              </div>

              <div>
                <span className="font-medium text-[var(--secondary-text-color)]">
                  Số tài liệu:
                </span>
                <span className="ml-2 text-[var(--primary-text-color)]">
                  {subject.doc_count || 0}
                </span>
              </div>

              <div>
                <span className="font-medium text-[var(--secondary-text-color)]">
                  Ngày tạo:
                </span>
                <span className="ml-2 text-[var(--primary-text-color)]">
                  {new Date(subject.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            {subject.description && (
              <div className="mt-4">
                <span className="font-medium text-[var(--secondary-text-color)]">
                  Mô tả:
                </span>
                <p className="mt-1 text-[var(--third-text-color)]">
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
