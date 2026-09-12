import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { API_URL } from "../../../config/api";

interface SaleDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Sale {
  id: number;
  userId: number;
  userName: string;
  saleDate: string;
  subtotal: number;
  igv: number;
  total: number;
  details: SaleDetail[];
}

interface PageResponse {
  content: Sale[];
  totalPages: number;
  totalElements: number;
  number: number;
}

interface User {
  id: number;
  username: string;
}

export default function SalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users?size=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.content);
      }
    };
    fetchUsers();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", "10");
      params.set("sort", "saleDate,desc");
      if (selectedUserId) params.set("userId", selectedUserId);
      if (startDate) params.set("startDate", `${startDate}T00:00:00`);
      if (endDate) params.set("endDate", `${endDate}T23:59:59`);

      const response = await fetch(
        `${API_URL}/api/sales?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load sales");
      }

      const data: PageResponse = await response.json();
      setSales(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, selectedUserId, startDate, endDate]);

 const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const userOptions = users.map((u) => ({
    value: String(u.id),
    label: u.username,
  }));

  const clearFilters = () => {
    setSelectedUserId("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="w-full sm:w-48">
          <label className="mb-1.5 block text-xs text-gray-500 dark:text-gray-400">
            User
          </label>
          <Select
            key={selectedUserId || "all"}
            options={userOptions}
            placeholder="All users"
            defaultValue={selectedUserId}
            onChange={(value) => {
              setSelectedUserId(value);
              setPage(0);
            }}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="mb-1.5 block text-xs text-gray-500 dark:text-gray-400">
            From
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="mb-1.5 block text-xs text-gray-500 dark:text-gray-400">
            To
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      </div>

      {error && (
        <div className="m-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Date
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                User
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Total
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Details
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400">
                  No sales found
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <>
                  <TableRow key={sale.id}>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(sale.saleDate)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {sale.userName}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                      S/ {sale.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedId(expandedId === sale.id ? null : sale.id)
                        }
                      >
                        {expandedId === sale.id ? "Hide" : "View details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedId === sale.id && (
                    <TableRow key={`${sale.id}-detail`}>
                      <td className="px-5 py-4 bg-gray-50 dark:bg-white/[0.02]" colSpan={4}>
                        <div className="space-y-2 mb-4">
                          {sale.details.map((detail) => (
                            <div
                              key={detail.productId}
                              className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                            >
                              <span>
                                {detail.productName} x{detail.quantity}
                              </span>
                              <span>S/ {detail.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 space-y-1">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>S/ {sale.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Tax (18%)</span>
                            <span>S/ {sale.igv.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-semibold text-gray-800 dark:text-white/90">
                            <span>Total</span>
                            <span>S/ {sale.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </td>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05]">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}