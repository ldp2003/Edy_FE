/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Select, Avatar, message } from "antd";
import { RoleService } from "../../../utils/RoleService";
import { ROLE_DISPLAY_NAMES } from "../../../constants/RoleConstants";
import { AssignmentService } from "../../../utils/AssignmentService";
import { UserService } from "../../../utils/UserService";
import { NotificationService } from "../../../utils/NotificationService";

interface AssignRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  selectedAccount?: {
    _id: string;
    user: {
      _id: string;
      fullname: string;
      avatar: string;
    };
  };
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  selectedAccount,
}) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = useCallback(async () => {
    try {
      // Fetch roles
      const rolesResponse = await RoleService.getAllRoles(true);
      setRoles(rolesResponse);

      if (!selectedAccount) {
        // Fetch users only if no account is selected
        const usersResponse = await UserService.getAllUsers();
        // Handle different response formats - could be array or {data: array} or {users: array}
        const usersData = Array.isArray(usersResponse)
          ? usersResponse
          : usersResponse?.data || usersResponse?.users || [];
        setUsers(usersData);
      }

      // Fetch subjects
      // const subjectsResponse = await SubjectService.get();
      // setSubjects(subjectsResponse);

      // Fetch organizations - commented out
      // const orgsResponse = await OrganizationService.getOrganizations();
      // setOrganizations(orgsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, fetchData]);

  const handleSubmit = async (values: any) => {
    try {
      const accountId = selectedAccount ? selectedAccount._id : values.account;
      await AssignmentService.createAssignment({
        account: accountId,
        role: values.role,
        subject: values.subject,
        organization: values.organization,
      });

      // Send notification to user
      const userId = selectedAccount
        ? selectedAccount.user._id
        : values.account;
      if (userId) {
        const role = roles.find((r) => r._id === values.role);
        const roleName = role
          ? ROLE_DISPLAY_NAMES[role.name] || role.name
          : "không xác định";
        try {
          await NotificationService.createSystemNotification(
            userId,
            `Bạn đã được gán vai trò ${roleName} trong hệ thống.`
          );
        } catch (notifError) {
          console.error("Error sending notification:", notifError);
          // Don't fail the whole operation if notification fails
        }
      }

      messageApi.success("Tạo phân quyền thành công");
      onSuccess();
      form.resetFields();
    } catch (error: any) {
      messageApi.error(
        error.response?.data?.message || "Không thể tạo phân quyền"
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={selectedAccount ? "Thêm vai trò" : "Gán quyền cho người dùng"}
        open={visible}
        onCancel={onCancel}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {!selectedAccount && (
            <Form.Item
              name="account"
              label="Người dùng"
              rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
            >
              <Select
                showSearch
                placeholder="Chọn người dùng"
                optionFilterProp="label"
              >
                {users.map((user) => (
                  <Select.Option
                    key={user._id}
                    value={user._id}
                    label={`${user.first_name} ${user.last_name}`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar src={user.avatar} />
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                          {user.organization && (
                            <span className="text-gray-500 text-xs ml-1">
                              ({user.organization.name})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

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

export default AssignRoleModal;
