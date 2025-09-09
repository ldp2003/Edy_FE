import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import HomePage from "../pages/user/home/Home";

const UserRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;
