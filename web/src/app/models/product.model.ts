export class Product {
  id: number;
  description: string;
  cost?: number;
  image?: any;
  imageBase64?: string;
  productStores?: any;

  constructor({
    id,
    description,
    cost,
    image,
    imageBase64,
    productStores,
  }: Product) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.image = image;
    this.imageBase64 = imageBase64;
    this.productStores = productStores;
  }
}
