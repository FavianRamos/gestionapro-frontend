import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import Button from "../../ui/button/Button";
import { API_URL } from "../../../config/api";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryName: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
  categoryId?: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}: ProductFormModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!productToEdit;

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(String(productToEdit.price));
      setStock(String(productToEdit.stock));

      const matchedCategory = categories.find(
        (cat) => cat.name === productToEdit.categoryName
      );
      setCategoryId(matchedCategory ? String(matchedCategory.id) : "");
    } else {
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
    }
    setError("");
    setFieldErrors({});
  }, [productToEdit, isOpen, categories]);

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!name.trim()) {
      errors.name = "Required field";
    }

    if (!price.trim()) {
      errors.price = "Required field";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!stock.trim()) {
      errors.stock = "Required field";
    } else if (isNaN(Number(stock)) || Number(stock) < 0) {
      errors.stock = "Stock cannot be negative";
    }

    if (!categoryId) {
      errors.categoryId = "Required field";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    const url = isEditMode
      ? `${API_URL}/api/products/${productToEdit!.id}`
      : `${API_URL}/api/products`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          stock: parseInt(stock),
          categoryId: parseInt(categoryId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save the product");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {isEditMode ? "Edit Product" : "New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {fieldErrors.price && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.price}</p>
            )}
          </div>

          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {fieldErrors.stock && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.stock}</p>
            )}
          </div>

          <div>
            <Label>Category</Label>
            <Select
              key={categoryId || "empty"}
              options={categoryOptions}
              placeholder="Select a category"
              defaultValue={categoryId}
              onChange={(value) => setCategoryId(value)}
            />
            {fieldErrors.categoryId && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.categoryId}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}