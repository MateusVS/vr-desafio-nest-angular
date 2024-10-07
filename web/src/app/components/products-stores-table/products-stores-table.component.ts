import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProductStore } from '../../models/product-store.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductStoreModalComponent } from '../product-store-modal/product-store-modal.component';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'products-stores-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ProductStoreModalComponent,
    DeleteConfirmationModalComponent,
  ],
  templateUrl: './products-stores-table.component.html',
  styleUrl: './products-stores-table.component.scss'
})
export class ProductsStoresTableComponent {
  @Output() productStoresChange = new EventEmitter<ProductStore[]>();
  @Input() set initialStores(stores: any[]) {
    if (stores && stores.length > 0) {
      const mappedStores = stores.map(store => ({
        id: store.id,
        storeId: store.storeId,
        storeDescription: store.storeDescription,
        salePrice: store.salePrice
      }));
      this.dataSource = mappedStores;
      this.productStoresChange.emit(this.dataSource);
    }
  }

  displayedColumns: string[] = ['add', 'store_name', 'sale_price', 'actions'];
  dataSource: ProductStore[] = [];

  constructor(private dialog: MatDialog) {}

  openProductStoreModal(productStore?: ProductStore): void {
    const dialogRef = this.dialog.open(ProductStoreModalComponent, {
      width: '800px',
      height: '300px',
      data: {
        productStore: productStore,
        existingStores: this.dataSource
      }
    });

    dialogRef.afterClosed().subscribe((result: ProductStore) => {
      if (result) {
        if (productStore && productStore.id !== undefined) {
          const index = this.dataSource.findIndex(item => item.id === productStore.id);
          if (index !== -1) {
            const updatedDataSource = [...this.dataSource];
            updatedDataSource[index] = result;
            this.updateDataSource(updatedDataSource);
          }
        } else {
          const newItem = {
            ...result,
            id: this.getNextId()
          };
          this.updateDataSource([...this.dataSource, newItem]);
        }
      }
    });
  }

  openDeleteConfirmationModal(productStore: ProductStore): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data:  {
        item: productStore,
        message: `Tem certeza que deseja excluir a loja "${productStore.storeDescription}" deste produto?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteProductStore(productStore);
      }
    });
  }

  private updateDataSource(newDataSource: ProductStore[]) {
    this.dataSource = newDataSource;
    this.productStoresChange.emit(this.dataSource);
  }

  private getNextId(): number {
    if (this.dataSource.length === 0) return 1;
    const maxId = Math.max(...this.dataSource.map(item => item.id || 0));
    return maxId + 1;
  }

  private deleteProductStore(productStore: ProductStore): void {
    this.dataSource = this.dataSource.filter(item => item.id !== productStore.id);
    this.productStoresChange.emit(this.dataSource);
  }
}
