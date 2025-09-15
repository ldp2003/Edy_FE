import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import HomePage from "../pages/user/home/Home";
import PresonalPost from "../pages/user/presonalPosts/PresonalPost";
import PersonalProfile from "../pages/user/personalProfile/PersonalProfile";
import UploadPage from "../pages/user/upload/UploadPage";
import AccountActivation from "../pages/user/accountActivation/AccountActivation";
import EditProfile from "../pages/user/personalProfile/EditProfile";
import DocumentDetail from "../pages/user/document/DocumentDetail";

const UserRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="personal-posts" element={<PresonalPost />} />
        <Route path="personal-profile" element={<PersonalProfile />} />
        <Route path="upload-document" element={<UploadPage />} />
        <Route path="account-activation" element={<AccountActivation />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="document-detail" element={<DocumentDetail />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;
