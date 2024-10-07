import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Product } from '../../models/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ProductsFiltersComponent } from '../products-filters/products-filters.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiResponse } from '../../interfaces/api-response.interface';

@Component({
  selector: 'products-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatSortModule,
    ProductsFiltersComponent,
  ],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent implements OnInit {
  @ViewChild(MatPaginatorModule) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Product>;

  displayedColumns: string[] = ['id', 'description', 'cost', 'actions'];
  dataSource: Product[] = [];
  currentFilters: any = {};
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  // sortField: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      // sortBy: this.sortField,
      order: this.sortDirection.toUpperCase(),
      ...this.currentFilters
    };

    this.apiService.getProducts(params).subscribe(
      (response: ApiResponse<Product>) => {
        this.dataSource = response.items;
        this.totalItems = response.meta.totalItems;
        this.table?.renderRows();
      },
      error => {
        console.log(error)
        this.snackBar.open('Erro ao buscar produtos: ' + error, 'Fechar', {
          duration: 3000,
        });
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onSortChange(sort: Sort): void {
    // this.sortField = sort.active;
    this.sortDirection = sort.direction as 'asc' | 'desc';
    this.loadProducts();
  }

  onFiltersChanged(filters: any): void {
    console.log(filters)
    this.currentFilters = filters;
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadProducts();
  }

  openDeleteConfirmationModal(product: Product): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: {
        item: product,
        message: `Tem certeza que deseja excluir o produto "${product.description}"?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.apiService.deleteProduct(product.id).subscribe(
          () => {
            this.loadProducts();
            this.snackBar.open('Produto excluído com sucesso!', 'Fechar', {
              duration: 3000,
            });
          },
          error => {
            this.snackBar.open('Erro ao excluir produto: ' + error, 'Fechar', {
              duration: 3000,
            });
          }
        );
      }
    });
  }
}
