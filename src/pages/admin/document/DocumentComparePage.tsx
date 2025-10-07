import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import DocumentList from "../../../components/admin/document/compare/DocumentList";
import SecurePdfViewer from "../../../components/admin/document/compare/SecurePdfViewer";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="text"
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 h-screen">
          {/* Left Panel - Selected Document Viewer */}
          <div className="col-span-1 xl:col-span-2 bg-white shadow-sm overflow-hidden">
            <div className="p-2 border-b bg-gray-50">
              <h2 className="text-base font-medium text-[var(--primary-text-color)]">
                Tài liệu được chọn
              </h2>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {selectedDocument.title}
              </p>
            </div>
            <div className="flex-1 overflow-hidden h-screen xl:h-full">
              {selectedDocument.url ? (
                selectedDocument.file_type === "PDF" ? (
                  <SecurePdfViewer url={selectedDocument.url} />
                ) : selectedDocument.file_type === "WORD" ? (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      selectedDocument.url
                    )}&embedded=true`}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Selected Document Viewer"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center p-4">
                      <p className="text-gray-600 mb-4">
                        Không thể xem trước file này
                      </p>
                      <Button
                        type="primary"
                        onClick={() =>
                          window.open(selectedDocument.url, "_blank")
                        }
                      >
                        Mở file trong tab mới
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <p className="text-gray-600">Không có file để hiển thị</p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Panel - Compare Document Viewer */}
          <div className="col-span-1 xl:col-span-2 bg-white shadow-sm overflow-hidden">z
            <div className="p-2 border-b bg-gray-50">
              <h2 className="text-base font-medium text-[var(--primary-text-color)]">
                Tài liệu so sánh
              </h2>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {compareDocument
                  ? compareDocument.title
                  : "Chưa chọn tài liệu để so sánh"}
              </p>
            </div>
            <div className="flex-1 overflow-hidden h-screen xl:h-full">
              {compareDocument ? (
                compareDocument.url ? (
                  compareDocument.file_type === "PDF" ? (
                    <SecurePdfViewer url={compareDocument.url} />
                  ) : compareDocument.file_type === "WORD" ? (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                        compareDocument.url
                      )}&embedded=true`}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                      title="Compare Document Viewer"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center p-4">
                        <p className="text-gray-600 mb-4">
                          Không thể xem trước file này
                        </p>
                        <Button
                          type="primary"
                          onClick={() =>
                            window.open(compareDocument.url, "_blank")
                          }
                        >
                          Mở file trong tab mới
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <p className="text-gray-600">Không có file để hiển thị</p>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p>Vui lòng chọn tài liệu từ danh sách bên phải</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Document List */}
          <div className="col-span-1 bg-white shadow-sm overflow-hidden">
            <div className="p-2 border-b bg-gray-50">
              <h2 className="text-base font-medium text-[var(--primary-text-color)]">
                Danh sách tài liệu
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Chọn tài liệu để so sánh
              </p>
            </div>
            <DocumentList
              onSelectDocument={handleSelectDocument}
              selectedDocumentId={compareDocument?._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComparePage;
