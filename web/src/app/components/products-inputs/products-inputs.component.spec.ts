import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsInputsComponent } from './products-inputs.component';

describe('ProductsInputsComponent', () => {
  let component: ProductsInputsComponent;
  let fixture: ComponentFixture<ProductsInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsInputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
