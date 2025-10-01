import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search, BookOpen, School, Calendar, Filter } from "lucide-react";
import { Input, Select, Pagination, Empty, Spin } from "antd";
import DocumentCard from "../document/documentCard/DocumentCard";
import type { Subject } from "../../../models/subject";
import type { Document, FetchDocumentsParams } from "../../../models/document";
import SubjectService from "../../../utils/SubjectService";
import { DocumentAPI } from "../../../api/API";

const { Option } = Select;

interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

const SubjectDocuments: React.FC = () => {
  const { subjectSlug } = useParams<{ subjectSlug: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [filterLevel, setFilterLevel] = useState("all");

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

        const response: DocumentsResponse =
          await DocumentAPI.fetchNewestDocuments(params);
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

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
      <div className="bg-white text-left rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <BookOpen size={24} className="text-[var(--primary-color)]" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-[var(--primary-color)]">
                Môn học
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {subject.name}
            </h1>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <School size={16} />
                <span className="text-sm">{subject.organization.name}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span className="text-sm">Mã môn học: {subject.code}</span>
              </div>

              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span className="text-sm font-medium">
                  {totalDocuments} tài liệu
                </span>
              </div>
            </div>

            {subject.description && (
              <p className="text-gray-700 mt-3 text-sm">
                {subject.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm tài liệu..."
              prefix={<Search size={16} className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="large"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 140 }}
              size="large"
              suffixIcon={<Filter size={16} />}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="oldest">Cũ nhất</Option>
              <Option value="title">Tên A-Z</Option>
              <Option value="download">Tải nhiều</Option>
            </Select>

            <Select
              value={filterLevel}
              onChange={setFilterLevel}
              style={{ width: 120 }}
              size="large"
            >
              <Option value="all">Tất cả</Option>
              <Option value="HIGH_SCHOOL">THPT</Option>
              <Option value="UNIVERSITY">Đại học</Option>
              <Option value="POSTGRADUATE">Sau ĐH</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <Empty
            description={
              searchTerm
                ? `Không tìm thấy tài liệu nào với từ khóa "${searchTerm}"`
                : "Chưa có tài liệu nào trong môn học này"
            }
          />
        </div>
      ) : (
        <>
          {/* Results Info */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Hiển thị {documents.length} trong tổng số {totalDocuments} tài
              liệu
              {searchTerm && (
                <span className="font-medium"> cho "{searchTerm}"</span>
              )}
            </p>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                title={doc.title}
                description={`${doc.user?.first_name} ${
                  doc.user?.last_name
                } • ${
                  doc.published_year || new Date(doc.createdAt).getFullYear()
                }`}
                imageUrl={doc.cover_page}
                document={doc}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                total={totalDocuments}
                pageSize={pageSize}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} tài liệu`
                }
                showSizeChanger={false}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubjectDocuments;
