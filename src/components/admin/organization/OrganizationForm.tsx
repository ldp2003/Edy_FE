import React from "react";
import { Modal, Form, Input, Row, Col } from "antd";
import type { FormInstance } from "antd";
import type { OrganizationDetailed } from "../../../models/organization";

interface OrganizationFormProps {
  visible: boolean;
  editingOrganization: OrganizationDetailed | null;
  onOk: () => void;
  onCancel: () => void;
  form: FormInstance;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  visible,
  editingOrganization,
  onOk,
  onCancel,
  form,
}) => {
  React.useEffect(() => {
    if (editingOrganization) {
      form.setFieldsValue({
        name: editingOrganization.name,
        code: editingOrganization.code,
        description: editingOrganization.description,
        country: editingOrganization.country,
        address: editingOrganization.address,
        website: editingOrganization.website,
      });
    } else {
      form.resetFields();
    }
  }, [editingOrganization, form]);

  return (
    <Modal
      title={editingOrganization ? "Sửa tổ chức" : "Thêm tổ chức"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingOrganization ? "Cập nhật" : "Thêm"}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên tổ chức"
              rules={[{ required: true, message: "Vui lòng nhập tên tổ chức" }]}
            >
              <Input placeholder="Nhập tên tổ chức" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã tổ chức"
              rules={[{ required: true, message: "Vui lòng nhập mã tổ chức" }]}
            >
              <Input placeholder="Nhập mã tổ chức" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Nhập mô tả tổ chức" rows={2} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="country"
              label="Quốc gia"
              rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
            >
              <Input placeholder="Nhập quốc gia" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="website"
          label="Website"
          rules={[{ required: true, message: "Vui lòng nhập website" }]}
        >
          <Input placeholder="Nhập website" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrganizationForm;
