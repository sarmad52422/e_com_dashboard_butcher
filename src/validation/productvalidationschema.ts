import * as Yup from "yup";

export const ProductValidationSchema = Yup.object().shape({
  category: Yup.object().shape({
    categoryName: Yup.string().required("Category name is required"),
  }),
  tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().required("Price is required"),
  productName: Yup.string().required("Product name is required"),
  units: Yup.number().required("Units of product is required"),
  images: Yup.array().min(1, "At least one image is required"),
});
