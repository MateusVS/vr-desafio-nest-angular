import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { ProductsFiltersComponent } from '../../components/products-filters/products-filters.component';
import { Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let titleService: Title;

  beforeEach(async () => {
    const mockTitleService = {
      setTitle: jasmine.createSpy('setTitle'),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: Title, useValue: mockTitleService }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title on initialization', () => {
    expect(titleService.setTitle).toHaveBeenCalledWith('Consulta de Produtos');
  });

  it('should call tableComponent.onFiltersChanged when filters change', () => {
    const mockFilters = { category: 'electronics' };

    component.tableComponent = jasmine.createSpyObj('ProductsTableComponent', ['onFiltersChanged']);

    component.onFiltersChanged(mockFilters);

    expect(component.tableComponent.onFiltersChanged).toHaveBeenCalledWith(mockFilters);
  });
});
