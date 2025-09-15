import React, { useState } from "react";
import { Button, Collapse, message } from "antd";
import SchoolSelection from "../../../components/accountActivation/SchoolSelection";
import SearchScopeInput from "../../../components/accountActivation/SearchScopeInput";
import { verifyUser } from "../../../utils/UserService";

const AccountActivation: React.FC = () => {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [fieldOfStudy, setFieldOfStudy] = useState<string>("");

  const handleSave = async () => {
    try {
      await verifyUser(organizationId, fieldOfStudy);
      message.success("Thông tin đã được lưu thành công!");
    } catch {
      message.error("Lưu thông tin thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-6 max-w-3xl text-left mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Bổ sung thông tin cá nhân
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Hãy cho chúng tôi biết về bạn để chúng tôi có thể đề xuất tài liệu học
        tập, tính năng mới và nhiều hơn nữa!
      </p>
      <Collapse defaultActiveKey={["1"]}>
        <Collapse.Panel header="Bạn học ở đâu?" key="1">
          <SchoolSelection onOrganizationChange={setOrganizationId} />
        </Collapse.Panel>
        <Collapse.Panel header="Nhập phạm vi tìm kiếm của bạn" key="2">
          <SearchScopeInput onFieldOfStudyChange={setFieldOfStudy} />
        </Collapse.Panel>
      </Collapse>
      <Button type="primary" className="mt-4 w-full" onClick={handleSave}>
        Lưu
      </Button>
    </div>
  );
};

export default AccountActivation;
