import React, { useState, useEffect, useCallback } from "react";
import { Select, message, Modal, Form, Input } from "antd";
import { PlusOutlined, SyncOutlined, SearchOutlined } from "@ant-design/icons";
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
  const [syncAllLoading, setSyncAllLoading] = useState(false);
  const [syncingSubjects, setSyncingSubjects] = useState<Set<string>>(
    new Set()
  );
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const loadSubjects = useCallback(async () => {
    // If searching, use search API regardless of organization selection
    if (searchText.trim()) {
      setLoading(true);
      try {
        const subjectsData = await SubjectService.searchSubjects(
          searchText.trim()
        );
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error searching subjects:", error);
        message.error("Không thể tìm kiếm môn học");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Otherwise, load by organization if selected
    if (!selectedOrganization) {
      setSubjects([]);
      return;
    }

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
  }, [selectedOrganization, searchText]);

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

  const handleSync = async (subjectId: string) => {
    // Add to syncing set
    setSyncingSubjects((prev) => new Set(prev).add(subjectId));

    try {
      const result = await SubjectService.syncSubjectDocCount(subjectId);
      if (result.old_count !== undefined && result.new_count !== undefined) {
        message.success(
          `Đã đồng bộ: ${result.old_count} → ${result.new_count} tài liệu`
        );
      } else {
        message.success("Số lượng tài liệu đã chính xác");
      }
      loadSubjects(); // Reload để cập nhật số lượng
    } catch (error) {
      console.error("Error syncing subject document count:", error);
      message.error("Không thể đồng bộ số lượng tài liệu");
    } finally {
      // Remove from syncing set
      setSyncingSubjects((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subjectId);
        return newSet;
      });
    }
  };

  const handleSyncAll = async () => {
    setSyncAllLoading(true);
    try {
      const result = await SubjectService.syncAllSubjectsDocCount();
      message.success(
        `Đã đồng bộ ${result.updated_subjects}/${result.total_subjects} môn học`
      );
      loadSubjects(); // Reload để cập nhật số lượng
    } catch (error) {
      console.error("Error syncing all subjects document count:", error);
      message.error("Không thể đồng bộ số lượng tài liệu");
    } finally {
      setSyncAllLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl sm:text-lg xs:text-base font-bold text-[var(--primary-text-color)] mb-4 text-left">
          Quản lý môn học
        </h1>

        <div className="flex flex-col gap-3 mb-3">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Tìm kiếm môn học theo tên hoặc mã..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="text-sm sm:text-sm xs:text-xs"
            />
            <button
              onClick={loadSubjects}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-xs xs:text-xs font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 transition-colors duration-200"
            >
              <SearchOutlined className="mr-1.5" />
              Tìm kiếm
            </button>
          </div>

          {!searchText.trim() && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-1/3">
                <div>
                  <label className="block text-left font-medium text-[var(--primary-text-color)] mb-2 text-sm sm:text-sm xs:text-xs">
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
              <div className="sm:w-2/3 flex items-end justify-start gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!selectedOrganization}
                  className={`inline-flex items-center px-3 py-1.5 text-xs sm:text-xs xs:text-xs font-medium rounded-md text-white ${
                    selectedOrganization
                      ? "bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
                      : "bg-[var(--third-color)] cursor-not-allowed"
                  } transition-colors duration-200`}
                >
                  <PlusOutlined className="mr-1.5" />
                  Thêm môn học
                </button>
                <button
                  onClick={handleSyncAll}
                  disabled={!selectedOrganization || syncAllLoading}
                  className={`inline-flex items-center px-3 py-1.5 text-xs sm:text-xs xs:text-xs font-medium rounded-md text-white ${
                    selectedOrganization && !syncAllLoading
                      ? "bg-[var(--green-button-color)] hover:bg-[var(--green-button-color)] focus:ring-2 focus:ring-[var(--green-button-color)] focus:ring-offset-2"
                      : "bg-[var(--third-color)] cursor-not-allowed"
                  } transition-colors duration-200`}
                >
                  {syncAllLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                  ) : (
                    <SyncOutlined className="mr-1.5" />
                  )}
                  {syncAllLoading ? "Đang đồng bộ..." : "Đồng bộ tất cả"}
                </button>
              </div>
            </div>
          )}

          {searchText.trim() && (
            <div className="text-sm text-[var(--secondary-text-color)]">
              Hiển thị kết quả tìm kiếm cho: <strong>"{searchText}"</strong>
            </div>
          )}
        </div>
      </div>

      <SubjectTable
        subjects={subjects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onSync={handleSync}
        syncingSubjects={syncingSubjects}
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
