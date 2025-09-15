import React from "react";
import UserProfileHeader from "../../../components/common/userInfo/UserProfileHeader";
import ResetPassword from "../../../components/common/userInfo/ResetPassword";
import StudyList from "../../../components/user/studyField/StudyList";

const EditProfile: React.FC = () => {
  return (
    <div className="p-4 text-left">
      <UserProfileHeader></UserProfileHeader>
      <div className="mt-8 flex flex-row">
        <div className="w-1/2 pr-2 flex flex-col gap-4">
          <div className="font-bold text-xl">Cập nhật mật khẩu</div>
          <ResetPassword></ResetPassword>
        </div>
        <div className="w-1/2 pl-2 flex flex-col gap-4">
          <div className="font-bold text-xl">Phạm vi tìm kiếm</div>

          <StudyList></StudyList>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
