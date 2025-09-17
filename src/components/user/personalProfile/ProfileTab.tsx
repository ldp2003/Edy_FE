import React, { useState, useContext } from "react";
import RecentDocument from "../document/documentList/RecentDocument";
import StudyList from "../studyField/StudyList";
import { UserContext } from "../../../contexts/UserContext";

const ProfileTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const { user } = useContext(UserContext);

  return (
    <div>
      <div className="text-sm flex flex-row gap-4 font-bold border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("recent")}
          className={
            " cursor-pointer " +
            (activeTab === "recent" ? "active tab-button" : "tab-button")
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
          className={
            " cursor-pointer " +
            (activeTab === "study" ? "active tab-button" : "tab-button")
          }
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
        {activeTab === "study" && (
          <StudyList fieldOfStudy={user?.field_of_study || []} />
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
