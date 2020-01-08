import { Product } from "./product";
import { MyGeo } from "./my-geo";

export class Store {
  _id: string;
  category: string;
  name: string;
  address: string;
  number: string;
  neighborhood: string;
  complement: string;
  ref: string;
  email: string;
  cell: string;
  phone: string;
  state: string;
  city: string;
  productList: Product[];
  isShowHome: boolean = false;
  geo: MyGeo;
  image: string;
  products: Product[]
  productsPriceTotal: number;
    isShowProducts: boolean;
}

