import React from "react";
import { User } from "lucide-react";

type UserNameProps = {
  userName: string;
};

const UserName: React.FC<UserNameProps> = ({ userName }) => {
  return (
    <div className="flex items-center justify-center bg-[var(--third-background-color)] text-[var(--primary-text-color)] rounded-full px-4 py-[1px] text-[10px] font-bold w-fit mx-auto">
      <User size={12} />
      <span className="ml-2 align-middle">{userName}</span>
    </div>
  );
};

export default UserName;
