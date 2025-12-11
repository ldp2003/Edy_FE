/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import type { Subject } from "../../../models/subject";
import type { Document } from "../../../models/document";
import {
  documentTypeLabels,
  getDocumentTypeFromFileName,
} from "../../../models/document";
import SubjectService from "../../../utils/SubjectService";
import SubjectHeader from "./components/SubjectHeader";
import DocumentFilter from "./components/DocumentFilter";
import DocumentSection from "./components/DocumentSection";

const SubjectDocuments: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterLevel, setFilterLevel] = useState("all");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  // Fetch subject information by ID
  useEffect(() => {
    const fetchSubject = async () => {
      if (!subjectId) return;

      try {
        const subjectData = await SubjectService.getSubjectById(subjectId);
        if (subjectData) {
          setSubject(subjectData);
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };

    fetchSubject();
  }, [subjectId]);

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!subjectId) return;

      setLoading(true);
      try {
        const response = await SubjectService.getDocumentsBySubject(subjectId);
        // console.log("Documents response:", response);

        // Assuming response structure matches DocumentsResponse or is an array
        const documents: Document[] = Array.isArray(response)
          ? response
          : (response as { documents?: Document[] })?.documents || [];

        // Apply client-side filtering and sorting since we're using getDocumentsBySubject
        let filteredDocs = [...documents];

        // Apply search filter
        if (searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase();
          filteredDocs = filteredDocs.filter(
            (doc) =>
              doc.title.toLowerCase().includes(searchLower) ||
              doc.author?.some((author: string) =>
                author.toLowerCase().includes(searchLower)
              ) ||
              doc.description?.summary_by_user
                ?.toLowerCase()
                .includes(searchLower)
          );
        }

        // Apply level filter
        if (filterLevel !== "all") {
          filteredDocs = filteredDocs.filter(
            (doc) => doc.level === filterLevel
          );
        }

        // Apply sorting
        switch (sortBy) {
          case "newest":
            filteredDocs.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
          case "oldest":
            filteredDocs.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
            break;
          case "title":
            filteredDocs.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "download":
            filteredDocs.sort(
              (a, b) => (b.download_count || 0) - (a.download_count || 0)
            );
            break;
        }

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

        setDocuments(paginatedDocs);
        setTotalDocuments(filteredDocs.length);
        setTotalPages(Math.ceil(filteredDocs.length / pageSize));
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
  // console.log("Total documents:", documents.length);
  documents.forEach((doc) => {
    // Use existing doc_type or determine from filename
    const docType = doc.doc_type || getDocumentTypeFromFileName(doc.title);

    // console.log(`Document ${index + 1}:`, {
    //   title: doc.title,
    //   doc_type: doc.doc_type,
    //   determined_type: docType,
    //   raw_document: doc, // Log toàn bộ document để debug
    // });

    if (!documentsByType[docType]) {
      documentsByType[docType] = [];
    }
    documentsByType[docType].push(doc);
  });

  // console.log("Documents by type:", documentsByType);

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
            maxDisplay={5}
            canExpand={true}
          />
        )}

        {/* Tài liệu phổ biến */}
        {popularDocuments && popularDocuments.length > 0 && (
          <DocumentSection
            title={`Tài liệu phổ biến`}
            documents={popularDocuments}
            loading={loading}
            maxDisplay={5}
            canExpand={true}
          />
        )}

        {/* Các loại tài liệu theo doc_type - Sắp xếp theo số lượng giảm dần */}
        {Object.entries(documentsByType)
          .sort(([, docsA], [, docsB]) => docsB.length - docsA.length) // Sắp xếp theo số lượng tài liệu giảm dần
          .map(([type, docs]) => {
            if (!docs || docs.length === 0) return null;

            const title =
              documentTypeLabels[type as keyof typeof documentTypeLabels] ||
              type;

            return (
              <DocumentSection
                key={type}
                title={`${title} (${docs.length})`}
                documents={docs}
                loading={loading}
                maxDisplay={docs.length >= 6 ? 6 : 5} // Hiển thị nhiều hơn nếu có nhiều tài liệu
                canExpand={docs.length > 4}
              />
            );
          })
          .filter(Boolean)}

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
            maxDisplay={5}
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
