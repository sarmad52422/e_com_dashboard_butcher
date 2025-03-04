import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { CategoryValidationSchema } from "../../validation/categoryvaliationshema";
import { AdminServices } from "../../services/admin";
import { CategoryInterface } from "../../intefaces/category";
import CategoryItem from "./category_item";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
  </div>
);

export const AddCategory = () => {
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For fetching categories
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminServices.getCategories();
      console.log("Categories response:", response);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    validationSchema: CategoryValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      setError(null);
      try {
        const lowercaseValues = {
          ...values,
          categoryName: values.categoryName.toLowerCase(),
        };
        console.log("Submitting:", JSON.stringify(lowercaseValues));

        const result = await AdminServices.createCategory(lowercaseValues);
        console.log("Create category response:", result);

        resetForm();
        fetchCategories(); // Refresh list after adding
      } catch (e) {
        console.error("Error during submission:", e);
        setError("Failed to add category. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="p-4 sm:ml-64 min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">
          Add New Category
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="categoryName"
                value={formik.values.categoryName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Category Name"
                className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.categoryName && formik.errors.categoryName && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.categoryName}
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-400 text-center p-4 bg-red-900/50 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 disabled:bg-blue-700 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : (
                "Save Category"
              )}
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">
            Existing Categories
          </h2>
          {loading ? (
            <LoadingSpinner />
          ) : categories.length === 0 ? (
            <p className="text-slate-400 text-center p-4 bg-slate-800 rounded-md shadow">
              No categories available
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => (
                <CategoryItem
                  key={
                    category.id ||
                    `${category.categoryName}-${category.createdAt}`
                  }
                  category={category}
                  refreshCategories={refreshCategories}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
