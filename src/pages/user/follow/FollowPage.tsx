import React, { useEffect } from "react";
import { Tabs } from "antd";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import FollowItem from "../../../components/user/follow/FollowItem";
import type { User } from "../../../models/user";

const FollowPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const followerList: User[] = (user?.follower || []).map((follower) => {
    if (typeof follower === "string") {
      return { _id: follower } as User; // Minimal User object
    }
    return follower;
  });

  const followingList: User[] = (user?.following || []).map((following) => {
    if (typeof following === "string") {
      return { _id: following } as User; // Minimal User object
    }
    return following;
  });

  // Determine the active tab based on the URL
  const activeTab = location.pathname.includes("following") ? "2" : "1";

  const handleTabChange = (key: string) => {
    if (key === "1") {
      navigate("/follower");
    } else {
      navigate("/following");
    }
  };

  useEffect(() => {
    // Sync tab with URL on initial load
    if (activeTab === "1" && !location.pathname.includes("follower")) {
      navigate("/follower", { replace: true });
    } else if (activeTab === "2" && !location.pathname.includes("following")) {
      navigate("/following", { replace: true });
    }
  }, [activeTab, location.pathname, navigate]);

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow-md text-left">
      {activeTab === "1" ? (
        <div className="text-[var(--primary-text-color)] font-bold">
          Danh sách người theo dõi
        </div>
      ) : (
        <div className="text-[var(--primary-text-color)] font-bold">
          Danh sách đang theo dõi
        </div>
      )}
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane tab="Người theo dõi" key="1">
          {followerList.length > 0 ? (
            followerList.map((follower) => (
              <FollowItem key={follower._id} user={follower} />
            ))
          ) : (
            <div>Không có người theo dõi nào.</div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đang theo dõi" key="2">
          {followingList.length > 0 ? (
            followingList.map((following) => (
              <FollowItem key={following._id} user={following} />
            ))
          ) : (
            <div>Không theo dõi ai.</div>
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default FollowPage;
