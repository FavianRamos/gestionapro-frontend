import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";

interface LowStockProduct {
  productId: number;
  productName: string;
  stock: number;
  categoryName: string;
}

export default function LowStockAlert() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/api/reports/low-stock?threshold=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load low-stock products");
        }

        const data: LowStockProduct[] = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Low Stock Alert
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Products with 10 or fewer units available
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            All products have sufficient stock
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800"
            >
              <div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {product.productName}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {product.categoryName}
                </span>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {product.stock} units
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}