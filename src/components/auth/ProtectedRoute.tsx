import { Navigate } from "react-router";

function decodeRoleFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "";
  } catch {
    return "";
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "ADMIN" | "USER";
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  const role = decodeRoleFromToken(token);

  if (role !== allowedRole) {
    return <Navigate to={role === "ADMIN" ? "/" : "/inicio"} replace />;
  }

  return <>{children}</>;
}