import React from "react";
import PersonalHeader from "../../../components/user/personalProfile/PersonalHeader";
import ChartProfile from "../../../components/user/personalProfile/ChartProfile";

const PersonalProfile: React.FC = () => {
  return (
    <div className="">
      <PersonalHeader></PersonalHeader>
      <ChartProfile></ChartProfile>
    </div>
  );
};

export default PersonalProfile;
