import React, { useState, useEffect, useCallback } from "react";
import { List, Input, Spin, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DocumentService } from "../../../../utils/DocumentService";
import type { Document } from "../../../../models/document";
import CompareDocItem from "./CompareDocItem";

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
  const [checkedDocuments, setCheckedDocuments] = useState<Set<string>>(
    new Set()
  );
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

  // Local Storage functions
  const getStorageKey = useCallback(
    () => `checkedDocuments_${doc_id}`,
    [doc_id]
  );

  const saveCheckedDocuments = useCallback(
    (checkedSet: Set<string>) => {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify(Array.from(checkedSet))
      );
    },
    [getStorageKey]
  );

  const loadCheckedDocuments = useCallback((): Set<string> => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error(
        "Error loading checked documents from localStorage:",
        error
      );
    }
    return new Set();
  }, [getStorageKey]);

  // Checkbox handlers
  const handleCheckboxChange = useCallback(
    (documentId: string, checked: boolean) => {
      setCheckedDocuments((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(documentId);
        } else {
          newSet.delete(documentId);
        }
        saveCheckedDocuments(newSet);
        return newSet;
      });
    },
    [saveCheckedDocuments]
  );

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Load checked documents from localStorage on component mount
  useEffect(() => {
    if (doc_id) {
      setCheckedDocuments(loadCheckedDocuments());
    }
  }, [doc_id, loadCheckedDocuments]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    setDisplayLimit(initialLimit);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              <CompareDocItem
                key={document._id}
                document={document}
                isSelected={selectedDocumentId === document._id}
                isChecked={checkedDocuments.has(document._id)}
                onSelect={onSelectDocument}
                onCheckboxChange={handleCheckboxChange}
              />
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
            showTotal={(total, range) => (
              <span style={{ fontSize: "11px" }}>
                {`${range[0]}-${range[1]} của ${total} tài liệu`}
              </span>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentList;
