export const AdminEndPoints = {
  CREATE_PRODUCT: "/products/admin/",
  CREATE_CATEGORY: "/categories/admin/",
  DELETE_CATEGORY: (id: string) => `/categories/admin/delete/${id}`,
  UPDATE_CATEGORY: `/categories/admin/update`,
  GET_CATEGORIES: "/categories/",
  GET_ALL_PRODUCTS: "/products/",
  UPDATE_PRODUCT: (id: string) => `/products/admin/update/${id}`,
  DELETE_PRODUCT: (id: string) => `/products/admin/delete/${id}`,
};
