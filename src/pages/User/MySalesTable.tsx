import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { API_URL } from "../../config/api";

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

export default function MySalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMySales = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/api/sales/my?page=${page}&size=10&sort=saleDate,desc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load your purchase history");
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

    fetchMySales();
  }, [page]);

 const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
  const username = localStorage.getItem("username") || "";
  const generatedDate = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageMeta title="My Purchases | GestionaPro" description="Purchase history" />

      {/* Normal view (screen) */}
      <div className="print:hidden">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            My Purchases
          </h1>
          {sales.length > 0 && (
            <Button type="button" size="sm" variant="outline" onClick={handlePrint}>
              🖨️ Print history
            </Button>
          )}
        </div>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Here you can see the history of all your purchases.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : sales.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't made any purchases yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white/90">
                      {formatDate(sale.saleDate)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sale.details.length} product(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      S/ {sale.total.toFixed(2)}
                    </p>
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
                  </div>
                </div>

                {expandedId === sale.id && (
                  <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
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
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-2 space-y-1">
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
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

      {/* Print-only view */}
      <div className="hidden print:block text-black">
        <h1 className="text-xl font-bold mb-1">GestionaPro — Purchase History</h1>
        <p className="text-sm mb-1">User: {username}</p>
        <p className="text-sm mb-6">Generated on: {generatedDate}</p>

        {sales.map((sale) => (
          <div key={sale.id} className="mb-5 pb-4 border-b border-gray-300">
            <p className="font-semibold mb-2">
              Sale #{sale.id} — {formatShortDate(sale.saleDate)}
            </p>
            {sale.details.map((detail) => (
              <p key={detail.productId} className="text-sm ml-2">
                {detail.productName} x{detail.quantity} — S/ {detail.subtotal.toFixed(2)}
              </p>
            ))}
            <p className="text-sm ml-2 mt-1">Subtotal: S/ {sale.subtotal.toFixed(2)}</p>
            <p className="text-sm ml-2">Tax (18%): S/ {sale.igv.toFixed(2)}</p>
            <p className="text-sm font-semibold ml-2">Total: S/ {sale.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}