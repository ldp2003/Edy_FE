import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentListResults, { type ViewMode } from "../../../components/user/document/documentList/DocumentListResults";
import type { Document } from "../../../models/document";

interface DocumentListState {
  documents: Document[];
  title: string;
  type: "featured" | "newest" | "related" | "recent";
}

const DocumentListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [title, setTitle] = useState("Danh sách tài liệu");

  // Get data from navigation state
  useEffect(() => {
    const state = location.state as DocumentListState;
    if (state && state.documents) {
      setDocuments(state.documents);
      setTitle(state.title || "Danh sách tài liệu");
      setLoading(false);
    } else {
      // If no state, redirect to home
      navigate("/");
    }
  }, [location.state, navigate]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Handle sorting change
  const handleSortChange = (ordering: string, order: 1 | -1) => {
    const sortedDocuments = [...documents].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (ordering) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "view":
          aValue = a.view || 0;
          bValue = b.view || 0;
          break;
        case "download_count":
          aValue = a.download_count || 0;
          bValue = b.download_count || 0;
          break;
        case "title":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (order === -1) {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    setDocuments(sortedDocuments);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalDocuments = documents.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDocuments = documents.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--primary-text-color)] mb-2">
            {title}
          </h1>
          <p className="text-gray-600">Hiển thị {totalDocuments} tài liệu</p>
        </div>

        {/* Main Content */}
        <div className="mt-6">
          <DocumentListResults
            documents={currentDocuments}
            loading={loading}
            total={totalDocuments}
            currentPage={currentPage}
            pageSize={pageSize}
            viewMode={viewMode}
            onPageChange={handlePageChange}
            onViewModeChange={handleViewModeChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentListPage;
