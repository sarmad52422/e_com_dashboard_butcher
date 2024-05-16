import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { CategoryValidationSchema } from "../../validation/categoryvaliationshema";
import { AdminServices } from "../../services/admin";
import { CategoryInterface } from "../../intefaces/category";
import CategoryItem from "./category_item";

export const AddCategory = () => {
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await AdminServices.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const refreshCategories = () => {
    fetchCategories();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    validationSchema: CategoryValidationSchema,
    onSubmit: async (values: CategoryInterface, { resetForm }) => {
      console.log("Submitting data");
      setSubmitting(true);
      console.log(values);
      try {
        const lowercaseValues = { ...values, name: values.name.toLowerCase() };

        const result = await AdminServices.createCategory(lowercaseValues);
        console.log(result);
        resetForm();
        fetchCategories();
      } catch (e) {
        console.log(e);
      }
      setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-dashed rounded-lg border-gray-700 mt-12">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="rounded-sm">
              <div className="flex flex-col gap-5.5 p-7.0">
                <div>
                  <label className="mb-3 block text-sm font-medium text-white">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange("name")}
                    placeholder="Enter Category Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500">{formik.errors.name}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="border border-black rounded-lg p-2 bg-teal-400"
            type="submit"
            disabled={submitting}
          >
            Save Category
          </button>
        </div>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            refreshCategories={refreshCategories}
          />
        ))}
      </div>
    </form>
  );
};
