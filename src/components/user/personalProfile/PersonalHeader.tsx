import React from "react";
import PersonalAvatar from "./PersonalAvatar";
import PersonalInfo from "./PersonalInfo";

const PersonalHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-center w-full justify-between gap-4 md:gap-0">
      <PersonalAvatar></PersonalAvatar>
      <PersonalInfo></PersonalInfo>
    </div>
  );
};

export default PersonalHeader;
