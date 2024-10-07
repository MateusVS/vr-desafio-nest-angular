import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsInputsComponent } from './products-inputs.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ProductsInputsComponent', () => {
  let component: ProductsInputsComponent;
  let fixture: ComponentFixture<ProductsInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductsInputsComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsInputsComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormBuilder().group({
      id: [''],
      description: [''],
      cost: [''],
      salePrice: ['']
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the formGroup input correctly', () => {
    const idControl = component.formGroup.get('id');
    const descriptionControl = component.formGroup.get('description');
    const costControl = component.formGroup.get('cost');
    const salePriceControl = component.formGroup.get('salePrice');

    expect(idControl).toBeTruthy();
    expect(descriptionControl).toBeTruthy();
    expect(costControl).toBeTruthy();
    expect(salePriceControl).toBeTruthy();
  });

  it('should update the formGroup when the input values change', () => {
    const idControl = component.formGroup.get('id');
    const descriptionControl = component.formGroup.get('description');

    idControl?.setValue('1');
    descriptionControl?.setValue('Produto Teste');

    expect(component.formGroup.value).toEqual({
      id: '1',
      description: 'Produto Teste',
      cost: '',
      salePrice: ''
    });
  });

  it('should have input fields for id, description, cost, and salePrice', () => {
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
