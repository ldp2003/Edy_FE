import React from "react";
import { Modal, Form, Input } from "antd";
import type { Subject } from "../../../models/subject";

interface SubjectFormProps {
  visible: boolean;
  editingSubject: Subject | null;
  onOk: () => void;
  onCancel: () => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  visible,
  editingSubject,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editingSubject) {
      form.setFieldsValue({
        name: editingSubject.name,
        code: editingSubject.code,
        description: editingSubject.description,
      });
    } else {
      form.resetFields();
    }
  }, [editingSubject, form]);

  return (
    <Modal
      title={editingSubject ? "Sửa môn học" : "Thêm môn học"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingSubject ? "Cập nhật" : "Thêm"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên môn học"
          rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
        >
          <Input placeholder="Nhập tên môn học" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Mã môn học"
          rules={[{ required: true, message: "Vui lòng nhập mã môn học" }]}
        >
          <Input placeholder="Nhập mã môn học" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Nhập mô tả môn học" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectForm;
