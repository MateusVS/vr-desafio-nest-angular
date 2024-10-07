import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsStoresTableComponent } from './products-stores-table.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductStore } from '../../models/product-store.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductsStoresTableComponent', () => {
  let component: ProductsStoresTableComponent;
  let fixture: ComponentFixture<ProductsStoresTableComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProductsStoresTableComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsStoresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dataSource when initialStores is set', () => {
    const initialStores = [
      { id: 1, storeId: 101, storeDescription: 'Loja 1', salePrice: 10.0 },
      { id: 2, storeId: 102, storeDescription: 'Loja 2', salePrice: 20.0 },
    ];

    component.initialStores = initialStores;

    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].storeDescription).toBe('Loja 1');
    expect(component.productStoresChange.emit).toHaveBeenCalledWith(component.dataSource);
  });

  it('should open the product store modal', () => {
    const dialogRefMock = {
      afterClosed: () => ({
        subscribe: (callback: (result: any) => void) => callback(null)
      })
    };

    dialogSpy.open.and.returnValue(dialogRefMock);

    component.openProductStoreModal();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should handle the result from the product store modal', () => {
    const dialogRefMock = {
      afterClosed: () => ({
        subscribe: (callback: (result: ProductStore) => void) => callback({
          storeId: 101,
          storeDescription: 'Loja Nova',
          salePrice: 30.0
        })
      })
    };

    dialogSpy.open.and.returnValue(dialogRefMock);
    component.dataSource = [{ id: 1, storeId: 101, storeDescription: 'Loja 1', salePrice: 10.0 }];

    component.openProductStoreModal();

    expect(component.dataSource.length).toBe(2);
    expect(component.productStoresChange.emit).toHaveBeenCalled();
  });

  it('should delete a product store', () => {
    const productStore = { id: 1, storeId: 101, storeDescription: 'Loja 1', salePrice: 10.0 };
    component.dataSource = [productStore, { id: 2, storeId: 102, storeDescription: 'Loja 2', salePrice: 20.0 }];

    component.deleteProductStore(productStore);

    expect(component.dataSource.length).toBe(1);
    expect(component.productStoresChange.emit).toHaveBeenCalledWith(component.dataSource);
  });

  it('should open the delete confirmation modal', () => {
    const productStore = { id: 1, storeDescription: 'Loja 1' };
    const dialogRefMock = {
      afterClosed: () => ({
        subscribe: (callback: (result: boolean) => void) => callback(true)
      })
    };

    dialogSpy.open.and.returnValue(dialogRefMock);
    component.dataSource = [productStore];

    component.openDeleteConfirmationModal(productStore);

    expect(component.dataSource.length).toBe(0);
    expect(component.productStoresChange.emit).toHaveBeenCalledWith(component.dataSource);
  });

  it('should return next id for new item', () => {
    component.dataSource = [{ id: 1 }, { id: 2 }];

    const nextId = component.getNextId();

    expect(nextId).toBe(3);
  });

  it('should return 1 as next id when dataSource is empty', () => {
    component.dataSource = [];

    const nextId = component.getNextId();

    expect(nextId).toBe(1);
  });
});
