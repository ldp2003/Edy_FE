import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import HomePage from "../pages/user/home/Home";
import PresonalPost from "../pages/user/presonalPosts/PresonalPost";

const UserRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="personal-posts" element={<PresonalPost />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;
