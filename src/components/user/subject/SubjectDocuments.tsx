import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import type { Subject } from "../../../models/subject";
import type {
  Document,
  DocumentTypeType,
  FetchDocumentsParams,
} from "../../../models/document";
import {
  documentTypeLabels,
  getDocumentTypeFromFileName,
} from "../../../models/document";
import SubjectService from "../../../utils/SubjectService";
import SubjectHeader from "./components/SubjectHeader";
import DocumentFilter from "./components/DocumentFilter";
import DocumentSection from "./components/DocumentSection";
import { DocumentService } from "../../../utils/DocumentService";

const SubjectDocuments: React.FC = () => {
  const { subjectSlug } = useParams<{ subjectSlug: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterLevel, setFilterLevel] = useState("all");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  // Fetch subject information by slug
  useEffect(() => {
    const fetchSubject = async () => {
      if (!subjectSlug) return;

      try {
        const subjectData = await SubjectService.getSubjectBySlug(subjectSlug);
        if (subjectData) {
          setSubject(subjectData);
          setSubjectId(subjectData._id);
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };

    fetchSubject();
  }, [subjectSlug]);

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!subjectId) return;

      setLoading(true);
      try {
        const params: FetchDocumentsParams = {
          subject: subjectId,
          page: currentPage,
          limit: pageSize,
        };

        // Add search term if exists
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        // Add sorting
        switch (sortBy) {
          case "newest":
            params.ordering = "createdAt";
            params.order = -1;
            break;
          case "oldest":
            params.ordering = "createdAt";
            params.order = 1;
            break;
          case "title":
            params.ordering = "title";
            params.order = 1;
            break;
          case "download":
            params.ordering = "download_count";
            params.order = -1;
            break;
        }

        // Add level filter
        if (filterLevel !== "all") {
          params.level = filterLevel;
        }

        const response = await DocumentService.fetchNewestDocuments(params);
        setDocuments(response.documents || []);
        setTotalDocuments(response.total || 0);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [subjectId, currentPage, searchTerm, sortBy, filterLevel]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Categorize documents
  const recentDocuments = documents
    .filter((doc) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(doc.createdAt) > thirtyDaysAgo;
    })
    .slice(0, 20);

  const popularDocuments = [...documents]
    .sort((a, b) => {
      const scoreA = (a.view || 0) * 2 + (a.download_count || 0);
      const scoreB = (b.view || 0) * 2 + (b.download_count || 0);
      return scoreB - scoreA;
    })
    .slice(0, 20);

  // Group by document type - use smart categorization from filename if doc_type is missing
  const documentsByType: Record<string, Document[]> = {};
  documents.forEach((doc) => {
    // Use existing doc_type or determine from filename
    const docType = doc.doc_type || getDocumentTypeFromFileName(doc.title);

    if (!documentsByType[docType]) {
      documentsByType[docType] = [];
    }
    documentsByType[docType].push(doc);
  });

  if (!subject) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Subject Header */}
      <SubjectHeader subject={subject} totalDocuments={totalDocuments} />

      {/* Search and Filter Bar */}
      <DocumentFilter
        searchTerm={searchTerm}
        sortBy={sortBy}
        filterLevel={filterLevel}
        onSearch={handleSearch}
        onSortChange={setSortBy}
        onLevelChange={setFilterLevel}
      />

      {/* Document Sections - Multiple sections stacked vertically */}
      <div className="space-y-6">
        {/* Tài liệu gần đây */}
        {recentDocuments && recentDocuments.length > 0 && (
          <DocumentSection
            title={`Tài liệu gần đây`}
            documents={recentDocuments}
            loading={loading}
            maxDisplay={4}
            canExpand={true}
          />
        )}

        {/* Tài liệu phổ biến */}
        {popularDocuments && popularDocuments.length > 0 && (
          <DocumentSection
            title={`Tài liệu phổ biến`}
            documents={popularDocuments}
            loading={loading}
            maxDisplay={4}
            canExpand={true}
          />
        )}

        {/* Các loại tài liệu theo doc_type */}
        {Object.entries(documentsByType).map(([type, docs]) => {
          if (!docs || docs.length === 0) return null;

          const title = documentTypeLabels[type as DocumentTypeType] || type;

          return (
            <DocumentSection
              key={type}
              title={`${title}`}
              documents={docs}
              loading={loading}
              maxDisplay={4}
              canExpand={true}
            />
          );
        })}

        {/* Tất cả tài liệu (khi có tìm kiếm hoặc filter) */}
        {(searchTerm || filterLevel !== "all") && (
          <DocumentSection
            title={`Kết quả tìm kiếm (${totalDocuments})`}
            documents={documents}
            loading={loading}
            showPagination={true}
            currentPage={currentPage}
            totalDocuments={totalDocuments}
            totalPages={totalPages}
            pageSize={pageSize}
            searchTerm={searchTerm}
            onPageChange={handlePageChange}
            maxDisplay={12}
            canExpand={false}
          />
        )}

        {/* Nếu không có tài liệu nào */}
        {!loading && documents.length === 0 && (
          <DocumentSection
            title="Tài liệu"
            documents={[]}
            loading={false}
            maxDisplay={4}
            canExpand={false}
            emptyMessage={
              searchTerm
                ? `Không tìm thấy tài liệu nào với từ khóa "${searchTerm}"`
                : "Chưa có tài liệu nào trong môn học này"
            }
          />
        )}
      </div>
    </div>
  );
};

export default SubjectDocuments;
