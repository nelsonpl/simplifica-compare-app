import { Store } from "./store";

export class Product {
  _id: string;
  type: string;
  brand: string
  name: string
  description: String;
  packing: String;
  unit: string;
  volume: number;
  price: number;
  validity: Date;
  image:string;
  userCreate: string;
  storeId: string;
  store: Store;
  storeName: string;
  storeState: string;
  storeCity: string;
  isShowHome: boolean = false;
  status: number;
}

