import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsTableComponent } from './products-table.component';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Product } from '../../models/product.model';
import { ApiResponse } from '../../interfaces/api-response.interface';

describe('ProductsTableComponent', () => {
  let component: ProductsTableComponent;
  let fixture: ComponentFixture<ProductsTableComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const product = { id: 1, description: 'Product 1' };
  const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getProducts', 'deleteProduct']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProductsTableComponent],
      imports: [MatTableModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockResponse: ApiResponse<Product> = {
      items: [{ id: 1, description: 'Product 1', cost: 10 }],
      meta: {
        totalItems: 1,
        itemsPerPage: 0,
        currentPage: 0,
        totalPages: 0
      }
    };
    apiServiceSpy.getProducts.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(apiServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.dataSource).toEqual(mockResponse.items);
    expect(component.totalItems).toBe(mockResponse.meta.totalItems);
  });

  it('should handle error while loading products', () => {
    const errorMessage = 'Error fetching products';
    apiServiceSpy.getProducts.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Erro ao buscar produtos: Error fetching products', 'Fechar', {
      duration: 3000
    });
  });

  it('should change page and load products', () => {
    const pageEvent = { pageIndex: 1, pageSize: 10 } as PageEvent;
    component.currentPage = 0;
    component.pageSize = 10;

    component.onPageChange(pageEvent);

    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(10);
    expect(apiServiceSpy.getProducts).toHaveBeenCalled();
  });

  it('should change sort and load products', () => {
    const sort: Sort = { active: 'description', direction: 'asc' };
    component.sortField = '';
    component.sortDirection = 'desc';

    component.onSortChange(sort);

    expect(component.sortField).toBe(sort.active);
    expect(component.sortDirection).toBe(sort.direction);
    expect(apiServiceSpy.getProducts).toHaveBeenCalled();
  });

  it('should update filters and load products', () => {
    const filters = { cost: '10' };
    component.currentFilters = {};
    component.currentPage = 1;

    spyOn(component, 'loadProducts');

    component.onFiltersChanged(filters);

    expect(component.currentFilters).toEqual(filters);
    expect(component.currentPage).toBe(0);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should open delete confirmation modal', () => {
    dialogRefMock.afterClosed.and.returnValue(of(true));

    dialogSpy.open.and.returnValue(dialogRefMock);
    apiServiceSpy.deleteProduct.and.returnValue(of(undefined));

    component.openDeleteConfirmationModal(product);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(apiServiceSpy.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Produto excluído com sucesso!', 'Fechar', {
      duration: 3000,
    });
  });

  it('should handle error while deleting product', () => {
    dialogSpy.open.and.returnValue(dialogRefMock);
    const errorMessage = 'Error deleting product';
    apiServiceSpy.deleteProduct.and.returnValue(throwError(() => new Error(errorMessage)));

    component.openDeleteConfirmationModal(product);

    expect(snackBarSpy.open).toHaveBeenCalledWith('Erro ao excluir produto: Error deleting product', 'Fechar', {
      duration: 3000,
    });
  });
});
