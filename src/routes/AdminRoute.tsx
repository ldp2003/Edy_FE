import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminHomePage from "../pages/admin/home/AdminHomePage";
import AllDocumentsPage from "../pages/admin/document/AllDocumentsPage";
import DocumentReviewPage from "../pages/admin/document/DocumentReviewPage";
import DocumentComparePage from "../pages/admin/document/DocumentComparePage";
import AdminUsersPage from "../pages/admin/user/AdminUsersPage";
import UserDetailPage from "../pages/admin/user/UserDetailPage";
import UserEditPage from "../pages/admin/user/UserEditPage";
import AuthRoute from "./AuthRoute";
import NotFoundPage from "../pages/NotFoundPage";
import ReportsPage from "../pages/admin/report/ReportsPage";
import ManageRolesPage from "../pages/admin/user/ManageRolesPage";
import AssignRolesPage from "../pages/admin/user/AssignRolesPage";

const AdminRoute: React.FC = () => {
  return (
    <AuthRoute>
      <Routes>
        {/* Document compare page - fullscreen without AdminLayout */}
        <Route path="documents/compare/:id" element={<DocumentComparePage />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          {/* Future admin routes will be added here */}
          {/* Statistics routes */}
          {/* <Route path="statistics/documents" element={<DocumentStatisticsPage />} />
                <Route path="statistics/users" element={<UserStatisticsPage />} />
                <Route path="statistics/general" element={<GeneralStatisticsPage />} /> */}

          {/* Document management routes */}
          <Route path="documents/all" element={<AllDocumentsPage />} />
          <Route path="documents/review/:id" element={<DocumentReviewPage />} />
          {/* <Route path="documents/pending" element={<PendingDocumentsPage />} /> */}

          {/* User management routes */}
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/detail/:id" element={<UserDetailPage />} />
          <Route path="users/edit/:id" element={<UserEditPage />} />

          <Route path="users/assign-roles" element={<AssignRolesPage />} />
          <Route path="users/manage-roles" element={<ManageRolesPage />} />

          {/* Reports routes */}
          <Route path="reports" element={<ReportsPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthRoute>
  );
};

export default AdminRoute;
