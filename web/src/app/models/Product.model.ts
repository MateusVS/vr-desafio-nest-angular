export class Product {
  id: number;
  description: string;
  cost?: number;
  image?: string;
  productsStores?: any | undefined;

  constructor({
    id,
    description,
    cost,
    image,
    productsStores
  }: Product) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.image = image;
    this.productsStores = productsStores;
  }
}


