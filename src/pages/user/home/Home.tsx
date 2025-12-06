import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DocumentGrid from "../../../components/user/document/documentList/DocumentGrid";
import SubjectGrid from "../../../components/user/subject/SubjectGrid";
import { DocumentService } from "../../../utils/DocumentService";
import SubjectService from "../../../utils/SubjectService";
import { UserContext } from "../../../contexts/UserContext";
import type { Document } from "../../../models/document";
import type { Subject } from "../../../models/subject";
import { message } from "antd";
import LoadingScreen from "../../../components/common/LoadingScreen";

export default function HomePage() {
  const [featuredDocuments, setFeaturedDocuments] = useState<Document[]>([]);
  const [newestDocuments, setNewestDocuments] = useState<Document[]>([]);
  const [relatedDocuments, setRelatedDocuments] = useState<Document[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [loadingNewest, setLoadingNewest] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { user, readHistory } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);

        // Fetch newest documents (for "Tài liệu mới nhất")
        setLoadingNewest(true);
        const newestResponse = await DocumentService.fetchNewestDocuments({
          order: -1,
          limit: 6,
        });
        setNewestDocuments(newestResponse.documents || []);
        setLoadingNewest(false);

        // Fetch featured documents (documents with highest views)
        setLoadingFeatured(true);
        const featuredResponse = await DocumentService.fetchFeaturedDocuments({
          limit: 6,
        });
        setFeaturedDocuments(featuredResponse.documents || []);
        setLoadingFeatured(false);

        // Fetch related documents (random selection)
        setLoadingRelated(true);
        const relatedResponse = await DocumentService.fetchRecommendedDocuments(
          {
            limit: 6,
          }
        );
        setRelatedDocuments(relatedResponse.documents || []);
        setLoadingRelated(false);

        // Fetch subjects by user's organization
        if (user?.organization) {
          setLoadingSubjects(true);
          const organizationId =
            typeof user.organization === "string"
              ? user.organization
              : user.organization._id;

          if (organizationId) {
            const subjectsResponse =
              await SubjectService.getSubjectsByOrganization(organizationId);
            setSubjects(subjectsResponse.slice(0, 8) || []); // Limit to 8 subjects
          }
          setLoadingSubjects(false);
        }
      } catch {
        // Suppress errors for new accounts
        setLoadingNewest(false);
        setLoadingFeatured(false);
        setLoadingRelated(false);
        setLoadingSubjects(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [messageApi, user]);

  // Handler functions for "View More" buttons
  const handleViewMoreFeatured = async () => {
    try {
      const featuredResponse = await DocumentService.fetchFeaturedDocuments({
        limit: 50, // Fetch more documents for the list page
      });
      navigate("/documents", {
        state: {
          documents: featuredResponse.documents || [],
          title: "Tài liệu nổi bật",
          type: "featured",
        },
      });
    } catch (error) {
      console.error("Error fetching featured documents:", error);
      // Fallback to current documents
      navigate("/documents", {
        state: {
          documents: featuredDocuments,
          title: "Tài liệu nổi bật",
          type: "featured",
        },
      });
    }
  };

  const handleViewMoreNewest = async () => {
    try {
      const newestResponse = await DocumentService.fetchNewestDocuments({
        order: -1,
        limit: 50, // Fetch more documents for the list page
      });
      navigate("/documents", {
        state: {
          documents: newestResponse.documents || [],
          title: "Tài liệu mới nhất",
          type: "newest",
        },
      });
    } catch (error) {
      console.error("Error fetching newest documents:", error);
      // Fallback to current documents
      navigate("/documents", {
        state: {
          documents: newestDocuments,
          title: "Tài liệu mới nhất",
          type: "newest",
        },
      });
    }
  };

  const handleViewMoreRelated = async () => {
    try {
      const relatedResponse = await DocumentService.fetchRecommendedDocuments({
        limit: 50,
      });
      navigate("/documents", {
        state: {
          documents: relatedResponse.documents || [],
          title: "Tài liệu bạn có thể quan tâm",
          type: "related",
        },
      });
    } catch (error) {
      console.error("Error fetching related documents:", error);
      // Fallback to current documents
      navigate("/documents", {
        state: {
          documents: relatedDocuments,
          title: "Tài liệu bạn có thể quan tâm",
          type: "related",
        },
      });
    }
  };

  const handleViewMoreRecent = () => {
    const recentDocs = readHistory.slice(0, 10).map((item) => item.document);
    navigate("/history", {
      state: {
        documents: recentDocs,
        title: "Đã xem gần đây",
        type: "recent",
      },
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      {contextHolder}
      <div className="flex">
        <main className="flex-1 px-4 py-4 md:p-6 lg:max-w-full w-screen space-y-6">
          {subjects && subjects.length > 0 && (
            <SubjectGrid
              title={`Các môn học của ${
                typeof user?.organization === "object" &&
                user?.organization?.name
                  ? user.organization.name
                  : "tổ chức"
              }`}
              subjects={subjects}
              loading={loadingSubjects}
            />
          )}
          {readHistory && readHistory.length > 0 && (
            // hiện tối đa 5 tài liệu gần đây
            <DocumentGrid
              title="Đã xem gần đây"
              documents={readHistory.slice(0, 10).map((item) => item.document)}
              onViewMore={handleViewMoreRecent}
            />
          )}
          <DocumentGrid
            title="Tài liệu nổi bật"
            documents={featuredDocuments}
            onViewMore={handleViewMoreFeatured}
            loading={loadingFeatured}
          />
          <DocumentGrid
            title="Tài liệu mới nhất"
            documents={newestDocuments}
            onViewMore={handleViewMoreNewest}
            loading={loadingNewest}
          />

          <DocumentGrid
            title="Tài liệu bạn có thể quan tâm"
            documents={relatedDocuments}
            onViewMore={handleViewMoreRelated}
            loading={loadingRelated}
          />
        </main>
      </div>
    </div>
  );
}
