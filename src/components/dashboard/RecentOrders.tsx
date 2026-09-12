import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { API_URL } from "../../config/api";

interface TopProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export default function RecentOrders() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const now = new Date();
        const startDate = `${now.getFullYear()}-01-01`;
        const endDate = `${now.getFullYear()}-12-31`;

        const response = await fetch(
          `${API_URL}/api/reports/top-products?startDate=${startDate}&endDate=${endDate}&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load the top products");
        }

        const data: TopProduct[] = await response.json();
        setTopProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Best-Selling Products
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Product
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Units Sold
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Revenue Generated
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  Loading...
                </TableCell>
              </TableRow>
            ) : topProducts.length === 0 ? (
              <TableRow>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  No data for this period
                </TableCell>
              </TableRow>
            ) : (
              topProducts.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {product.productName}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.totalQuantitySold}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    S/ {product.totalRevenue}
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