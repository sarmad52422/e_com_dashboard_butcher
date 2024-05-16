import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios library
import { ProductInterface } from "../../intefaces/product";
import { AdminServices } from "../../services/admin";

const ProductPage = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Send GET request to fetch products
      const response = await AdminServices.getAllProducts(); // Replace '/api/products' with your actual endpoint
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit = (productId: string) => {
    // Implement edit logic, such as redirecting to an edit page
    console.log("Editing product with ID:", productId);
  };

  const handleDelete = async (productId: string) => {
    try {
      // Send DELETE request to delete product
      await axios.delete(`/api/products/${productId}`); // Replace '/api/products' with your actual endpoint
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-4 sm:ml-64 ">
      <h1>All Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Category: {product.category}</p>
          <p>Tags: {product.tags.join(", ")}</p>
          <p>Price: ${product.price}</p>
          <p>Description: {product.description}</p>
          <p>Units: {product.units}</p>
          <div>
            Images:
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index}`}
                style={{ width: "100px", height: "auto", marginRight: "5px" }}
              />
            ))}
          </div>
          <button onClick={() => handleEdit(String(product.id))}>Edit</button>
          <button onClick={() => handleDelete(String(product.id))}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
