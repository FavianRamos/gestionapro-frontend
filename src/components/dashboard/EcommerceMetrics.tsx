import { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon } from "../../icons";
import { API_URL } from "../../config/api";

interface RevenueReport {
  startDate: string;
  endDate: string;
  totalSales: number;
  totalRevenue: number;
}

export default function EcommerceMetrics() {
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const now = new Date();
        const startDate = `${now.getFullYear()}-01-01`;
        const endDate = `${now.getFullYear()}-12-31`;

        const [revenueRes, productsRes, usersRes] = await Promise.all([
          fetch(
            `${API_URL}/api/reports/revenue?startDate=${startDate}&endDate=${endDate}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(`${API_URL}/api/products/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/users/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (revenueRes.ok) {
          setRevenue(await revenueRes.json());
        }
        if (productsRes.ok) {
          setProductCount(await productsRes.json());
        }
        if (usersRes.ok) {
          setUserCount(await usersRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Revenue
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : `S/ ${revenue?.totalRevenue ?? 0}`}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Sales */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Sales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : revenue?.totalSales ?? 0}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Products */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : productCount ?? 0}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : userCount ?? 0}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}