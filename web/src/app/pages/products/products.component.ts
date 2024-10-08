import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { ProductsFiltersComponent } from '../../components/products-filters/products-filters.component';

@Component({
  selector: 'products',
  standalone: true,
  imports: [
    ProductsFiltersComponent,
    ProductsTableComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  @ViewChild(ProductsTableComponent) tableComponent!: ProductsTableComponent;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Consulta de Produtos');
  }

  onFiltersChanged(filters: any): void {
    if (this.tableComponent) {
      this.tableComponent.onFiltersChanged(filters);
    }
  }
}
