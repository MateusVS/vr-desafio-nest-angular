import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { ProductsFiltersComponent } from './components/products-filters/products-filters.component';
import { Title } from '@angular/platform-browser';
import { ProductsTableComponent } from './components/products-table/products-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ActionBarComponent,
    ProductsFiltersComponent,
    ProductsTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Consulta de Produto');
  }
}
