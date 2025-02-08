import * as Yup from "yup";

export const CategoryValidationSchema = Yup.object().shape({
  categoryName: Yup.string().required("Category name is required"),
});
