import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsStoresTableComponent } from './products-stores-table.component';

describe('ProductsStoresTableComponent', () => {
  let component: ProductsStoresTableComponent;
  let fixture: ComponentFixture<ProductsStoresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsStoresTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsStoresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
