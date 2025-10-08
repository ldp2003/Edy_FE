import React, { useState, useEffect, useCallback } from "react";
import { List, Avatar, Input, Spin, Pagination } from "antd";
import { SearchOutlined, FileTextOutlined } from "@ant-design/icons";
import { DocumentService } from "../../../../utils/DocumentService";
import type { Document } from "../../../../models/document";

const { Search } = Input;

interface DocumentListProps {
  onSelectDocument: (document: Document) => void;
  selectedDocumentId?: string;
  doc_id?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  onSelectDocument,
  selectedDocumentId,
  doc_id,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [displayLimit, setDisplayLimit] = useState(10);
  const pageSize = 10;
  const initialLimit = 10;

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      if (searchText && searchText.trim()) {
        // Nếu có tìm kiếm, sử dụng getAllDocuments
        response = await DocumentService.getAllDocuments({
          search: searchText,
          page: currentPage,
          limit: pageSize,
          ordering: "createdAt",
          order: -1,
        });
      } else {
        // Nếu không có tìm kiếm, sử dụng getSimilarDocuments
        response = await DocumentService.getSimilarDocuments(doc_id || "");
      }

      setDocuments(response.documents || []);
      setTotal(response.total || response.totalCount || 0);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchText, doc_id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    setDisplayLimit(initialLimit);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const getDocumentTypeColor = (docType: string) => {
    const colors = {
      TEXTBOOK: "#1890ff",
      REFERENCE: "#52c41a",
      THESIS: "#722ed1",
      RESEARCH_PAPER: "#fa541c",
      REPORT: "#13c2c2",
      OTHER: "#8c8c8c",
    };
    return colors[docType as keyof typeof colors] || colors.OTHER;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Logic để xác định có nên sử dụng pagination hay load more
  const useLoadMore = !searchText || searchText.trim() === "";
  const displayedDocuments = useLoadMore
    ? documents.slice(0, displayLimit)
    : documents;
 
  return (
    <div className="flex flex-col h-full text-left">
      {/* Search */}
      <div className="p-4 border-b flex-shrink-0">
        <Search
          placeholder="Tìm kiếm tài liệu..."
          prefix={<SearchOutlined />}
          onSearch={handleSearch}
          allowClear
        />
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-auto pl-2 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <List
            dataSource={displayedDocuments}
            renderItem={(document) => (
              <List.Item
                key={document._id}
                className={`cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                  selectedDocumentId === document._id
                    ? "bg-blue-50 border-l-blue-500"
                    : "border-l-transparent"
                }`}
                onClick={() => onSelectDocument(document)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<FileTextOutlined />}
                      style={{
                        backgroundColor: getDocumentTypeColor(
                          document.doc_type || "OTHER"
                        ),
                      }}
                    />
                  }
                  title={
                    <div className="pr-4">
                      <div className="font-medium text-gray-900 line-clamp-2">
                        {document.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {document.doc_type} • {formatDate(document.createdAt)}
                      </div>
                    </div>
                  }
                  description={
                    <div className="pr-4">
                      <div className="text-sm text-gray-600 line-clamp-1">
                        Tác giả: {document.author?.join(", ") || "Không có"}
                      </div>
                      {document.subject && (
                        <div className="text-xs text-gray-500 mt-1">
                          Môn học: {document.subject.name}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: "Không có tài liệu nào" }}
          />
        )}
      </div>

      {/* Pagination - chỉ hiển thị khi có tìm kiếm */}
      {!useLoadMore && total > pageSize && (
        <div className="p-4  border-t flex-shrink-0">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            size="small"
            showSizeChanger={false}
            showTotal={(total, range) =>
              <span style={{ fontSize: '11px' }}>
                {`${range[0]}-${range[1]} của ${total} tài liệu`}
              </span>
            }
          />
        </div>
      )}
    </div>
  );
};

export default DocumentList;
