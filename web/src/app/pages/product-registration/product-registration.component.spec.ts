import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRegistrationComponent } from './product-registration.component';
import { Title } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/products.service';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductRegistrationComponent', () => {
  let component: ProductRegistrationComponent;
  let fixture: ComponentFixture<ProductRegistrationComponent>;
  let mockTitleService: jasmine.SpyObj<Title>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockTitleService = jasmine.createSpyObj('Title', ['setTitle']);
    mockApiService = jasmine.createSpyObj('ApiService', ['getProductById', 'createProduct', 'updateProduct', 'deleteProduct']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockProductService = jasmine.createSpyObj('ProductService', ['submitProductForm$', 'deleteProduct$'], {
      submitProductForm$: new Subject<void>(),
      deleteProduct$: new Subject<void>(),
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProductRegistrationComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Title, useValue: mockTitleService },
        { provide: ApiService, useValue: mockApiService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '123' } }, // Simulando que um ID de produto foi passado
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title on initialization', () => {
    expect(mockTitleService.setTitle).toHaveBeenCalledWith('Cadastro de Produto');
  });

  it('should subscribe to submitProductForm$ and call onSubmit', () => {
    spyOn(component, 'onSubmit');

    (mockProductService.submitProductForm$ as Subject<void>).next();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should open the delete confirmation modal when deleteProduct$ is triggered', () => {
    spyOn(component, 'openDeleteConfirmationModal');

    (mockProductService.deleteProduct$ as Subject<void>).next();

    expect(component.openDeleteConfirmationModal).toHaveBeenCalled();
  });

  it('should call getProductById when route has productId', () => {
    const productId = 123;
    spyOn(component as any, 'getProductById');

    component.ngOnInit();

    expect((component as any).getProductById).toHaveBeenCalledWith(productId);
  });
});
