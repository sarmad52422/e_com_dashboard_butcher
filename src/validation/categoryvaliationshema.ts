import * as Yup from 'yup';

export const CategoryValidationSchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
});