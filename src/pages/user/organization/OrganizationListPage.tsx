import React, { useState, useEffect, useCallback } from "react";
import { Spin, message, Input, Select } from "antd";
import { Search, School } from "lucide-react";
import OrganizationGrid from "../../../components/user/organization/organizationGrid/OrganizationGrid";
import type { OrganizationDetailed } from "../../../models/organization";
import { OrganizationService } from "../../../utils/OrganizationService";

const { Search: AntSearch } = Input;
const { Option } = Select;

const OrganizationListPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [organizations, setOrganizations] = useState<OrganizationDetailed[]>(
    []
  );
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    OrganizationDetailed[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await OrganizationService.getOrganizations();
      setOrganizations(response);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      messageApi.error("Không thể tải danh sách tổ chức!");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  const filterAndSortOrganizations = useCallback(() => {
    let filtered = [...organizations];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort organizations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "code":
          return a.code.localeCompare(b.code);
        case "subjects":
          return (b.subjects?.length || 0) - (a.subjects?.length || 0);
        case "documents": {
          const aDocCount =
            a.content_categories?.reduce(
              (total, cat) => total + cat.document_count,
              0
            ) || 0;
          const bDocCount =
            b.content_categories?.reduce(
              (total, cat) => total + cat.document_count,
              0
            ) || 0;
          return bDocCount - aDocCount;
        }
        default:
          return 0;
      }
    });

    setFilteredOrganizations(filtered);
  }, [searchTerm, sortBy, organizations]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    filterAndSortOrganizations();
  }, [filterAndSortOrganizations]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--secondary-background-color)]">
      {contextHolder}

      {/* Header */}
      <div className="bg-white border-b border-[var(--border-color)] px-6 py-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[var(--primary-color)] rounded-lg">
              <School size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--primary-text-color)] text-center md:text-left">
                Các tổ chức/trường học khác
              </h1>
              <p className="text-[var(--secondary-text-color)]">
                Khám phá {organizations.length} tổ chức giáo dục
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <AntSearch
              placeholder="Tìm kiếm tổ chức theo tên, mã hoặc địa chỉ..."
              allowClear
              size="large"
              prefix={<Search size={16} />}
              style={{ flex: 1, maxWidth: 500 }}
              onSearch={handleSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={sortBy}
              onChange={handleSortChange}
              size="large"
              style={{ minWidth: 150 }}
            >
              <Option value="name">Theo tên</Option>
              <Option value="code">Theo mã</Option>
              <Option value="subjects">Theo số môn học</Option>
              <Option value="documents">Theo số tài liệu</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        {filteredOrganizations.length > 0 ? (
          <OrganizationGrid
            title={`${filteredOrganizations.length} tổ chức ${
              searchTerm ? `phù hợp với "${searchTerm}"` : ""
            }`}
            organizations={filteredOrganizations}
          />
        ) : (
          <div className="text-center py-12">
            <School size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm
                ? "Không tìm thấy tổ chức nào"
                : "Chưa có tổ chức nào"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.`
                : "Hiện tại chưa có tổ chức nào trong hệ thống."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationListPage;
