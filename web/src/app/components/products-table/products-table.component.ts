import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Product } from '../../models/Product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const ELEMENT_DATA: Product[] = [
  {id: 1, description: 'Hydrogen', cost: 1.0079},
  {id: 2, description: 'Helium', cost: 4.0026},
  {id: 3, description: 'Lithium', cost: 6.941},
  {id: 4, description: 'Beryllium', cost: 9.0122},
  {id: 5, description: 'Boron', cost: 10.811},
  {id: 6, description: 'Carbon', cost: 12.0107},
  {id: 7, description: 'Nitrogen', cost: 14.0067},
  {id: 8, description: 'Oxygen', cost: 15.9994},
  {id: 9, description: 'Fluorine', cost: 18.9984},
  {id: 10, description: 'Neon', cost: 20.1797,},
];

@Component({
  selector: 'products-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'description', 'cost', 'actions'];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {}

  deleteProduct(product: any): void {
    console.log('Delete product:', product);
  }

  editProduct(product: any): void {
    console.log('Edit product:', product);
  }
}
