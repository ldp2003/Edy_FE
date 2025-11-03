import React, { useState, useEffect, useCallback } from "react";
import { message, Form, Modal, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { OrganizationService } from "../../../utils/OrganizationService";
import type { OrganizationDetailed } from "../../../models/organization";
import OrganizationTable from "../../../components/admin/organization/OrganizationTable";
import OrganizationForm from "../../../components/admin/organization/OrganizationForm";
import OrganizationViewModal from "../../../components/admin/organization/OrganizationViewModal";

const ManageOrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationDetailed[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [editingOrganization, setEditingOrganization] =
    useState<OrganizationDetailed | null>(null);
  const [viewingOrganization, setViewingOrganization] =
    useState<OrganizationDetailed | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
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
  }, [searchText, messageApi]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrganizations();
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchText, loadOrganizations]);

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
    setViewingOrganization(organization);
    setIsViewModalVisible(true);
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

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setViewingOrganization(null);
  };

  return (
    <div>
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-xl xs:text-lg font-bold text-gray-900 mb-4 text-left">
          Quản lý tổ chức
        </h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm tổ chức theo tên hoặc mã..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={loadOrganizations}
              allowClear
              className="text-base sm:text-sm xs:text-xs"
            />
          </div>
          <div className="flex justify-start">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 text-base sm:text-sm xs:text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <PlusOutlined className="mr-2" />
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

      <OrganizationViewModal
        visible={isViewModalVisible}
        organization={viewingOrganization}
        onCancel={handleViewModalCancel}
      />
    </div>
  );
};

export default ManageOrganizationsPage;
