import React, { useState } from "react";
import { Modal, Form, Checkbox, Input, message, Tooltip } from "antd";
import { Flag } from "lucide-react";
import { ReportService } from "../../../utils/ReportService";
import { ReportType } from "../../../models/report";

interface CommentReportModalProps {
  visible: boolean;
  onClose: () => void;
  documentId: string;
  commentId: string;
  commentContent: string;
  commentAuthor: string;
}

// Các lý do báo cáo cho bình luận
const COMMENT_REPORT_REASONS = [
  {
    value: ReportType.SPAM_OR_MISLEADING,
    label: "Spam hoặc gây hiểu lầm",
    description:
      "Bình luận spam, quảng cáo không mong muốn hoặc thông tin sai lệch",
  },
  {
    value: ReportType.INAPPROPRIATE,
    label: "Nội dung không phù hợp",
    description: "Chứa ngôn từ thô tục, bạo lực, khiêu dâm hoặc không phù hợp",
  },
  {
    value: ReportType.PERSONAL_INFORMATION,
    label: "Tiết lộ thông tin cá nhân",
    description: "Chia sẻ thông tin cá nhân hoặc riêng tư của người khác",
  },
  {
    value: ReportType.COPYRIGHT,
    label: "Vi phạm bản quyền",
    description: "Sử dụng nội dung có bản quyền mà không có sự cho phép",
  },
  {
    value: ReportType.LOW_QUALITY,
    label: "Nội dung chất lượng thấp",
    description: "Bình luận không có giá trị, không liên quan đến nội dung",
  },
  {
    value: ReportType.OTHER,
    label: "Lý do khác",
    description: "Vấn đề khác không thuộc các danh mục trên",
  },
];

const CommentReportModal: React.FC<CommentReportModalProps> = ({
  visible,
  onClose,
  documentId,
  commentId,
  commentContent,
  commentAuthor,
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
    // console.log("Comment report submitted:", {
    //   documentId,
    //   commentId,
    //   commentContent,
    //   commentAuthor,
    //   reasons: values.reasons,
    //   description: values.description,
    // });

    setLoading(true);

    try {
      // Sử dụng ReportService.createReport với cmtId
      const result = await ReportService.createReport({
        docId: documentId,
        cmtId: commentId, // Truyền thêm commentId
        type: values.reasons,
        reason: values.description || values.reasons.join(", "),
      });

      messageApi.success(
        result.message || "Báo cáo bình luận đã được gửi thành công!"
      );
      form.resetFields();
      setSelectedReasons([]);
      onClose();
    } catch (error) {
      console.error("Error submitting comment report:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi báo cáo bình luận. Vui lòng thử lại!";
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
            <span className="text-base font-semibold">Báo cáo bình luận</span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose={true}
        styles={{ body: { padding: 16 } }}
      >
        {/* Comment Info */}
        <div className="mb-3 px-3 py-2 bg-gray-50 rounded border">
          <div className="text-xs text-gray-500 mb-1">
            Bình luận được báo cáo:
          </div>
          <div className="text-xs text-gray-600 mb-1">
            <strong>Tác giả:</strong> {commentAuthor}
          </div>
          <div className="text-sm text-[var(--primary-text-color)] bg-white p-2 rounded border max-h-20 overflow-y-auto">
            {commentContent}
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
              className="w-full"
            >
              <div className="grid grid-cols-2 gap-2">
                {COMMENT_REPORT_REASONS.map((reason) => (
                  <Tooltip
                    key={reason.value}
                    title={reason.description}
                    placement="right"
                  >
                    <div className="border border-gray-100 rounded px-2 py-2 hover:border-[var(--link-color)] w-full transition-colors cursor-pointer bg-white">
                      <Checkbox value={reason.value} className="w-full">
                        <span className="text-[var(--primary-text-color)] text-xs font-medium">
                          {reason.label}
                        </span>
                        <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                          {reason.description}
                        </div>
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
              placeholder="Nhập mô tả chi tiết về vấn đề với bình luận này..."
              maxLength={300}
              showCount
              className="text-sm"
            />
          </Form.Item>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 rounded border cursor-pointer border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 hover:text-[var(--link-color)] rounded bg-[var(--primary-color)] hover:bg-white border hover:border-[var(--primary-color)] cursor-pointer text-white text-sm font-semibold transition-colors"
            >
              {loading ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </Form>

        {/* Warning Notice */}
        <div className="mt-4 px-3 py-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm text-gray-700">
          <b>Lưu ý:</b> Vui lòng chỉ báo cáo khi bạn chắc chắn bình luận này vi
          phạm quy định. Báo cáo sai sự thật có thể bị xử lý.
        </div>
      </Modal>
    </>
  );
};

export default CommentReportModal;
