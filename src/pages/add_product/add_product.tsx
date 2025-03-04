import { useState } from "react";
import { SelectCategory } from "../../components/category_selector";
import TagInput from "../../components/tag_input";
import { useFormik } from "formik";
import { ProductValidationSchema } from "../../validation/productvalidationschema";
import { AdminServices } from "../../services/admin";
import axios from "axios";
import { ProductInterface } from "@/intefaces/product";

export const AddProduct = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + imageFiles.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    formik.setFieldValue("images", [...imageFiles, ...files]); // Sync with Formik
  };

  const removeImage = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const updatedImages = [...imageFiles];
    updatedImages.splice(index, 1);
    setImageFiles(updatedImages);
    formik.setFieldValue("images", updatedImages); // Sync with Formik
  };

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: undefined,
      description: "",
      units: 0,
      tags: [] as string[],
      category: { categoryName: "" },
      images: [] as string[], // Will hold File objects temporarily, then URLs
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    validationSchema: ProductValidationSchema,
    onSubmit: async (
      values: ProductInterface,
      { setSubmitting: formikSetSubmitting },
    ) => {
      console.log("Form submission triggered - Inside onSubmit");
      console.log("Current form values:", values);
      setSubmitting(true);

      try {
        console.log("Submitting data:", values);

        // Upload images to Cloudinary
        const uploadedImages = await Promise.all(
          imageFiles.map(async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "d7rtvmdb");
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/dk4wazera/image/upload`,
              formData,
            );
            console.log("Cloudinary response:", response.data);
            return response.data.secure_url;
          }),
        );

        console.log("Uploaded images:", uploadedImages);
        values.images = uploadedImages; // Replace File objects with URLs
        console.log("Final payload:", values);

        const result = await AdminServices.createProduct(values);
        console.log("API response:", result);
      } catch (e) {
        console.error("Error during submission:", e);
        if (axios.isAxiosError(e)) {
          console.error("Axios error details:", e.response?.data);
        }
      } finally {
        setSubmitting(false);
        formikSetSubmitting(false);
      }
    },
  });

  // Log Formik state for debugging
  console.log("Formik state:", {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    isSubmitting: formik.isSubmitting,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Form submit event triggered - Before handleSubmit");
        formik.handleSubmit();
      }}
    >
      <div className="p-4 sm:ml-64 ">
        <div className="p-4 border-2 border-dashed rounded-lg border-gray-700 mt-12">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <SelectCategory
                value={formik.values.category}
                onChange={(category) =>
                  formik.setFieldValue("category", category)
                }
              />
              {formik.touched.category && formik.errors.category && (
                <div className="text-red-500">
                  {typeof formik.errors.category === "string"
                    ? formik.errors.category
                    : formik.errors.category.categoryName}
                </div>
              )}
            </div>
            <div>
              <TagInput
                id="TagInput"
                value={formik.values.tags}
                onChange={(tags) => formik.setFieldValue("tags", tags)}
              />
              {formik.touched.tags && formik.errors.tags && (
                <div className="text-red-500">{String(formik.errors.tags)}</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-sm ">
              <div className="flex flex-col gap-5.5 p-7.0">
                <div>
                  <label className="mb-3 block text-sm font-medium text-white">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Product Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input "
                  />
                  {formik.touched.productName && formik.errors.productName && (
                    <div className="text-red-500">
                      {formik.errors.productName}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-sm ">
              <div className="flex flex-col gap-5.5 p-7.0">
                <div>
                  <label className="mb-3 block text-sm font-medium text-white">
                    Product Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formik.values.price ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Product Price"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input "
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-red-500">{formik.errors.price}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-white ">
              Product Description
            </label>
            <textarea
              rows={6}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Product Description"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500">{formik.errors.description}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-3 block text-sm font-medium text-white">
                Attach file
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
              {formik.touched.images && formik.errors.images && (
                <div className="text-red-500">{formik.errors.images}</div>
              )}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-white">
                Units of Product
              </label>
              <input
                type="number"
                name="units"
                value={formik.values.units}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Units of Product"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input "
              />
              {formik.touched.units && formik.errors.units && (
                <div className="text-red-500">{formik.errors.units}</div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-start h-48 mb-4 rounded bg-gray-800">
            {imageFiles?.map((file: any, index: any) => (
              <div
                key={index}
                className="relative flex items-center max-w-56 min-w-40 justify-center rounded h-36 dark:bg-gray-800 overflow-hidden mr-2 mb-2"
              >
                <img
                  src={URL.createObjectURL(file)}
                  width={500}
                  height={500}
                  alt={`Image ${index + 1}`}
                  className="max-h-full max-w-full object-fill "
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  onClick={(e) => removeImage(index, e)}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="border border-black rounded-lg p-2 bg-teal-400"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
};
