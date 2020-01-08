import { Product } from "./product";

export class ShoppingList {
  _id: string;
  title: string;
  description: string;
  products: Product[];
  productsPriceTotal: number;
}

