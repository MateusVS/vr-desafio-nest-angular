import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductStoreModalComponent } from './product-store-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { Store } from '../../models/store.model';
import { ProductStore } from '../../models/product-store.model';

describe('ProductStoreModalComponent', () => {
  let component: ProductStoreModalComponent;
  let fixture: ComponentFixture<ProductStoreModalComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProductStoreModalComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockData = {
    productStore: new ProductStore({ id: 1, storeId: 1, salePrice: 10, storeDescription: 'Store 1' }),
    existingStores: [
      new ProductStore({ id: 2, storeId: 2, salePrice: 20, storeDescription: 'Store 2' })
    ]
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStores']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductStoreModalComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductStoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form values in edit mode', () => {
    expect(component.isEditMode).toBeTrue();
    expect(component.form.value).toEqual({
      storeId: 1,
      salePrice: 10
    });
  });

  it('should load stores on init', () => {
    const stores: Store[] = [
      { id: 1, description: 'Store 1' },
      { id: 2, description: 'Store 2' }
    ];
    apiServiceSpy.getStores.and.returnValue(of(stores));

    component.ngOnInit();
    expect(component.stores).toEqual(stores);
  });

  it('should handle store fetching error', () => {
    apiServiceSpy.getStores.and.returnValue(throwError('Erro ao buscar lojas'));

    component.ngOnInit();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Erro ao buscar lojas: Erro ao buscar lojas', 'Fechar', { duration: 3000 });
  });

  it('should not allow duplicate storeId', () => {
    component.form.get('storeId')?.setValue(2);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Não é permitido mais que um preço de venda para a mesma loja.', 'Fechar', { duration: 5000 });
    expect(component.form.get('storeId')?.value).toBe('');
  });

  it('should close the dialog with productStore when form is valid and saved', () => {
    const stores: Store[] = [{ id: 1, description: 'Store 1' }];
    apiServiceSpy.getStores.and.returnValue(of(stores));
    component.ngOnInit();

    component.form.setValue({ storeId: 1, salePrice: 10 });
    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(new ProductStore({
      id: 1,
      storeId: 1,
      storeDescription: 'Store 1',
      salePrice: 10
    }));
  });

  it('should not save if form is invalid', () => {
    component.form.get('salePrice')?.setValue('');
    component.save();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
