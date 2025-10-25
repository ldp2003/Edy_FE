/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Avatar } from "antd";
import { RoleService } from "../../../utils/RoleService";
import { ROLE_DISPLAY_NAMES } from "../../../constants/RoleConstants";
import { AssignmentService } from "../../../utils/AssignmentService";
import { UserService } from "../../../utils/UserService";
import { OrganizationService } from "../../../utils/OrganizationService";
import { message } from "antd";

interface AssignRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  selectedAccount?: {
    _id: string;
    user: {
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
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  const fetchData = async () => {
    try {
      // Fetch roles
      const rolesResponse = await RoleService.getAllRoles(true);
      setRoles(rolesResponse);

      if (!selectedAccount) {
        // Fetch users only if no account is selected
        const usersResponse = await UserService.getAllUsers();
        setUsers(usersResponse);
      }

      // Fetch subjects
      // const subjectsResponse = await SubjectService.get();
      // setSubjects(subjectsResponse);

      // Fetch organizations
      const orgsResponse = await OrganizationService.getOrganizations();
      setOrganizations(orgsResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const accountId = selectedAccount ? selectedAccount._id : values.account;
      await AssignmentService.createAssignment({
        account: accountId,
        role: values.role,
        subject: values.subject,
        organization: values.organization,
      });
      messageApi.success("Tạo phân quyền thành công");
      onSuccess();
      form.resetFields();
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "Không thể tạo phân quyền");
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
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
              {users.map(user => (
                <Select.Option
                  key={user._id}
                  value={user._id}
                  label={user.first_name + " " + user.last_name}
                >
                  <div className="flex items-start">
                    <Avatar size="large" src={user.avatar} className="mr-3" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.first_name + " " + user.last_name}
                        {user.organization && (
                          <span className="text-gray-500 ml-2">({user.organization.name})</span>
                        )}
                      </span>
                      <span className="text-gray-400 text-sm">ID: {user._id}</span>
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
            {roles.map(role => (
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

        <Form.Item
          name="organization"
          label="Tổ chức"
        >
          <Select
            showSearch
            placeholder="Chọn tổ chức"
            optionFilterProp="label"
            allowClear
          >
            {organizations.map(org => (
              <Select.Option
                key={org._id}
                value={org._id}
                label={org.name}
              >
                {org.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
};

export default AssignRoleModal;