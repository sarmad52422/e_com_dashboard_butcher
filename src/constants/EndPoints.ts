export const AdminEndPoints = {
    CREATE_PRODUCT: '/products/admin/',
    CREATE_CATEGORY: '/category/admin/',
    DELETE_CATEGORY:(id:string)=> `/category/admin/delete/${id}`,
    UPDATE_CATEGORY: `/category/admin/update`,
    GET_CATEGORIES: '/category/',
    GET_ALL_PRODUCTS: '/products/',
    UPDATE_PRODUCT:(id:string) => `/admin/product/${id}`,
    DELETE_PRODUCT:(id:string) => `/admin/product/${id}`,
}