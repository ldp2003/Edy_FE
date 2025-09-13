import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import HomePage from "../pages/user/home/Home";
import PresonalPost from "../pages/user/presonalPosts/PresonalPost";
import PersonalProfile from "../pages/user/personalProfile/PersonalProfile";
import UploadPage from "../pages/user/upload/UploadPage";
import AccountActivation from "../pages/user/accountActivation/AccountActivation";

const UserRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="personal-posts" element={<PresonalPost />} />
        <Route path="personal-profile" element={<PersonalProfile />} />
        <Route path="upload-document" element={<UploadPage />} />
        <Route path="account-activation" element={<AccountActivation />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;
