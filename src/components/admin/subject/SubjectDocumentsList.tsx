import React, { useState, useEffect, useCallback } from "react";
import { Card, Spin, message, Empty, Pagination } from "antd";
import SubjectService from "../../../utils/SubjectService";
import DocumentCard from "../../user/document/documentCard/DocumentCard";
import type { Document } from "../../../models/document";

interface SubjectDocumentsListProps {
  subjectId: string;
  subjectName: string;
}

const SubjectDocumentsList: React.FC<SubjectDocumentsListProps> = ({
  subjectId,
  subjectName,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [pageSize] = useState(12);
  const [messageApi, contextHolder] = message.useMessage();

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await SubjectService.getDocumentsBySubject(subjectId);

      // Assuming the response has documents array and pagination info
      if (response && Array.isArray(response)) {
        setDocuments(response);
        setTotalDocuments(response.length);
      } else if (
        response &&
        typeof response === "object" &&
        "documents" in response
      ) {
        const resp = response as { documents: Document[]; total?: number };
        setDocuments(resp.documents);
        setTotalDocuments(resp.total || resp.documents.length);
      } else {
        setDocuments([]);
        setTotalDocuments(0);
      }
    } catch (error) {
      console.error("Error loading subject documents:", error);
      messageApi.error("Không thể tải danh sách tài liệu");
      setDocuments([]);
      setTotalDocuments(0);
    } finally {
      setLoading(false);
    }
  }, [subjectId, messageApi]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Card title={`Tài liệu môn ${subjectName}`}>
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <>
      {contextHolder}
      <Card
        title={`Tài liệu môn ${subjectName}`}
        extra={
          <span className="text-sm text-[var(--secondary-text-color)]">
            Tổng cộng: {totalDocuments} tài liệu
          </span>
        }
      >
        {documents.length === 0 ? (
          <Empty
            description="Chưa có tài liệu nào cho môn học này"
            className="py-12"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {documents.map((document) => (
                <DocumentCard key={document._id} document={document} />
              ))}
            </div>

            {totalDocuments > pageSize && (
              <div className="flex justify-center">
                <Pagination
                  current={currentPage}
                  total={totalDocuments}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} tài liệu`
                  }
                />
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default SubjectDocumentsList;
