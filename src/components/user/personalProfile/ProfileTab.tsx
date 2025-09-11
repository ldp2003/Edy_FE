import React, { useState } from "react";
import RecentDocument from "../document/RecentDocument";
import StudyField from "./StudyField";

const ProfileTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <div>
      <div className="flex flex-row gap-4 border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("recent")}
          className={
            activeTab === "recent" ? "active tab-button" : "tab-button"
          }
          style={
            activeTab === "recent"
              ? {
                  color: "var(--primary-color)",
                  borderBottom: "2px solid var(--primary-color)",
                }
              : {}
          }
        >
          Tài liệu gần đây
        </button>
        <button
          onClick={() => setActiveTab("study")}
          className={activeTab === "study" ? "active tab-button" : "tab-button"}
          style={
            activeTab === "study"
              ? {
                  color: "var(--primary-color)",
                  borderBottom: "2px solid var(--primary-color)",
                }
              : {}
          }
        >
          Lĩnh vực
        </button>
      </div>
      <div className="w-full">
        {activeTab === "recent" && <RecentDocument />}
        {activeTab === "study" && <StudyField />}
      </div>
    </div>
  );
};

export default ProfileTab;
