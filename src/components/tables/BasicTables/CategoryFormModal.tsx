import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { API_URL } from "../../../config/api";

interface Category {
  id: number;
  name: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: Category | null;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = !!categoryToEdit;

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName("");
    }
    setError("");
    setNameError("");
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setNameError("Required field");
      return;
    }
    setNameError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    const url = isEditMode
      ? `${API_URL}/api/categories/${categoryToEdit!.id}`
      : `${API_URL}/api/categories`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to save the category");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {isEditMode ? "Edit Category" : "New Category"}
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
            {nameError && (
              <p className="mt-1 text-xs text-red-500">{nameError}</p>
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