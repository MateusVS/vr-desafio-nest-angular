export class ProductStore {
  id: number;
  name: string;
  sale_price: number;

  constructor({
    id,
    name,
    sale_price,
  }: ProductStore) {
    this.id = id;
    this.name = name;
    this.sale_price = sale_price;
  }
}
