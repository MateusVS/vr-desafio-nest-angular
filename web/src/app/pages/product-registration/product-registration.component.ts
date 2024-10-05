import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductsStoresTableComponent } from '../../components/products-stores-table/products-stores-table.component';

@Component({
  selector: 'product-registration',
  standalone: true,
  imports: [
    ProductsStoresTableComponent,
  ],
  templateUrl: './product-registration.component.html',
  styleUrl: './product-registration.component.scss'
})
export class ProductRegistrationComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Cadastro de Produto');
  }
}
