import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import DocumentViewer from "../../../components/admin/document/compare/DocumentViewer";
import DocumentListPanel from "../../../components/admin/document/compare/DocumentListPanel";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const DocumentComparePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [compareDocument, setCompareDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        message.error("ID tài liệu không hợp lệ!");
        navigate("/admin/documents/all");
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);
        setSelectedDocument(documentData);
      } catch (error) {
        console.error("Error fetching document:", error);
        message.error("Không thể tải thông tin tài liệu!");
        navigate("/admin/documents/all");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, navigate]);

  const handleSelectDocument = (document: Document) => {
    setCompareDocument(document);
  };

  const handleBackToReview = () => {
    navigate(`/admin/documents/review/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!selectedDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Không tìm thấy tài liệu
          </h2>
          <p className="text-gray-500">
            Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--secondary-background-color)] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm flex-shrink-0">
        <div className="px-2 py-2">
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Quản lý nội dung", path: "/admin/documents/all" },
              { label: "Tài liệu", path: "/admin/documents/all" },
              { label: "So sánh tài liệu" },
            ]}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={handleBackToReview}
                className="flex items-center"
              >
                Quay lại
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-base font-semibold text-[var(--primary-text-color)]">
                So sánh tài liệu trùng lặp
              </h1>
            </div>

            {/* Confirm Duplicate Button */}
            {compareDocument && (
              <button
                onClick={() => {
                  const duplicateInfo = {
                    duplicateId: compareDocument._id,
                    duplicateTitle: compareDocument.title,
                  };
                  navigate(`/admin/documents/review/${id}`, {
                    state: { duplicateDocument: duplicateInfo },
                  });
                }}
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-medium px-2 py-1 rounded-md shadow-sm transition-all duration-200 hover:shadow-md border border-orange-500 hover:border-orange-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95"
              >
                Xác nhận trùng lặp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 h-full">
          {/* Left Panel */}
          <div className="col-span-1 xl:col-span-2 min-h-0 flex flex-col">
            <DocumentViewer
              document={selectedDocument}
              title="Tài liệu được chọn"
            />
          </div>

          {/* Middle Panel */}
          <div className="col-span-1 xl:col-span-2 min-h-0 flex flex-col">
            <DocumentViewer
              document={compareDocument}
              title="Tài liệu so sánh"
              subtitle="Vui lòng chọn tài liệu từ danh sách bên phải"
            />
          </div>

          {/* Right Panel */}
          <div className="col-span-1 min-h-0 flex flex-col">
            <DocumentListPanel
              onSelectDocument={handleSelectDocument}
              selectedDocumentId={compareDocument?._id}
              doc_id={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComparePage;
