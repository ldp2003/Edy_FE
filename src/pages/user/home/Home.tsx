import { useEffect, useState, useContext } from "react";
import DocumentGrid from "../../../components/user/document/documentList/DocumentGrid";
import SubjectGrid from "../../../components/user/subject/SubjectGrid";
import { DocumentService } from "../../../utils/DocumentService";
import SubjectService from "../../../utils/SubjectService";
import { UserContext } from "../../../contexts/UserContext";
import type { Document } from "../../../models/document";
import type { Subject } from "../../../models/subject";
import { message } from "antd";

export default function HomePage() {
  const [featuredDocuments, setFeaturedDocuments] = useState<Document[]>([]);
  const [newestDocuments, setNewestDocuments] = useState<Document[]>([]);
  const [relatedDocuments, setRelatedDocuments] = useState<Document[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { user, readHistory } = useContext(UserContext);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);

        // Fetch newest documents (for "Tài liệu mới nhất")
        const newestResponse = await DocumentService.fetchNewestDocuments({
          ordering: "createdAt",
          order: -1,
          limit: 5,
        });
        setNewestDocuments(newestResponse.documents || []);

        // Fetch featured documents (documents with highest views)
        const featuredResponse = await DocumentService.fetchNewestDocuments({
          ordering: "view",
          order: -1,
          limit: 5,
        });
        setFeaturedDocuments(featuredResponse.documents || []);

        // Fetch related documents (random selection)
        const relatedResponse = await DocumentService.fetchNewestDocuments({
          ordering: "download_count",
          order: -1,
          limit: 5,
        });
        setRelatedDocuments(relatedResponse.documents || []);

        // Fetch subjects by user's organization
        if (user?.organization) {
          const organizationId =
            typeof user.organization === "string"
              ? user.organization
              : user.organization._id;

          if (organizationId) {
            const subjectsResponse =
              await SubjectService.getSubjectsByOrganization(organizationId);
            setSubjects(subjectsResponse.slice(0, 8) || []); // Limit to 8 subjects
          }
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        messageApi.error("Không thể tải danh sách tài liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [messageApi, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {contextHolder}
      <div className="flex">
        <main className="flex-1 px-4 py-4 md:p-6 lg:max-w-full w-screen space-y-6">
          {subjects && subjects.length > 0 && (
            <SubjectGrid
              title={`Các môn học của ${
                typeof user?.organization === "object" && user?.organization?.name
                  ? user.organization.name
                  : "tổ chức"
              }`}
              subjects={subjects}
            />
          )}
          {readHistory && readHistory.length > 0 && (
            // hiện tối đa 5 tài liệu gần đây
            <DocumentGrid
              title="Đã xem gần đây"
              documents={readHistory.slice(0, 10).map((item) => item.document)}
            />
          )}
          <DocumentGrid
            title="Tài liệu nổi bật"
            documents={featuredDocuments}
          />
          <DocumentGrid title="Tài liệu mới nhất" documents={newestDocuments} />

          <DocumentGrid
            title="Tài liệu bạn có thể quan tâm"
            documents={relatedDocuments}
          />
        </main>
      </div>
    </div>
  );
}
