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
    <div className="p-4 text-center md:text-left">
      {contextHolder}
      <div className="bg-white p-6 rounded-lg border border-[var(--border-color)]">
        <h2 className="font-bold text-xs md:text-sm mb-6">
          Cập nhật thông tin cá nhân
        </h2>
        <UserProfileHeader
          firstName={user?.first_name || "Chưa đặt tên"}
          lastName={user?.last_name || "Chưa đặt tên"}
          organization={
            typeof user?.organization === "object" && user?.organization?._id
              ? { _id: user.organization._id, name: user.organization.name }
              : typeof user?.organization === "string"
              ? user.organization
              : "Chưa có tổ chức"
          }
          email={user?.contact_email || ""}
          organizationOptions={organizations}
          messageApi={messageApi}
          avatar={user?.avatar || ""}
        />
      </div>
      <div className="mt-8 flex flex-col lg:flex-row bg-white p-6 rounded-lg border border-[var(--border-color)]">
        <div className="w-full lg:w-1/2 lg:pr-2 flex flex-col gap-4">
          <div className="font-bold text-xs md:text-sm">Cập nhật mật khẩu</div>
          <ResetPassword messageApi={messageApi} />
        </div>
        <div className="w-full lg:w-1/2 lg:pl-2 flex flex-col gap-4">
          <div className="font-bold text-xs md:text-sm">Phạm vi tìm kiếm</div>

          <StudyList fieldOfStudy={user?.field_of_study || []} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
