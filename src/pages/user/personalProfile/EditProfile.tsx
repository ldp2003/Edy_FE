import React, { useContext, useEffect, useState } from "react";
import UserProfileHeader from "../../../components/common/userInfo/UserProfileHeader";
import ResetPassword from "../../../components/common/userInfo/ResetPassword";
import StudyList from "../../../components/user/studyField/StudyList";
import { UserContext } from "../../../contexts/UserContext";
import { OrganizationService } from "../../../utils/OrganizationService";
import type { OrganizationDetailed } from "../../../models/organization";
import { message } from "antd";

const EditProfile: React.FC = () => {
  const { user } = useContext(UserContext);
  const [organizations, setOrganizations] = useState<OrganizationDetailed[]>(
    []
  );
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await OrganizationService.getOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="p-4 text-left">
      {contextHolder}
      <div>
        <h2 className="font-bold text-sm mb-6">Cập nhật thông tin cá nhân</h2>
        <UserProfileHeader
          firstName={user?.first_name || "Chưa đặt tên"}
          lastName={user?.last_name || "Chưa đặt tên"}
          organization={user?.organization || "Chưa có tổ chức"}
          email={user?.contact_email || ""}
          organizationOptions={organizations}
          messageApi={messageApi}
          avatar={user?.avatar || ""}
        />
      </div>
      <div className="mt-8 flex flex-row">
        <div className="w-1/2 pr-2 flex flex-col gap-4">
          <div className="font-bold text-sm">Cập nhật mật khẩu</div>
          <ResetPassword messageApi={messageApi} />
        </div>
        <div className="w-1/2 pl-2 flex flex-col gap-4">
          <div className="font-bold text-sm">Phạm vi tìm kiếm</div>

          <StudyList fieldOfStudy={user?.field_of_study || []} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
