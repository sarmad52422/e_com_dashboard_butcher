import { useState, useEffect } from "react";
import { ProductInterface } from "../../intefaces/product";
import { CategoryInterface } from "../../intefaces/category";
import { AdminServices } from "../../services/admin";
import { useFormik } from "formik";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
  </div>
);

// Reusable Product Card Component
const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductInterface;
  onEdit: (id: string, data: ProductInterface) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-slate-800 shadow-lg rounded-lg p-6 mb-6 border border-slate-700 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-xl font-semibold text-white mb-2">
      {product.productName}
    </h2>
    <p className="text-slate-300">
      <span className="font-medium text-slate-100">Category:</span>{" "}
      {product.category?.categoryName ?? "N/A"}
    </p>
    <p className="text-slate-300">
      <span className="font-medium text-slate-100">Tags:</span>{" "}
      {product.tags.join(", ")}
    </p>
    <p className="text-slate-300">
      <span className="font-medium text-slate-100">Price:</span> $
      {product.price}
    </p>
    <p className="text-slate-300">
      <span className="font-medium text-slate-100">Description:</span>{" "}
      {product.description}
    </p>
    <p className="text-slate-300">
      <span className="font-medium text-slate-100">Units:</span> {product.units}
    </p>
    <div className="mt-4">
      <p className="font-medium text-slate-100">Images:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product ${index}`}
            className="w-24 h-24 object-cover rounded-md border border-slate-600"
          />
        ))}
      </div>
    </div>
    <div className="mt-4 flex gap-4">
      <button
        onClick={() => onEdit(String(product.id), product)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(String(product.id))}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
      >
        Delete
      </button>
    </div>
  </div>
);

// Edit Product Modal Component
const EditProductModal = ({
  productId,
  productData,
  onClose,
  onUpdate,
}: {
  productId: string;
  productData: ProductInterface;
  onClose: () => void;
  onUpdate: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);

  // Fetch categories on modal open
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await AdminServices.getCategories();
        console.log("Categories response:", response);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      productName: productData.productName,
      description: productData.description,
      price: productData.price,
      units: productData.units,
      tags: productData.tags,
      images: productData.images,
      category: productData.category || { categoryName: "" },
      createdAt: productData.createdAt,
      updatedAt: new Date(),
    },
    onSubmit: async (values) => {
      setSubmitting(true);
      setError(null);
      try {
        const response = await AdminServices.updateProducts(productId, values);
        console.log("Update response:", response);
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error updating product:", error);
        setError("Failed to update product. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-slate-100 mb-6">
          Edit Product
        </h2>
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={formik.values.productName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Units
            </label>
            <input
              type="number"
              name="units"
              value={formik.values.units}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formik.values.tags.join(", ")}
              onChange={(e) =>
                formik.setFieldValue("tags", e.target.value.split(", "))
              }
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Category
            </label>
            {categoryLoading ? (
              <LoadingSpinner />
            ) : (
              <select
                name="category.categoryName"
                value={formik.values.category.categoryName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Images */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Images (comma-separated URLs)
            </label>
            <input
              type="text"
              name="images"
              value={formik.values.images.join(", ")}
              onChange={(e) =>
                formik.setFieldValue("images", e.target.value.split(", "))
              }
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="col-span-2 text-red-400 text-center p-4 bg-red-900/50 rounded-md">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="col-span-2 mt-4 flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 disabled:bg-blue-700 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    data: ProductInterface;
  } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminServices.getAllProducts();
      console.log("Raw API response:", response);
      console.log("Products data:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId: string, data: ProductInterface) => {
    setEditingProduct({ id: productId, data }); // Open modal with product ID and data
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      await AdminServices.deleteProducts(productId);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    await fetchProducts(); // Refresh after update
  };

  return (
    <div className="p-4 sm:ml-64 min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">All Products</h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-400 text-center p-4 bg-red-900/50 rounded-md">
            {error}
          </div>
        ) : products.length === 0 ? (
          <p className="text-slate-400 text-center p-4 bg-slate-800 rounded-md shadow">
            No products available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={
                  product.id || `${product.productName}-${product.createdAt}`
                }
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {editingProduct && (
          <EditProductModal
            productId={editingProduct.id}
            productData={editingProduct.data}
            onClose={() => setEditingProduct(null)}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
