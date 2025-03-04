export interface ProductInterface {
  id?: string;
  productName: string; // Rename from "name" to "productName"
  price: number | undefined;
  description: string;
  units: number;
  images: string[];
  category: { categoryName: string }; // Update to match the payload
  tags: string[]; // Update to array of strings
  createdAt: Date;
  updatedAt: Date;
}
