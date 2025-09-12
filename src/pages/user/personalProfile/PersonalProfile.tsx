import React from "react";
import PersonalHeader from "../../../components/user/personalProfile/PersonalHeader";
import ChartProfile from "../../../components/user/personalProfile/ChartProfile";
import ProfileTab from "../../../components/user/personalProfile/ProfileTab";

const PersonalProfile: React.FC = () => {
  return (
    <div className="">
      <PersonalHeader></PersonalHeader>
      <div className="flex w-full flex-row mt-6 gap-6">
        <div className="w-1/4">
          <ChartProfile></ChartProfile>
        </div>
        <div className="w-3/4">
          <ProfileTab></ProfileTab>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
