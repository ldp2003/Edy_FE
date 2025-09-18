import React, { useContext, useEffect, useState } from "react";
import UserProfileHeader from "../../../components/common/userInfo/UserProfileHeader";
import ResetPassword from "../../../components/common/userInfo/ResetPassword";
import StudyList from "../../../components/user/studyField/StudyList";
import { UserContext } from "../../../contexts/UserContext";
import { getOrganizations } from "../../../utils/OrganizationService";

const EditProfile: React.FC = () => {
  const { user } = useContext(UserContext);
  const [organizations, setOrganizations] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs.map((org) => org.name));
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="p-4 text-left">
      <div>
        <h2 className="font-bold text-sm mb-6">Cập nhật thông tin cá nhân</h2>
        <UserProfileHeader
          firstName={user?.first_name || "Chưa đặt tên"}
          lastName={user?.last_name || "Chưa đặt tên"}
          organization={
            typeof user?.organization === "string"
              ? user.organization || "Chưa có tổ chức"
              : user?.organization?.name || "Chưa có tổ chức"
          }
          email={user?.contact_email || ""}
          organizationOptions={organizations}
        />
      </div>
      <div className="mt-8 flex flex-row">
        <div className="w-1/2 pr-2 flex flex-col gap-4">
          <div className="font-bold text-sm">Cập nhật mật khẩu</div>
          <ResetPassword />
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
