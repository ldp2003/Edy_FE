import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { PERMISSIONS } from "../../../constants/PermissionConstants.ts";
import { RoleService } from "../../../utils/RoleService";

interface CreateRoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSelectedPermissions([]);
    }
  }, [visible, form]);

  const handlePermissionChange = (values: string[]) => {
    if (values.includes("ALL")) {
      // Nếu chọn ALL, chọn tất cả permission codes
      const allPermissionCodes = Object.keys(PERMISSIONS);
      setSelectedPermissions(allPermissionCodes);
      form.setFieldsValue({ permissions: allPermissionCodes });
    } else {
      setSelectedPermissions(values);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await RoleService.createRole({
        name: values.name,
        description: values.description,
        permissions: selectedPermissions, // Gửi mã quyền thay vì tên hiển thị
      });

      message.success("Tạo quyền mới thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating role:", error);
      message.error("Có lỗi xảy ra khi tạo quyền mới!");
    }
  };

  return (
    <Modal
      title="Tạo quyền mới"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Tạo mới"
      cancelText="Hủy"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          permissions: [],
        }}
      >
        <Form.Item
          name="name"
          label="Tên quyền"
          rules={[
            { required: true, message: "Vui lòng nhập tên quyền" },
            { max: 100, message: "Tên quyền không được quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên quyền" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả" },
            { max: 500, message: "Mô tả không được quá 500 ký tự" },
          ]}
        >
          <Input.TextArea placeholder="Nhập mô tả cho quyền" rows={4} />
        </Form.Item>

        <Form.Item
          name="permissions"
          label="Quyền hạn"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất một quyền" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn quyền hạn"
            onChange={handlePermissionChange}
            value={selectedPermissions}
            style={{ width: "100%" }}
            optionFilterProp="label"
          >
            {Object.entries(PERMISSIONS).map(([key, value]) => (
              <Select.Option key={key} value={key} label={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoleModal;
