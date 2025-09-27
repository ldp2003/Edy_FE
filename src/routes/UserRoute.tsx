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
import PersonalPost from "../pages/user/personalPosts/PersonalPost";
import PersonalPostDetail from "../pages/user/personalPosts/PersonalPostDetail";
import EditDocumentPage from "../pages/user/personalPosts/EditDocumentPage";
import FavoritePage from "../pages/user/favorite/FavoritePage";
import OrganizationDetailPage from "../pages/user/organization/OrganizationDetailPage";
import OrganizationListPage from "../pages/user/organization/OrganizationListPage";
import NotFoundPage from "../pages/NotFoundPage";

const UserRoute: React.FC = () => {
  return (
    <AuthRoute>
      <Routes>
        {/* Auth pages with AuthLayout */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="role-selection" element={<RoleSelectionPage />} />
          <Route path="account-activation" element={<AccountActivation />} />
        </Route>

        {/* All app pages with UserLayout - some are public, some require auth */}
        <Route path="/" element={<UserLayout />}>
          {/* Public pages - accessible by anyone */}
          <Route index element={<HomePage />} />
          <Route path="document-detail/:id" element={<DocumentDetail />} />
          <Route path="organizations" element={<OrganizationListPage />} />
          <Route path="organization/:id" element={<OrganizationDetailPage />} />

          {/* Protected pages - will be handled by individual components */}
          <Route path="personal-posts" element={<PersonalPost />} />
          <Route
            path="personal-posts/document-detail/:id"
            element={<PersonalPostDetail />}
          />
          <Route
            path="personal-posts/edit/:id"
            element={<EditDocumentPage />}
          />
          <Route path="personal-profile" element={<PersonalProfile />} />
          <Route path="upload-document" element={<UploadPage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="favorites" element={<FavoritePage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthRoute>
  );
};

export default UserRoute;
