/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, message } from "antd";
import { RoleService } from "../../../utils/RoleService";
import { ROLE_DISPLAY_NAMES } from "../../../constants/RoleConstants";
import { AssignmentService } from "../../../utils/AssignmentService";
import { NotificationService } from "../../../utils/NotificationService";

interface EditRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  assignment?: {
    _id: string;
    account: {
      user: {
        id: string;
      };
    };
    role: {
      _id: string;
      name: string;
    };
    subject?: {
      _id: string;
      name: string;
    };
    organization?: {
      _id: string;
      name: string;
    };
  } | null;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  assignment,
}) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (visible && assignment) {
      fetchData();
      form.setFieldsValue({
        role: assignment.role._id,
        subject: assignment.subject?._id,
        organization: assignment.organization?._id,
      });
    }
  }, [visible, assignment, form]);

  const fetchData = async () => {
    try {
      // Fetch roles
      const rolesResponse = await RoleService.getAllRoles(true);
      setRoles(rolesResponse);

      // Fetch subjects
      // const subjectsResponse = await SubjectService.get();
      // setSubjects(subjectsResponse);

      // Fetch organizations - commented out
      // const orgsResponse = await OrganizationService.getOrganizations();
      // setOrganizations(orgsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!assignment) return;

    try {
      await AssignmentService.updateAssignment(assignment._id, {
        role: values.role,
        subject: values.subject,
        organization: values.organization,
      });

      // Send notification to user
      const userId = assignment.account.user.id;
      if (userId) {
        const role = roles.find((r) => r._id === values.role);
        const roleName = role
          ? ROLE_DISPLAY_NAMES[role.name] || role.name
          : "không xác định";
        try {
          await NotificationService.createSystemNotification(
            userId,
            `Vai trò của bạn đã được cập nhật thành ${roleName}.`
          );
        } catch (notifError) {
          console.error("Error sending notification:", notifError);
          // Don't fail the whole operation if notification fails
        }
      }

      messageApi.success("Cập nhật phân quyền thành công");
      onSuccess();
      form.resetFields();
    } catch (error: any) {
      console.error("Error updating assignment:", error);
      messageApi.error(
        error.response?.data?.message || "Không thể cập nhật phân quyền"
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Chỉnh sửa phân quyền"
        open={visible}
        onCancel={onCancel}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select
              showSearch
              placeholder="Chọn vai trò"
              optionFilterProp="label"
            >
              {roles.map((role) => (
                <Select.Option
                  key={role._id}
                  value={role._id}
                  label={ROLE_DISPLAY_NAMES[role.name] || role.name}
                >
                  {ROLE_DISPLAY_NAMES[role.name] || role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="subject"
            label="Môn học"
          >
            <Select
              showSearch
              placeholder="Chọn môn học"
              optionFilterProp="label"
              allowClear
            >
              {subjects.map(subject => (
                <Select.Option 
                  key={subject._id} 
                  value={subject._id}
                  label={subject.name}
                >
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export default EditRoleModal;
