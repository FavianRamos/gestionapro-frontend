import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { API_URL } from "../../config/api";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryName: string;
}

interface CartItem {
  productId: number;
  quantity: number;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/products?size=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = quantity;
      }
      return updated;
    });
  };

  const cartItems: CartItem[] = Object.entries(cart).map(
    ([productId, quantity]) => ({
      productId: Number(productId),
      quantity,
    })
  );

  const total = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ details: cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to process the purchase");
      }

      setSuccessMsg("Purchase completed successfully!");
      setCart({});
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageMeta title="Catalog | My Portfolio" description="Product catalog" />

      <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        Product Catalog
      </h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Select the products and quantities you want to purchase.
      </p>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-lg dark:bg-green-500/10 dark:text-green-400">
          {successMsg}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <h3 className="font-medium text-gray-800 dark:text-white/90">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.categoryName}
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                S/ {product.price}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Available stock: {product.stock}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={product.stock}
                  value={cart[product.id] || 0}
                  onChange={(e) =>
                    updateQuantity(product.id, Number(e.target.value))
                  }
                  className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  units
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6 sticky bottom-4 rounded-xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cartItems.length} product(s) selected
            </p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Total: S/ {total.toFixed(2)}
            </p>
          </div>
          <Button onClick={handleCheckout} disabled={submitting}>
            {submitting ? "Processing..." : "Confirm Purchase"}
          </Button>
        </div>
      )}
    </div>
  );
}