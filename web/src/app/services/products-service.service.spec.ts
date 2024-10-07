import { TestBed } from '@angular/core/testing';
import { ProductService } from './products.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger submitProductForm event', (done) => {
    service.submitProductForm$.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });

    service.triggerSubmit();
  });

  it('should trigger deleteProduct event', (done) => {
    service.deleteProduct$.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });

    service.triggerDelete();
  });
});
