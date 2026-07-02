import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import App from "../App";
import AdminRoute from "./AdminRoute";
import Loading from "../components/ui/Loading";

// Admin/secondary pages are lazy-loaded so they don't bloat the initial
// configurator bundle (most visitors never open the admin panel).
const AdminPanel = lazy(() => import("../pages/AdminPanel"));
const UsersPage = lazy(() => import("../pages/UsersPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

const RouterConfig = () => (
  <Router>
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </Router>
);

export default RouterConfig;
