import React from "react";
import PersonalHeader from "../../../components/user/personalProfile/PersonalHeader";
import ChartProfile from "../../../components/user/personalProfile/ChartProfile";
import ProfileTab from "../../../components/user/personalProfile/ProfileTab";

const PersonalProfile: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 border border-[var(--border-color)]">
      <PersonalHeader></PersonalHeader>
      <div className="flex w-full flex-col xl:flex-row mt-8 gap-6">
        <div className="w-full xl:w-1/4">
          <ChartProfile></ChartProfile>
        </div>
        <div className="w-full xl:w-3/4">
          <ProfileTab></ProfileTab>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
