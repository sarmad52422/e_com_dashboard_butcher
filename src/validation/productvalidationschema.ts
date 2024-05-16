
import * as Yup from 'yup';

export const ProductValidationSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    tags: Yup.array().min(1, 'At least one tag is required'),
    file: Yup.mixed().required('File is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required'),
    name: Yup.string().required('Name is required'),
    units: Yup.number().required('Units of product is required'),
    images: Yup.array().min(1, 'At least one image is required'),
});