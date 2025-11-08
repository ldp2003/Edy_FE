import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { PERMISSIONS } from "../../../constants/PermissionConstants.ts";
import { RoleService } from "../../../utils/RoleService";

interface EditRoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: {
    _id: string;
    name: string;
    description: string;
    permissions: string[];
  } | null;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  visible,
  onClose,
  onSuccess,
  role,
}) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (visible && role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
      setSelectedPermissions(role.permissions);
    }
  }, [visible, role, form]);

  const handlePermissionChange = (values: string[]) => {
    if (values.includes("ALL")) {
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
      if (!role?._id) return;

      await RoleService.updateRole(role._id, {
        name: values.name,
        description: values.description,
        permissions: selectedPermissions,
      });

      messageApi.success("Cập nhật quyền thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating role:", error);
      messageApi.error("Có lỗi xảy ra khi cập nhật quyền!");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Chỉnh sửa quyền"
        open={visible}
        onCancel={onClose}
        onOk={handleSubmit}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
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
    </>
  );
};

export default EditRoleModal;
