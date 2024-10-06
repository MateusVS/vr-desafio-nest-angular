import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStoreModalComponent } from './product-store-modal.component';

describe('ProductStoreModalComponent', () => {
  let component: ProductStoreModalComponent;
  let fixture: ComponentFixture<ProductStoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStoreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
