import { Tag } from "@/components/tag_input";

export interface  ProductInterface{
    id?: string;
    name: string;
    price: number | undefined;
    description: string;
    units: number;
    images: string[];
    category: string;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}