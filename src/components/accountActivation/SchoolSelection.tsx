import React, { useState, useEffect } from "react";
import { AutoComplete, Modal } from "antd";
import InsertOrganization from "../user/organization/InsertOrganization";
import { OrganizationService } from "../../utils/OrganizationService";

const SchoolSelection: React.FC<{
  onOrganizationChange: (id: string) => void;
}> = ({ onOrganizationChange }) => {
  const [schoolOptions, setSchoolOptions] = useState<
    { value: string; id: string }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const organizations = await OrganizationService.getOrganizations();
        // console.log("Fetched organizations in SchoolSelection:", organizations);
        if (Array.isArray(organizations)) {
          const options = organizations
            .filter((org) => org._id)
            .map((org) => ({
              value: org.name,
              id: org._id!,
            }));
          setSchoolOptions(options);
        } else {
          console.error("Expected an array but received:", organizations);
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      }
    };

    fetchSchools();
  }, []);

  const handleSelect = (value: string) => {
    const selected = schoolOptions.find((option) => option.value === value);
    if (selected) {
      onOrganizationChange(selected.id);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <label className="block text-gray-700 text-lg font-bold mb-2">
          Tôi học tại
        </label>
        <a onClick={showModal} className="text-blue-500 hover:underline">
          Không tìm thấy trường của bạn? Thêm ở đây
        </a>
      </div>

      <AutoComplete
        options={schoolOptions.map((option) => ({ value: option.value }))}
        style={{ width: "100%" }}
        placeholder="Chọn hoặc nhập tên trường của bạn"
        onSelect={handleSelect}
      />

      <Modal
        title="Thêm Tổ chức/Trường"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <InsertOrganization />
      </Modal>
    </div>
  );
};

export default SchoolSelection;
