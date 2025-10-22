import React, { useState } from "react";
import { Modal, Form, Checkbox, Input, message, Tooltip } from "antd";
import { Flag } from "lucide-react";
import { ReportService } from "../../../utils/ReportService";
import { ReportType } from "../../../models/report";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
}

// Các lý do báo cáo cho tài liệu
const REPORT_REASONS = [
  {
    value: ReportType.SPAM_OR_MISLEADING,
    label: "Spam hoặc gây hiểu lầm",
    description:
      "Nội dung spam, quảng cáo không mong muốn hoặc thông tin sai lệch",
  },
  {
    value: ReportType.DUPLICATE,
    label: "Nội dung trùng lặp",
    description:
      "Tài liệu này đã tồn tại trước đó hoặc giống hệt với tài liệu khác",
  },
  {
    value: ReportType.COPYRIGHT,
    label: "Vi phạm bản quyền",
    description: "Sử dụng nội dung có bản quyền mà không có sự cho phép",
  },
  {
    value: ReportType.INCORRECT_CATEGORY,
    label: "Phân loại sai",
    description: "Tài liệu được đặt ở danh mục hoặc môn học không đúng",
  },
  {
    value: ReportType.PERSONAL_INFORMATION,
    label: "Chứa thông tin cá nhân",
    description: "Tiết lộ thông tin cá nhân hoặc riêng tư của người khác",
  },
  {
    value: ReportType.LOW_QUALITY,
    label: "Chất lượng kém",
    description:
      "Nội dung không rõ ràng, thiếu thông tin hoặc không có giá trị",
  },
  {
    value: ReportType.INAPPROPRIATE,
    label: "Nội dung không phù hợp",
    description:
      "Chứa nội dung bạo lực, khiêu dâm, hoặc không phù hợp với chính sách",
  },
  {
    value: ReportType.OTHER,
    label: "Lý do khác",
    description: "Vấn đề khác không thuộc các danh mục trên",
  },
];

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  documentId,
  documentTitle,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handleReasonsChange = (checkedValues: string[]) => {
    setSelectedReasons(checkedValues);
    form.setFieldsValue({ reasons: checkedValues });
  };

  const handleSubmit = async (values: {
    reasons: string[];
    description?: string;
  }) => {
    console.log("Report submitted:", {
      documentId,
      documentTitle,
      reasons: values.reasons,
      description: values.description,
    });

    setLoading(true);

    try {
      // Sử dụng ReportService.createReport mới
      const result = await ReportService.createReport({
        docId: documentId,
        type: values.reasons, // Trực tiếp truyền array các ReportType
        reason: values.description || values.reasons.join(", "), // Mô tả chi tiết hoặc kết hợp các lý do
      });

      messageApi.success(result.message || "Báo cáo đã được gửi thành công!");
      form.resetFields();
      setSelectedReasons([]);
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại!";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedReasons([]);
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Flag className="text-[var(--red-button-color)]" size={18} />
            <span className="text-base font-semibold">Báo cáo tài liệu</span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose={true}
        styles={{ body: { padding: 16 } }}
      >
        {/* Document Info */}
        <div className="mb-3 px-3 py-2 bg-white rounded border border-gray-100">
          <div className="text-xs text-gray-500 mb-0.5">
            Tài liệu được báo cáo:
          </div>
          <div
            className="font-medium text-[var(--primary-text-color)] text-sm truncate"
            title={documentTitle}
          >
            {documentTitle}
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ reasons: [], description: "" }}
        >
          {/* Reason Selection */}
          <Form.Item
            label={
              <span className="text-sm font-bold text-[var(--primary-text-color)]">
                Lý do báo cáo
              </span>
            }
            name="reasons"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một lý do báo cáo!",
              },
              {
                type: "array",
                min: 1,
                message: "Vui lòng chọn ít nhất một lý do báo cáo!",
              },
            ]}
          >
            <Checkbox.Group
              onChange={handleReasonsChange}
              value={selectedReasons}
              className="w-fit"
            >
              <div className="grid grid-cols-2 gap-2 w-fit">
                {REPORT_REASONS.map((reason) => (
                  <Tooltip
                    key={reason.value}
                    title={reason.description}
                    placement="right"
                  >
                    <div className="border border-gray-100 rounded px-2 py-1 hover:border-[var(--link-color)] w-full transition-colors cursor-pointer bg-white">
                      <Checkbox value={reason.value} className="w-full">
                        <span className="text-[var(--primary-text-color)] text-xs font-medium whitespace-nowrap">
                          {reason.label}
                        </span>
                      </Checkbox>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          {/* Additional Description */}
          <Form.Item
            label={
              <span className="text-sm">
                Mô tả thêm <span className="text-gray-400">(tùy chọn)</span>
              </span>
            }
            name="description"
            help={null}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả chi tiết..."
              maxLength={300}
              showCount
              className="text-xs"
            />
          </Form.Item>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-3 py-1 rounded border cursor-pointer border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 hover:text-[var(--link-color)] rounded bg-[var(--primary-color)] hover:bg-white border  hover:border-[var(--primary-color)] cursor-pointer text-white text-xs font-semibold transition-colors"
            >
              {loading ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </Form>

        {/* Warning Notice */}
        <div className="mt-3 px-2 py-1 bg-[var(--red-button-color)]/50 border-l-4 border-[var(--red-button-color)] rounded text-xs text-black">
          <b>Lưu ý:</b> Vui lòng chỉ báo cáo khi bạn chắc chắn có vi phạm. Báo
          cáo sai sự thật có thể bị xử lý.
        </div>
      </Modal>
    </>
  );
};

export default ReportModal;
