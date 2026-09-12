import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";

interface CategorySales {
  categoryId: number;
  categoryName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export default function DemographicCard() {
  const [categories, setCategories] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesByCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        const now = new Date();
        const startDate = `${now.getFullYear()}-01-01`;
        const endDate = `${now.getFullYear()}-12-31`;

        const response = await fetch(
          `${API_URL}/api/reports/sales-by-category?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load sales by category");
        }

        const data: CategorySales[] = await response.json();
        data.sort((a, b) => b.totalRevenue - a.totalRevenue);
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesByCategory();
  }, []);

  const totalRevenue = categories.reduce((sum, c) => sum + c.totalRevenue, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Sales by Category
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Each category's share of total revenue
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No data for this period
          </p>
        ) : (
          categories.map((category) => {
            const percentage =
              totalRevenue > 0
                ? Math.round((category.totalRevenue / totalRevenue) * 100)
                : 0;

            return (
              <div
                key={category.categoryId}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {category.categoryName}
                  </p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {category.totalQuantitySold} units sold
                  </span>
                </div>

                <div className="flex w-full max-w-[140px] items-center gap-3">
                  <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                    <div
                      className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {percentage}%
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}