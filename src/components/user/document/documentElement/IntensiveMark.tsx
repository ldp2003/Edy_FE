import React from "react";

type IntensiveMarkProps = {
  label: string;
};

const IntensiveMark: React.FC<IntensiveMarkProps> = ({ label }) => {
  return (
    <div
      className="flex items-center t border unded-full px-4 py-[1px] rounded-full text-[10px] font-bold w-fit"
      style={{
        color: "var(--intensive-color)",
        borderColor: "var(--intensive-color)",
      }}
    >
      <span>{label}</span>
    </div>
  );
};

export default IntensiveMark;
