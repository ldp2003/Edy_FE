import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminHomePage from "../pages/admin/home/AdminHomePage";
import AllDocumentsPage from "../pages/admin/document/AllDocumentsPage";
import DocumentReviewPage from "../pages/admin/document/DocumentReviewPage";
import AuthRoute from "./AuthRoute";

const AdminRoute: React.FC = () => {
  return (
    <AuthRoute>
      <Routes>
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
          {/* <Route path="users/all" element={<AllUsersPage />} />
                <Route path="users/assign-roles" element={<AssignRolesPage />} />
                <Route path="users/manage-roles" element={<ManageRolesPage />} /> */}

          {/* Reports routes */}
          {/* <Route path="reports" element={<ReportsPage />} /> */}
        </Route>
      </Routes>
    </AuthRoute>
  );
};

export default AdminRoute;
