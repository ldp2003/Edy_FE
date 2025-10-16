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
import SubjectDocumentPage from "../pages/user/subject/SubjectDocumentPage";
import NotFoundPage from "../pages/Error/NotFoundPage";
import DirectDownload from "../pages/user/download/DirectDownload";
import ShareAccess from "../pages/user/share/ShareAccess";
import SearchPage from "../pages/user/search/SearchPage";
import NotificationListPage from "../pages/user/Notification/NotificationListPage";
import DocumentRouteWrapper from "../components/user/document/AccessCheck/DocumentRouteGuard";
import ReadHistoryPage from "../pages/user/history/ReadHistoryPage";
import UserProfilePage from "../pages/user/userInfo/UserProfilePage";
import FollowPage from "../pages/user/follow/FollowPage";

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
          <Route path="search" element={<SearchPage />} />
          <Route
            path="document-detail/:id"
            element={
              <DocumentRouteWrapper type="public">
                <DocumentDetail />
              </DocumentRouteWrapper>
            }
          />
          <Route path="organizations" element={<OrganizationListPage />} />
          <Route path="organization/:id" element={<OrganizationDetailPage />} />
          <Route
            path="subject/:subjectId/documents"
            element={<SubjectDocumentPage />}
          />

          {/* Protected pages - will be handled by individual components */}
          <Route path="personal-posts" element={<PersonalPost />} />
          <Route
            path="personal-posts/document-detail/:id"
            element={
              <DocumentRouteWrapper type="personal">
                <PersonalPostDetail />
              </DocumentRouteWrapper>
            }
          />
          <Route
            path="personal-posts/edit/:id"
            element={<EditDocumentPage />}
          />
          <Route path="personal-profile" element={<PersonalProfile />} />
          <Route path="upload-document" element={<UploadPage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="favorites" element={<FavoritePage />} />
          <Route path="history" element={<ReadHistoryPage />} />
          <Route path="notifications" element={<NotificationListPage />} />
          <Route path="user/:userId" element={<UserProfilePage />} />
          <Route path="following" element={<FollowPage />} />
          <Route path="follower" element={<FollowPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Download page without layout - standalone */}
        <Route path="download/:linkId" element={<DirectDownload />} />
        <Route path="share/:linkId" element={<ShareAccess />} />
      </Routes>
    </AuthRoute>
  );
};

export default UserRoute;
