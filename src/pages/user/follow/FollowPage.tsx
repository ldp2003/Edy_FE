import React, { useEffect, useState } from "react";
import { Tabs, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import FollowItem from "../../../components/user/follow/FollowItem";
import type { User } from "../../../models/user";

const FollowPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [followingList, setFollowingList] = useState<User[]>([]);

  useEffect(() => {
    const initialFollowingList: User[] = (user?.following || []).map(
      (following) => {
        if (typeof following === "string") {
          return { _id: following } as User; // Minimal User object
        }
        return following;
      }
    );
    setFollowingList(initialFollowingList);
  }, [user?.following]);

  const updateFollowingList = (add: boolean, targetUser: User) => {
    setFollowingList((prev) =>
      add ? [...prev, targetUser] : prev.filter((u) => u._id !== targetUser._id)
    );
  };

  const followerList: User[] = (user?.follower || []).map((follower) => {
    if (typeof follower === "string") {
      return { _id: follower } as User; // Minimal User object
    }
    return follower;
  });

  const filteredFollowerList = followerList.filter(
    (follower) =>
      follower.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      follower.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof follower.organization === "object" &&
        follower.organization !== null &&
        follower.organization.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (typeof follower.organization === "string" &&
        follower.organization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFollowingList = followingList.filter(
    (following) =>
      following.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      following.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof following.organization === "object" &&
        following.organization !== null &&
        following.organization.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (typeof following.organization === "string" &&
        following.organization
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  // Determine the active tab based on the URL
  const activeTab = location.pathname.includes("following") ? "2" : "1";

  const handleTabChange = (key: string) => {
    if (key === "1") {
      navigate("/follower");
    } else {
      navigate("/following");
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    const normalizedSearchTerm = searchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "_");
    navigate(`${location.pathname}?search=${normalizedSearchTerm}`);
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
      <div className="flex items-center justify-between mb-4">
        <div className="text-[var(--primary-text-color)] font-bold">
          {activeTab === "1"
            ? "Danh sách người theo dõi"
            : "Danh sách đang theo dõi"}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm theo tên hoặc trường học"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>
      </div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane tab="Người theo dõi" key="1">
          {filteredFollowerList.length > 0 ? (
            filteredFollowerList.map((follower) => (
              <FollowItem
                key={follower._id}
                user={follower}
                onUpdateFollowing={updateFollowingList}
              />
            ))
          ) : (
            <div>Không có người theo dõi nào.</div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đang theo dõi" key="2">
          {filteredFollowingList.length > 0 ? (
            filteredFollowingList.map((following) => (
              <FollowItem
                key={following._id}
                user={following}
                onUpdateFollowing={updateFollowingList}
              />
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
