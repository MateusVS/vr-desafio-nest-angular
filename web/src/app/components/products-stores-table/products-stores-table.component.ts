import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProductStore } from '../../models/product-store.model';

@Component({
  selector: 'products-stores-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './products-stores-table.component.html',
  styleUrl: './products-stores-table.component.scss'
})
export class ProductsStoresTableComponent {
  displayedColumns: string[] = ['add', 'store_name', 'sale_price', 'actions'];
  dataSource: ProductStore[] = [];
}
