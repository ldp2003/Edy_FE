import React, { useEffect, useState, useCallback } from "react";
import { message, Pagination, Modal, Button } from "antd";
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

  // Modal preview tài liệu (placeholder)
  const [docPreviewVisible, setDocPreviewVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    _id: string;
    title: string;
  } | null>(null);

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

  const handleViewDetail = (report: Report) => {
    const docObj = typeof report.doc === "object" ? report.doc : null;
    if (docObj?._id) {
      setPreviewDoc({ _id: docObj._id, title: docObj.title || "Tài liệu" });
      setDocPreviewVisible(true);
    } else {
      message.info("Không có thông tin tài liệu để xem trước");
    }
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

  const handleDelete = () => {
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
          onViewDetail={handleViewDetail} // mở modal preview
          onResolve={openResolveModal} // mở modal duyệt
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

        {/* Modal preview tài liệu (placeholder) */}
        <Modal
          open={docPreviewVisible}
          onCancel={() => setDocPreviewVisible(false)}
          footer={null}
          title="Xem chi tiết tài liệu"
        >
          {previewDoc ? (
            <div className="space-y-3">
              <div className="font-medium">{previewDoc.title}</div>
              <div className="text-sm text-gray-500">
                URL: /document-detail/{previewDoc._id}
              </div>
              <Button
                type="primary"
                onClick={() =>
                  window.open(`/document-detail/${previewDoc._id}`, "_blank")
                }
              >
                Mở trang chi tiết
              </Button>
            </div>
          ) : (
            <div>Không có dữ liệu tài liệu</div>
          )}
        </Modal>

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
  );
};

export default ReportsPage;
