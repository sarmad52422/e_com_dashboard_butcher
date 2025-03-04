import { useState, useEffect } from "react";
import axios from "axios";
import { ProductInterface } from "../../intefaces/product";
import { AdminServices } from "../../services/admin";

// Reusable Product Card Component
const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductInterface;
  onEdit: (id: string) => void;
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
        onClick={() => onEdit(String(product.id))}
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

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
  </div>
);

const ProductPage = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleEdit = (productId: string) => {
    console.log("Editing product with ID:", productId);
    // Add edit logic here (e.g., redirect to edit page)
  };

  const handleDelete = async (productId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${productId}`); // Replace with your actual endpoint
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
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
      </div>
    </div>
  );
};

export default ProductPage;
