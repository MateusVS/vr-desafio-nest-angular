import { ProductStore } from '../models/product-store.model';

export interface ProductStoreDialogData {
  productStore: ProductStore | null;
  usedStoreIds: number[];
}
