import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import { API_URL } from "../../../config/api";

interface User {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
  enabled: boolean;
}

interface PageResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users?size=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data: PageResponse = await response.json();
      setUsers(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (user: User) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (
      !confirm(
        `Change ${user.username}'s role to ${newRole}?`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/users/${user.id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change the role");
      }

      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleToggleEnabled = async (user: User) => {
    const action = user.enabled ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} ${user.username}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/users/${user.id}/toggle-enabled`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} the user`);
      }

      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {error && (
        <div className="m-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400">
                  No registered users
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {user.username}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Administrator" : "User"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.enabled
                          ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {user.enabled ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleRole(user)}
                      >
                        {user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleEnabled(user)}
                      >
                        {user.enabled ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}