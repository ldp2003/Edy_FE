import React, { useState, useEffect, useCallback } from "react";
import { Spin, message, Input } from "antd";
import { Search, School } from "lucide-react";
import OrganizationGrid from "../../../components/user/organization/organizationGrid/OrganizationGrid";
import type { OrganizationDetailed } from "../../../models/organization";
import { OrganizationService } from "../../../utils/OrganizationService";

const { Search: AntSearch } = Input;

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
  const [selectedLetter, setSelectedLetter] = useState<string>("all");

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

    // Filter by selected letter
    if (selectedLetter !== "all") {
      filtered = filtered.filter(
        (org) => org.name.charAt(0).toUpperCase() === selectedLetter
      );
    }

    // Sort organizations alphabetically by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredOrganizations(filtered);
  }, [searchTerm, organizations, selectedLetter]);

  const getAvailableLetters = useCallback(() => {
    const letters = new Set<string>();
    organizations.forEach((org) => {
      letters.add(org.name.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
  }, [organizations]);

  const availableLetters = getAvailableLetters();

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    filterAndSortOrganizations();
  }, [filterAndSortOrganizations]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleLetterChange = (value: string) => {
    setSelectedLetter(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--secondary-background-color)] mt-6">
      {contextHolder}

      {/* Header */}
      <div className="bg-[var(--primary-background-color)] border-b border-[var(--border-color)] px-4 sm:px-6 py-8 sm:py-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[var(--primary-color)] rounded-full">
              <School size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--primary-text-color)]">
                Các tổ chức/trường học khác
              </h1>
            </div>

            {/* Search */}
            <div className="w-full max-w-md">
              <AntSearch
                placeholder="Tìm kiếm tổ chức theo tên, mã hoặc địa chỉ..."
                allowClear
                size="large"
                prefix={<Search size={16} />}
                onPressEnter={(e) =>
                  handleSearch((e.target as HTMLInputElement).value)
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto  py-4 sm:py-6">
        {/* Alphabet Navigation */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-start">
            <button
              onClick={() => handleLetterChange("all")}
              className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                selectedLetter === "all"
                  ? "border-2 border-[var(--primary-color)] text-[var(--primary-color)] bg-transparent"
                  : "text-[var(--primary-text-color)] hover:text-[var(--primary-color)] bg-transparent"
              }`}
            >
              Tất cả
            </button>
            {availableLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterChange(letter)}
                className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                  selectedLetter === letter
                    ? "border-2 border-[var(--primary-color)] text-[var(--primary-color)] bg-transparent"
                    : "text-[var(--primary-text-color)] hover:text-[var(--primary-color)] bg-transparent"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {filteredOrganizations.length > 0 ? (
          <OrganizationGrid organizations={filteredOrganizations} />
        ) : (
          <div className="text-center py-8 sm:py-12">
            <School
              size={40}
              className="mx-auto text-[var(--page-element-color)] mb-3 sm:mb-4"
            />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[var(--secondary-text-color)] mb-2">
              {searchTerm || selectedLetter !== "all"
                ? "Không tìm thấy tổ chức nào"
                : "Chưa có tổ chức nào"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--third-text-color)]">
              {searchTerm || selectedLetter !== "all"
                ? `Thử tìm kiếm với từ khóa khác hoặc chọn chữ cái khác.`
                : "Hiện tại chưa có tổ chức nào trong hệ thống."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationListPage;
