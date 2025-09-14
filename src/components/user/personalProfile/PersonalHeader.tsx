import React from "react";
import PersonalAvatar from "./PersonalAvatar";
import PersonalInfo from "./PersonalInfo";

const PersonalHeader: React.FC = () => {
  return (
    <div className="flex flex-row items-center w-full justify-between">
      <PersonalAvatar></PersonalAvatar>
      <PersonalInfo></PersonalInfo>
    </div>
  );
};

export default PersonalHeader;
