import React, { useState, useEffect, useCallback } from "react";
import { Select, message, Modal, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SubjectService from "../../../utils/SubjectService";
import { OrganizationService } from "../../../utils/OrganizationService";
import type { Subject } from "../../../models/subject";
import type { OrganizationDetailed } from "../../../models/organization";
import SubjectTable from "../../../components/admin/subject/SubjectTable";
import SubjectForm from "../../../components/admin/subject/SubjectForm";
import SubjectViewModal from "../../../components/admin/subject/SubjectViewModal";

const { Option } = Select;

const ManageSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationDetailed[]>(
    []
  );
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();

  const loadSubjects = useCallback(async () => {
    if (!selectedOrganization) return;

    setLoading(true);
    try {
      const subjectsData = await SubjectService.getSubjectsByOrganization(
        selectedOrganization
      );
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error loading subjects:", error);
      message.error("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  }, [selectedOrganization]);

  // Load organizations on component mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  // Load subjects when organization changes
  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const loadOrganizations = async () => {
    try {
      const orgs = await OrganizationService.getOrganizations();
      setOrganizations(orgs);
    } catch (error) {
      console.error("Error loading organizations:", error);
      message.error("Không thể tải danh sách tổ chức");
    }
  };

  const handleAdd = () => {
    setEditingSubject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    form.setFieldsValue({
      name: subject.name,
      code: subject.code,
      description: subject.description,
    });
    setIsModalVisible(true);
  };

  const handleView = (subject: Subject) => {
    setViewingSubject(subject);
    setIsViewModalVisible(true);
  };

  const handleDelete = async (subjectId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa môn học này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await SubjectService.deleteSubject(subjectId);
          message.success("Xóa môn học thành công");
          loadSubjects();
        } catch (error) {
          console.error("Error deleting subject:", error);
          message.error("Không thể xóa môn học");
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingSubject) {
        // Update subject
        await SubjectService.updateSubject(editingSubject._id, {
          ...values,
          organization: selectedOrganization,
        });
        message.success("Cập nhật môn học thành công");
      } else {
        // Create subject
        await SubjectService.createSubject({
          ...values,
          organization: selectedOrganization,
        });
        message.success("Thêm môn học thành công");
      }

      setIsModalVisible(false);
      loadSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
      message.error("Có lỗi xảy ra");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setViewingSubject(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-xl xs:text-lg font-bold text-gray-900 mb-4 text-left">
          Quản lý môn học
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="sm:w-1/3">
            <div>
              <label className="block font-medium text-gray-700 mb-2 text-base sm:text-sm xs:text-xs">
                Chọn tổ chức
              </label>
              <Select
                placeholder="Chọn tổ chức"
                style={{ width: "100%" }}
                value={selectedOrganization}
                onChange={setSelectedOrganization}
                className="text-base sm:text-sm xs:text-xs"
              >
                {organizations.map((org) => (
                  <Option key={org._id} value={org._id}>
                    {org.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="sm:w-2/3 flex items-end justify-start">
            <button
              onClick={handleAdd}
              disabled={!selectedOrganization}
              className={`inline-flex items-center px-4 py-2 text-base sm:text-sm xs:text-xs font-medium rounded-md text-white ${
                selectedOrganization
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors duration-200`}
            >
              <PlusOutlined className="mr-2" />
              Thêm môn học
            </button>
          </div>
        </div>
      </div>

      <SubjectTable
        subjects={subjects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <SubjectForm
        visible={isModalVisible}
        editingSubject={editingSubject}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />

      <SubjectViewModal
        visible={isViewModalVisible}
        subject={viewingSubject}
        onCancel={handleViewModalCancel}
      />
    </div>
  );
};

export default ManageSubjectsPage;
