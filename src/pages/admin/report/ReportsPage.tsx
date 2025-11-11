import React, { useEffect, useState, useCallback } from "react";
import { message, Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import { ReportService } from "../../../utils/ReportService";
import type { Report } from "../../../models/report";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";
import AdminReportTable from "../../../components/admin/report/AdminReportTable";
import AdminReportDetailModal from "../../../components/admin/report/AdminReportDetailModal";
import type { AdminReportFilterParams } from "../../../components/admin/report/AdminReportFilterSearch";
import AdminReportFilterSearch from "../../../components/admin/report/AdminReportFilterSearch";

const ReportsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolveModalVisible, setResolveModalVisible] = useState(false);

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
      status: searchParams.get("status") || "PROCESSING", // Mặc định lấy báo cáo đang xử lý
      type: searchParams.get("type") || "",
    }),
    [searchParams]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AdminReportFilterParams>({
    status: "PROCESSING", // Khởi tạo với trạng thái mặc định
  });

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

  const openResolveModal = (report: Report) => {
    setSelectedReport(report);
    setResolveModalVisible(true);
  };

  const handleSubmitResolution = async (params: {
    validTypes: string[];
    action: string;
    resolveReason: string;
  }) => {
    if (!selectedReport?._id) return;
    try {
      await ReportService.resolveReport(selectedReport._id, {
        validTypes: params.validTypes,
        action: params.action,
        resolveReason: params.resolveReason,
      });
      message.success("Đã giải quyết báo cáo thành công");
      setResolveModalVisible(false);
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error("Error resolving report:", error);
      message.error("Không thể giải quyết báo cáo");
    }
  };

  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Giám sát", path: "/admin/reports" },
    { label: "Báo cáo" },
  ];

  return (
    <div>
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="mt-4">
        <div className="p-6 bg-white rounded shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-sm font-bold text-[var(--primary-text-color)]">
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
            onResolve={openResolveModal} // mở modal duyệt
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
            visible={resolveModalVisible}
            onClose={() => {
              setResolveModalVisible(false);
              setSelectedReport(null);
            }}
            onResolve={handleSubmitResolution} // nhận validTypes, action, resolveReason từ form
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
