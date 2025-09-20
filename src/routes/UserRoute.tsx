import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/user/home/Home";
import PersonalProfile from "../pages/user/personalProfile/PersonalProfile";
import UploadPage from "../pages/user/upload/UploadPage";
import AccountActivation from "../pages/auth/AccountActivation";
import EditProfile from "../pages/user/personalProfile/EditProfile";
import DocumentDetail from "../pages/user/document/DocumentDetail";
import RoleSelectionPage from "../pages/auth/RoleSelectionPage";
import AuthRoute from "./AuthRoute";
import PersonalPost from "../pages/user/presonalPosts/PersonalPost";
import PersonalPostDetail from "../pages/user/personalPosts/PersonalPostDetail";

const UserRoute: React.FC = () => {
  return (
    <AuthRoute>
      <Routes>
        {/* Auth pages with AuthLayout */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="role-selection" element={<RoleSelectionPage />} />
          <Route path="account-activation" element={<AccountActivation />} />
        </Route>

        {/* Main app pages with UserLayout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="personal-posts" element={<PersonalPost />} />
          <Route path="personal-posts/:id" element={<PersonalPostDetail />} />
          <Route path="personal-profile" element={<PersonalProfile />} />
          <Route path="upload-document" element={<UploadPage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="document-detail/:id" element={<DocumentDetail />} />
        </Route>
      </Routes>
    </AuthRoute>
  );
};

export default UserRoute;
