import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [otherOrganizations, setOtherOrganizations] = useState<
    OrganizationDetailed[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [subjectPage, setSubjectPage] = useState(1);
  const [myDocsDisplayedCount, setMyDocsDisplayedCount] = useState(4);
  const [recentDocsDisplayedCount, setRecentDocsDisplayedCount] = useState(4);

  // Collapse states
  const [isMyDocsCollapsed, setIsMyDocsCollapsed] = useState(false);
  const [isRecentDocsCollapsed, setIsRecentDocsCollapsed] = useState(false);

  // Constants
  const subjectsPerPage = 4;

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

        // Fetch data parallel để cải thiện performance
        const [documentsResponse, recentDocsResponse] = await Promise.all([
          DocumentService.getMyDocuments({
            organization: organizationId,
            limit: 50,
          }),
          DocumentService.fetchNewestDocuments({
            organization: organizationId,
            limit: 50,
          }),
        ]);

        setDocuments(documentsResponse.documents || []);
        setRecentDocuments(recentDocsResponse.documents || []);
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

  // Memoized computed values
  const displayedMyDocuments = useMemo(
    () => documents.slice(0, isMyDocsCollapsed ? 4 : myDocsDisplayedCount),
    [documents, myDocsDisplayedCount, isMyDocsCollapsed]
  );

  const displayedRecentDocuments = useMemo(
    () =>
      recentDocuments.slice(
        0,
        isRecentDocsCollapsed ? 5 : recentDocsDisplayedCount
      ),
    [recentDocuments, recentDocsDisplayedCount, isRecentDocsCollapsed]
  );

  const totalDocumentsFromCategories = useMemo(
    () =>
      organization?.content_categories?.reduce(
        (total, category) => total + (category.document_count || 0),
        0
      ) || 0,
    [organization?.content_categories]
  );

  // Optimized handlers
  const handleSubjectClick = useCallback(
    (subject: Subject) => {
      navigate(`/subject/${subject._id}/documents`);
    },
    [navigate]
  );

  const handleLoadMoreMyDocuments = useCallback(() => {
    setMyDocsDisplayedCount((prev) => Math.min(prev + 12, documents.length));
  }, [documents.length]);

  const handleLoadMoreRecentDocuments = useCallback(() => {
    setRecentDocsDisplayedCount((prev) =>
      Math.min(prev + 12, recentDocuments.length)
    );
  }, [recentDocuments.length]);

  const handleToggleMyDocsCollapse = useCallback(() => {
    setIsMyDocsCollapsed((prev) => {
      if (!prev) {
        // Khi thu gọn, reset count về 4
        setMyDocsDisplayedCount(4);
      }
      return !prev;
    });
  }, []);

  const handleToggleRecentDocsCollapse = useCallback(() => {
    setIsRecentDocsCollapsed((prev) => {
      if (!prev) {
        // Khi thu gọn, reset count về 4
        setRecentDocsDisplayedCount(4);
      }
      return !prev;
    });
  }, []);

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
        <h2 className="text-xl font-semibold text-gray-600 text-center md:text-left">
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
              totalSubjects={subjects.length}
              subjectPage={subjectPage}
              subjectsPerPage={subjectsPerPage}
              onPageChange={setSubjectPage}
              onSubjectClick={handleSubjectClick}
            />

            {documents.length > 0 && (
              <OrganizationDocuments
                documents={documents}
                displayedDocuments={displayedMyDocuments}
                displayedCount={myDocsDisplayedCount}
                totalDocuments={documents.length}
                onLoadMore={handleLoadMoreMyDocuments}
                title="Tài liệu của bạn"
                isCollapsed={isMyDocsCollapsed}
                onToggleCollapse={handleToggleMyDocsCollapse}
              />
            )}

            {/* Recent Documents Section */}
            <OrganizationDocuments
              documents={recentDocuments}
              displayedDocuments={displayedRecentDocuments}
              displayedCount={recentDocsDisplayedCount}
              totalDocuments={recentDocuments.length}
              onLoadMore={handleLoadMoreRecentDocuments}
              title="Tài liệu gần đây"
              isCollapsed={isRecentDocsCollapsed}
              onToggleCollapse={handleToggleRecentDocsCollapse}
            />

            {/* Other Organizations Section */}
            {otherOrganizations.length > 0 && (
              <OrganizationGrid
                organizations={otherOrganizations.slice(0, 8)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <div className="sticky top-6 space-y-6">
              {/* Statistics */}
              <OrganizationStats
                totalDocuments={totalDocumentsFromCategories}
                contentCategories={organization.content_categories || []}
              />

              {/* Organization Info */}
              <OrganizationInfo organization={organization} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
