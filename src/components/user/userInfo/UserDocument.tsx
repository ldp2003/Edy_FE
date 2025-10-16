import React, { useState, useCallback, useEffect } from "react";
import { Button, Pagination } from "antd";
import { Grid, List } from "lucide-react";
import UserDocumentFilterSearch from "./UserDocumentFilterSearch";
import type { UserDocumentFilterParams } from "./UserDocumentFilterSearch";
import UserDocumentGridView from "./UserDocumentGridView";
import UserDocumentListView from "./UserDocumentListView";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";

interface UserDocumentProps {
  userId: string;
}

const UserDocument: React.FC<UserDocumentProps> = ({ userId }) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<UserDocumentFilterParams>({});

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const apiParams = {
        page: currentPage,
        limit: pageSize,
        ...filters,
      };

      const response = await DocumentService.getDocumentByUser(
        userId,
        apiParams
      );
      setDocuments(response.data.documents || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching user documents:", error);
      setDocuments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, pageSize, filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFilterChange = useCallback(
    (newFilters: UserDocumentFilterParams) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (viewMode) {
      case "grid":
        return <UserDocumentGridView documents={documents} loading={loading} />;
      case "list":
        return <UserDocumentListView documents={documents} loading={loading} />;
      default:
        return <UserDocumentListView documents={documents} loading={loading} />;
    }
  };

  return (
    <div className="space-y-6">
      <UserDocumentFilterSearch
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tài liệu ({total} kết quả)</h3>

          <div className="flex gap-2">
            <Button
              type={viewMode === "list" ? "primary" : "default"}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-blue-500" : ""}
            >
              <List size={16} />
            </Button>
            <Button
              type={viewMode === "grid" ? "primary" : "default"}
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-blue-500" : ""}
            >
              <Grid size={16} />
            </Button>
          </div>
        </div>

        {renderContent()}

        {total > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={total}
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
      </div>
    </div>
  );
};

export default UserDocument;
