import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const searchDebounceRef = useRef<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Skip API call if we're in the middle of a search debounce or doc_id is not available
    if (isSearching || !doc_id) return;

    // Prevent double execution in development (StrictMode) - check if already fetching
    if (isFetchingRef.current) {
      // console.log("Skipping duplicate fetch - already fetching");
      return;
    }

    // Prevent double execution in development (StrictMode) - check if already fetched initial data
    if (hasFetchedRef.current && searchText === "" && currentPage === 1) {
      // console.log("Skipping duplicate fetch - already fetched initial data");
      return;
    }

    const fetchDocuments = async () => {
      // console.log(
      //   `Fetching documents: searchText="${searchText}", currentPage=${currentPage}, doc_id="${doc_id}"`
      // );
      isFetchingRef.current = true; // Mark as fetching

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
          response = await DocumentService.getSimilarDocumentsForAdmin(
            doc_id || ""
          );
          hasFetchedRef.current = true; // Mark as fetched for initial load
        }

        setDocuments(response.documents || []);
        setTotal(response.total || response.totalCount || 0);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false; // Reset fetching flag
      }
    };

    fetchDocuments();
  }, [currentPage, searchText, doc_id, isSearching]);

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

  // Load checked documents from localStorage on component mount
  useEffect(() => {
    if (doc_id) {
      // Reset fetch flag when doc_id changes
      hasFetchedRef.current = false;
      const checked = loadCheckedDocuments();
      setCheckedDocuments(checked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc_id]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handleSearch = (value: string) => {
    // Clear previous debounce timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Reset fetch flag when starting a new search
    hasFetchedRef.current = false;

    // Set searching flag
    setIsSearching(true);

    // Set new debounce timer
    searchDebounceRef.current = setTimeout(() => {
      setSearchText(value);
      setCurrentPage(1);
      setDisplayLimit(initialLimit);
      setIsSearching(false);
    }, 300); // 300ms debounce
  };

  const handlePageChange = (page: number) => {
    // Reset fetch flag when changing page
    hasFetchedRef.current = false;
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
