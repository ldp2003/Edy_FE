import React, { useEffect, useState } from "react";
import {
  Modal,
  Tag,
  Avatar,
  Divider,
  Button,
  Form,
  Checkbox,
  Input,
  Radio,
  message,
} from "antd";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import type { Report } from "../../../models/report";
import {
  REPORT_TYPE_OPTIONS,
  getReportStatusLabel,
} from "../../../utils/reportTypeUtils";

interface AdminReportDetailModalProps {
  report: Report | null;
  visible: boolean;
  onClose: () => void;
  onResolve?: (params: {
    validTypes: string[];
    action: string;
    resolveReason: string;
  }) => void;
}

const AdminReportDetailModal: React.FC<AdminReportDetailModalProps> = ({
  report,
  visible,
  onClose,
  onResolve,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Tính toán an toàn khi report có thể null
  const initialTypes = Array.isArray(report?.type) ? (report?.type as string[]) : [];
  const docObj = typeof report?.doc === "object" ? report!.doc : null;
  const cmtObj = typeof report?.cmt === "object" ? report!.cmt : null;
  const isCommentReport = !!cmtObj;

  // Đồng bộ form khi mở modal hoặc report thay đổi
  useEffect(() => {
    if (!visible || !report) return;
    form.resetFields();
    form.setFieldsValue({
      validTypes: initialTypes,
      action: "DELETE",
      resolveReason: "",
    });
  }, [visible, report?._id, form]);

  // Đảm bảo action hợp lệ theo loại report (document/comment)
  useEffect(() => {
    if (!visible) return;
    const allowedActions = isCommentReport
      ? ["DELETE", "FALSE_REPORT"]
      : ["DELETE", "EDIT_REQUESTED", "FALSE_REPORT"];
    const currAction = (form.getFieldValue("action") as string) || "DELETE";
    if (!allowedActions.includes(currAction)) {
      form.setFieldsValue({ action: "DELETE" });
    }
  }, [visible, isCommentReport, form]);

  if (!report) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={640}
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-500" />
          <span className="text-lg font-semibold">Xử lý báo cáo</span>
          <Tag
            color={report.status === "PROCESSING" ? "blue" : "green"}
            className="ml-2"
          >
            {getReportStatusLabel(report.status)}
          </Tag>
        </div>
      }
      onOk={() => form.submit()}
      okText="Xác nhận xử lý"
      confirmLoading={confirmLoading}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={() => form.submit()}
          loading={confirmLoading}
        >
          Xác nhận xử lý
        </Button>,
      ]}
    >
      {/* Thông tin tóm tắt */}
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-4">
            <Avatar
              src={
                typeof report.reporter === "object"
                  ? report.reporter.avatar
                  : undefined
              }
              size={40}
              icon={<UserOutlined />}
              className="border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <div className="font-medium text-base">
                {typeof report.reporter === "object"
                  ? `${report.reporter.last_name} ${report.reporter.first_name}`
                  : "Người dùng"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {docObj ? `Tài liệu: ${docObj.title}` : "Tài liệu: Không rõ"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Lý do báo cáo: </span>
                {report.reason}
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Form duyệt báo cáo */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            validTypes: initialTypes,
            action: "DELETE",
            resolveReason: "",
          }}
          onFinish={async (values) => {
            setConfirmLoading(true);
            try {
              await Promise.resolve(
                onResolve?.({
                  validTypes: values.validTypes || [],
                  action: values.action,
                  resolveReason: values.resolveReason || "",
                })
              );
              message.success("Xử lý báo cáo thành công");
              form.resetFields();
              onClose();
            } catch (err) {
              message.error("Có lỗi khi xử lý báo cáo, vui lòng thử lại");
            } finally {
              setConfirmLoading(false);
            }
          }}
        >
          <Form.Item
            name="validTypes"
            label="Chọn các loại vi phạm thực sự"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một loại vi phạm",
              },
            ]}
          >
            <Checkbox.Group>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_TYPE_OPTIONS.map((opt) => (
                  <Checkbox key={opt.value} value={opt.value}>
                    {opt.label}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="action"
            label="Hành động"
            rules={[{ required: true, message: "Vui lòng chọn hành động" }]}
          >
            <Radio.Group>
              <Radio value="DELETE">Gỡ nội dung</Radio>
              {!isCommentReport && (
                <Radio value="EDIT_REQUESTED">Yêu cầu chỉnh sửa</Radio>
              )}
              <Radio value="FALSE_REPORT">Giữ lại (Báo cáo sai)</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="resolveReason"
            label="Lý do xử lý"
            rules={[{ required: true, message: "Vui lòng nhập lý do xử lý" }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn lý do xử lý" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AdminReportDetailModal;