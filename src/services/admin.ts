import { ProductInterface } from "@/intefaces/product";
import { AdminEndPoints } from "../constants/EndPoints";
import { HttpClient } from "./httpclient";
import { CategoryInterface } from "../intefaces/category";

export const AdminServices = {
  async createProduct(data: ProductInterface) {
    console.log(data + "<<<<<<<<<<<<<<< Full data to url");

    return await HttpClient.post(AdminEndPoints.CREATE_PRODUCT, data);
  },
  async createCategory(data: CategoryInterface) {
    return await HttpClient.post(AdminEndPoints.CREATE_CATEGORY, data);
  },
  async getCategories() {
    return await HttpClient.get(AdminEndPoints.GET_CATEGORIES);
  },
  async deleteCategory(id: string) {
    return await HttpClient.delete(AdminEndPoints.DELETE_CATEGORY(id));
  },
  async updateCategory(data: CategoryInterface) {
    return await HttpClient.patch(AdminEndPoints.UPDATE_CATEGORY, data);
  },
  async getAllProducts() {
    return await HttpClient.get(AdminEndPoints.GET_ALL_PRODUCTS);
  },
  async updateProducts(id: string, data: ProductInterface) {
    return await HttpClient.patch(AdminEndPoints.UPDATE_PRODUCT(id), data);
  },
  async deleteProducts(id: string) {
    return await HttpClient.delete(AdminEndPoints.DELETE_PRODUCT(id));
  },
};
