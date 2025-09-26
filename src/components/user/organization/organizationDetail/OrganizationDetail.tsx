import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { OrganizationService } from "../../../../utils/OrganizationService";
import SubjectService from "../../../../utils/SubjectService";
import { DocumentService } from "../../../../utils/DocumentService";
import OrganizationGrid from "../organizationGrid/OrganizationGrid";
import OrganizationHeader from "./components/OrganizationHeader";
import OrganizationSubjects from "./components/OrganizationSubjects";
import OrganizationDocuments from "./components/OrganizationDocuments";
import OrganizationStats from "./components/OrganizationStats";
import OrganizationInfo from "./components/OrganizationInfo";
import type { OrganizationDetailed } from "../../../../models/organization";
import type { Subject } from "../../../../models/subject";
import type { Document } from "../../../../models/document";

const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [organization, setOrganization] = useState<OrganizationDetailed | null>(
    null
  );
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [otherOrganizations, setOtherOrganizations] = useState<
    OrganizationDetailed[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Pagination for subjects
  const [subjectPage, setSubjectPage] = useState(1);
  const subjectsPerPage = 4;

  // Display limited documents
  const [displayedCount, setDisplayedCount] = useState(12);
  const displayedDocuments = documents.slice(0, displayedCount);

  // Thống kê
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalDocuments: 0,
    totalViews: 0,
  });

  const fetchOrganizationData = useCallback(
    async (organizationId: string) => {
      try {
        setLoading(true);

        // Lấy danh sách tổ chức và tìm tổ chức phù hợp
        const orgsResponse = await OrganizationService.getOrganizations();
        const foundOrg = orgsResponse.find((org) => org._id === organizationId);

        if (!foundOrg) {
          throw new Error("Organization not found");
        }

        setOrganization(foundOrg);

        // Lấy danh sách tổ chức khác (loại bỏ tổ chức hiện tại)
        const otherOrgs = orgsResponse.filter(
          (org) => org._id !== organizationId
        );
        setOtherOrganizations(otherOrgs);

        // Lấy danh sách môn học của tổ chức
        const subjectsResponse = await SubjectService.getSubjectsByOrganization(
          organizationId
        );
        setSubjects(subjectsResponse || []);

        // Lấy danh sách tài liệu từ DocumentService
        const documentsResponse = await DocumentService.fetchNewestDocuments({
          organization: organizationId,
          limit: 50,
        });
        setDocuments(documentsResponse.documents || []);

        // Cập nhật thống kê
        setStats({
          totalSubjects: subjectsResponse?.length || 0,
          totalDocuments: documentsResponse.documents?.length || 0,
          totalViews:
            documentsResponse.documents?.reduce(
              (total: number, doc: Document) => total + (doc.view || 0),
              0
            ) || 0,
        });
      } catch (error) {
        console.error("Error fetching organization data:", error);
        messageApi.error("Không thể tải thông tin tổ chức!");
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  useEffect(() => {
    if (!id) {
      messageApi.error("ID tổ chức không hợp lệ!");
      navigate("/");
      return;
    }
    fetchOrganizationData(id);
  }, [id, messageApi, navigate, fetchOrganizationData]);

  const handleSubjectClick = (subject: Subject) => {
    navigate(`/subject/${subject._id}`);
  };

  const handleLoadMoreDocuments = () => {
    setDisplayedCount((prev) => Math.min(prev + 12, documents.length));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">
          Không tìm thấy thông tin tổ chức
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--secondary-background-color)]">
      {contextHolder}
      <div className="container text-left mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Organization Header */}
            <OrganizationHeader organization={organization} />

            {/* Subjects Section */}
            <OrganizationSubjects
              subjects={subjects}
              totalSubjects={stats.totalSubjects}
              subjectPage={subjectPage}
              subjectsPerPage={subjectsPerPage}
              onPageChange={setSubjectPage}
              onSubjectClick={handleSubjectClick}
            />

            {/* Documents Section */}
            <OrganizationDocuments
              documents={documents}
              displayedDocuments={displayedDocuments}
              displayedCount={displayedCount}
              totalDocuments={stats.totalDocuments}
              onLoadMore={handleLoadMoreDocuments}
            />

            {/* Other Organizations Section */}
            {otherOrganizations.length > 0 && (
              <OrganizationGrid
                title="Các tổ chức/trường học khác"
                organizations={otherOrganizations.slice(0, 8)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80">
            {/* Statistics */}
            <OrganizationStats
              totalDocuments={stats.totalDocuments}
              documents={documents}
            />

            {/* Organization Info */}
            <OrganizationInfo organization={organization} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
