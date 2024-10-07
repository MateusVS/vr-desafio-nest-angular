import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsFiltersComponent } from './products-filters.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ProductsFiltersComponent', () => {
  let component: ProductsFiltersComponent;
  let fixture: ComponentFixture<ProductsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductsFiltersComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filtersChanged when form values change', () => {
    spyOn(component.filtersChanged, 'emit');

    component.filterForm.setValue({
      id: '1',
      description: 'Produto Teste',
      cost: '100',
      salePrice: '150'
    });

    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      id: '1',
      description: 'Produto Teste',
      cost: '100',
      salePrice: '150'
    });
  });

  it('should debounce form value changes', (done) => {
    spyOn(component.filtersChanged, 'emit');

    component.filterForm.get('description')?.setValue('Produto Teste');

    setTimeout(() => {
      expect(component.filtersChanged.emit).toHaveBeenCalledWith({ description: 'Produto Teste' });
      done();
    }, 300);
  });

  it('should only emit non-empty and non-null values', () => {
    spyOn(component.filtersChanged, 'emit');

    component.filterForm.setValue({
      id: '',
      description: 'Produto Teste',
      cost: null,
      salePrice: ''
    });

    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      description: 'Produto Teste'
    });
  });

  it('should have form inputs for id, description, cost, and salePrice', () => {
    const idInput = fixture.debugElement.query(By.css('input[formControlName="id"]'));
    const descriptionInput = fixture.debugElement.query(By.css('input[formControlName="description"]'));
    const costInput = fixture.debugElement.query(By.css('input[formControlName="cost"]'));
    const salePriceInput = fixture.debugElement.query(By.css('input[formControlName="salePrice"]'));

    expect(idInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();
    expect(costInput).toBeTruthy();
    expect(salePriceInput).toBeTruthy();
  });
});
