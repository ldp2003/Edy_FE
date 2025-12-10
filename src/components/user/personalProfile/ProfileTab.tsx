import React, { useState, useContext, useEffect, useRef } from "react";
import RecentDocument from "../document/documentList/RecentDocument";
import StudyList from "../studyField/StudyList";
import SharedList from "../document/documentList/SharedList";
import { UserContext } from "../../../contexts/UserContext";
import { useLocation } from "react-router-dom";

const ProfileTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Update active tab based on URL only on initial mount
    if (isInitialMount.current) {
      const pathToTab: Record<string, string> = {
        "/personal-profile/recent": "recent",
        "/personal-profile/field-of-study": "study",
        "/personal-profile/shared-documents": "shared",
      };
      const currentTab = pathToTab[location.pathname] || "recent";
      setActiveTab(currentTab);
      isInitialMount.current = false;
    }
  }, [location.pathname]);

  return (
    <div>
      <div className="text-xs md:text-sm flex flex-row flex-wrap gap-4 font-bold border-b border-gray-300 mb-4">
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
        <button
          onClick={() => setActiveTab("shared")}
          className={
            " cursor-pointer " +
            (activeTab === "shared" ? "active tab-button" : "tab-button")
          }
          style={
            activeTab === "shared"
              ? {
                  color: "var(--primary-color)",
                  borderBottom: "2px solid var(--primary-color)",
                }
              : {}
          }
        >
          Được chia sẻ
        </button>
      </div>
      <div className="w-full">
        {activeTab === "recent" && <RecentDocument />}
        {activeTab === "study" && (
          <StudyList fieldOfStudy={user?.field_of_study || []} />
        )}
        {activeTab === "shared" && <SharedList />}
      </div>
    </div>
  );
};

export default ProfileTab;
