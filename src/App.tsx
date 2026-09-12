import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Products from "./pages/Admin/Products";
import Categories from "./pages/Admin/Categories";
import Sales from "./pages/Admin/Sales";
import Users from "./pages/Admin/Users";
import Catalog from "./pages/User/Catalog";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MySales from "./pages/User/MySalesTable";
import Welcome from "./pages/User/Welcome";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout (ADMIN only) */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/basic-tables"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* User Layout (USER only) */}
            <Route
              path="/inicio"
              element={
                <ProtectedRoute allowedRole="USER">
                  <Welcome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalogo"
              element={
                <ProtectedRoute allowedRole="USER">
                  <Catalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-compras"
              element={
                <ProtectedRoute allowedRole="USER">
                  <MySales />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}