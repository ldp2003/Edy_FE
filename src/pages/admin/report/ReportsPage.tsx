import React, { useEffect, useState, useCallback } from "react";
import { message, Pagination, Modal } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ReportService } from "../../../utils/ReportService";
import type { Report } from "../../../models/report";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

import AdminReportTable from "../../../components/admin/report/AdminReportTable";
import AdminReportDetailModal from "../../../components/admin/report/AdminReportDetailModal";
import type { AdminReportFilterParams } from "../../../components/admin/report/AdminReportFilterSearch";
import AdminReportFilterSearch from "../../../components/admin/report/AdminReportFilterSearch";

const ReportsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy params từ URL
  const getCurrentPage = useCallback(
    () => parseInt(searchParams.get("page") || "1", 10),
    [searchParams]
  );
  const getCurrentPageSize = useCallback(
    () => parseInt(searchParams.get("limit") || "5", 10),
    [searchParams]
  );
  const getCurrentFilters = useCallback(
    (): AdminReportFilterParams => ({
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "",
      type: searchParams.get("type") || "",
    }),
    [searchParams]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AdminReportFilterParams>({});

  // Cập nhật URL params
  const updateUrlParams = useCallback(
    (newParams: Record<string, string | number>) => {
      const updatedParams = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value && value !== "") {
          updatedParams.set(key, String(value));
        } else {
          updatedParams.delete(key);
        }
      });

      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams]
  );

  const fetchReports = useCallback(
    async (
      page?: number,
      limit?: number,
      filterParams?: AdminReportFilterParams
    ) => {
      setLoading(true);
      try {
        const currentPage = page || getCurrentPage();
        const currentLimit = limit || getCurrentPageSize();
        const currentFilters = filterParams || getCurrentFilters();

        // Loại bỏ các filter rỗng
        const cleanFilters = Object.fromEntries(
          Object.entries(currentFilters).filter(
            ([, value]) => value && value !== ""
          )
        );

        const params = {
          page: currentPage,
          limit: currentLimit,
          status: cleanFilters.status,
          type: cleanFilters.type,
          search: cleanFilters.search,
        };

        const res = await ReportService.getAllReports(params);
        setReports(res.reports || []);
        setTotal(res.total || 0);
        setCurrentPage(currentPage);
        setPageSize(currentLimit);
        setFilters(currentFilters);
      } catch (error) {
        console.error("Error fetching reports:", error);
        message.error("Không thể tải danh sách báo cáo");
      } finally {
        setLoading(false);
      }
    },
    [getCurrentPage, getCurrentPageSize, getCurrentFilters]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = (filterParams: AdminReportFilterParams) => {
    // Cập nhật URL với filters mới và reset về trang 1
    const newParams: Record<string, string | number> = {
      page: 1,
      limit: pageSize,
      ...filterParams,
    };
    updateUrlParams(newParams);
    fetchReports(1, pageSize, filterParams);
  };

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize;
    updateUrlParams({
      page,
      limit: newPageSize,
      ...filters,
    });
    fetchReports(page, newPageSize, filters);
  };

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleResolve = async (report: Report) => {
    try {
      // Gọi API để resolve report
      await ReportService.resolveReport(report._id, {
        validTypes: report.type || [],
        action: "APPROVED",
        resolveReason: "Đã xử lý báo cáo",
      });
      message.success("Đã giải quyết báo cáo thành công");
      fetchReports();
    } catch (error) {
      console.error("Error resolving report:", error);
      message.error("Không thể giải quyết báo cáo");
    }
  };

  const handleDelete = (_report: Report) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa báo cáo này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        // Tạm thời chỉ hiển thị thông báo vì API delete chưa có
        message.info("Tính năng xóa báo cáo sẽ được cập nhật sau");
      },
    });
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/admin" },
    { label: "Quản lý báo cáo" },
  ];

  return (
    <div>
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="p-6 bg-white rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Quản lý báo cáo
          </h1>
          <div className="text-sm text-gray-500">Tổng: {total} báo cáo</div>
        </div>

        <AdminReportFilterSearch
          onFilterChange={handleFilterChange}
          loading={loading}
          initialFilters={filters}
        />

        <AdminReportTable
          reports={reports}
          loading={loading}
          onRowClick={handleViewDetail}
          onViewDetail={handleViewDetail}
          onResolve={handleResolve}
          onDelete={handleDelete}
        />

        {total > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, total)} trong {total} báo cáo
            </div>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              showSizeChanger={true}
              pageSizeOptions={["5", "10", "20", "50"]}
              showQuickJumper
              showTotal={(total) =>
                `Trang ${currentPage} / ${Math.ceil(total / pageSize)}`
              }
            />
          </div>
        )}

        <AdminReportDetailModal
          report={selectedReport}
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedReport(null);
          }}
          onResolve={handleResolve}
        />
      </div>
    </div>
  );
};

export default ReportsPage;
