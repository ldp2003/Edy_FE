import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Modal, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { OrganizationService } from "../../../utils/OrganizationService";
import type { OrganizationDetailed } from "../../../models/organization";
import OrganizationTable from "../../../components/admin/organization/OrganizationTable";
import OrganizationForm from "../../../components/admin/organization/OrganizationForm";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const ManageOrganizationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<OrganizationDetailed[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [editingOrganization, setEditingOrganization] =
    useState<OrganizationDetailed | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    try {
      const params: {
        search?: string;
      } = {};
      if (searchText.trim()) {
        params.search = searchText.trim();
      }
      const orgs = await OrganizationService.getOrganizations(params);
      setOrganizations(orgs);
    } catch (error) {
      console.error("Error loading organizations:", error);
      messageApi.error("Không thể tải danh sách tổ chức");
    } finally {
      setLoading(false);
    }
  }, [messageApi, searchText]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]); // Load on mount and when loadOrganizations changes

  const handleAdd = () => {
    setEditingOrganization(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (organization: OrganizationDetailed) => {
    setEditingOrganization(organization);
    form.setFieldsValue({
      name: organization.name,
      code: organization.code,
      description: organization.description,
      country: organization.country,
      address: organization.address,
      website: organization.website,
    });
    setIsModalVisible(true);
  };

  const handleView = (organization: OrganizationDetailed) => {
    navigate(`/admin/organizations/${organization._id}`);
  };

  const handleDelete = async (organizationId: string) => {
    const organization = organizations.find(
      (org) => org._id === organizationId
    );
    const organizationName = organization?.name || "tổ chức này";

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa tổ chức "${organizationName}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await OrganizationService.deleteOrganization(organizationId);
          messageApi.success(`Xóa tổ chức "${organizationName}" thành công`);
          loadOrganizations();
        } catch (error) {
          console.error("Error deleting organization:", error);
          messageApi.error("Không thể xóa tổ chức");
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingOrganization) {
        // Update organization
        await OrganizationService.updateOrganization(
          editingOrganization._id!,
          values
        );
        messageApi.success(
          `Cập nhật thông tin tổ chức "${editingOrganization.name}" thành công`
        );
      } else {
        // Create organization
        await OrganizationService.createOrganization(values);
        messageApi.success(`Thêm tổ chức "${values.name}" thành công`);
      }

      setIsModalVisible(false);
      loadOrganizations();
    } catch (error) {
      console.error("Error saving organization:", error);
      messageApi.error("Có lỗi xảy ra");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      {contextHolder}
      <AdminBreadcrumb
        items={[
          { label: "Admin", path: "/admin" },
          { label: "Quản lý người dùng", path: "/admin/organizations" },
          { label: "Tổ chức" },
        ]}
      />
      <div className="mt-4">
        <div className="mb-4">
          <h1 className="text-xl sm:text-lg xs:text-base font-bold text-[var(--primary-text-color)] mb-4 text-left">
            Quản lý tổ chức
          </h1>

          <div className="mb-3 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Tìm kiếm tổ chức theo tên hoặc mã..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="text-sm sm:text-sm xs:text-xs"
              />
              <button
                onClick={loadOrganizations}
                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-xs xs:text-xs font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 transition-colors duration-200"
              >
                <SearchOutlined className="mr-1.5" />
                Tìm kiếm
              </button>
            </div>
            <div className="flex justify-start">
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-xs xs:text-xs font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 transition-colors duration-200"
              >
                <PlusOutlined className="mr-1.5" />
                Thêm tổ chức
              </button>
            </div>
          </div>
        </div>

        <OrganizationTable
          organizations={organizations}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />

        <OrganizationForm
          visible={isModalVisible}
          editingOrganization={editingOrganization}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          form={form}
        />
      </div>
    </div>
  );
};

export default ManageOrganizationsPage;
