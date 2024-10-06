export class ProductStore {
  id?: number;
  storeDescription: string;
  storeId: number;
  salePrice: number;

  constructor({
    id,
    storeDescription,
    storeId,
    salePrice,
  }: ProductStore) {
    this.id = id;
    this.storeDescription = storeDescription;
    this.storeId = storeId;
    this.salePrice = salePrice;
  }
}
