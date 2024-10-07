import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';
import { ApiResponse } from '../interfaces/api-response.interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stores and transform description', () => {
    const mockResponse: ApiResponse<Store> = {
      items: [{ id: 1, description: 'Store 1' }, { id: 2, description: 'Store 2' }],
      meta: {
        totalItems: 0,
        itemsPerPage: 0,
        currentPage: 0,
        totalPages: 0
      }
    };

    service.getStores().subscribe((stores) => {
      expect(stores.length).toBe(2);
      expect(stores[0].description).toBe('1 - Store 1');
      expect(stores[1].description).toBe('2 - Store 2');
    });

    const req = httpMock.expectOne(`${baseUrl}/stores`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch products with query params', () => {
    const params = { category: 'electronics', page: 1 };
    const mockResponse: ApiResponse<Product> = {
      items: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }],
    };

    service.getProducts(params).subscribe((response) => {
      expect(response.items.length).toBe(2);
      expect(response.items[0].name).toBe('Product 1');
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${baseUrl}/products` && request.params.has('category') && request.params.has('page')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch product by id', () => {
    const mockProduct: Product = { id: 1, name: 'Product 1' };

    service.getProductById(1).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/products/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a new product', () => {
    const newProduct = { name: 'New Product' };
    const mockProduct: Product = { id: 1, name: 'New Product' };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/products`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should update a product', () => {
    const updatedProduct = { name: 'Updated Product' };
    const mockProduct: Product = { id: 1, name: 'Updated Product' };

    service.updateProduct(1, updatedProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/products/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
