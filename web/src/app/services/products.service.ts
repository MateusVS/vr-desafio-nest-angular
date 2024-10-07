import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private submitProductForm = new Subject<void>();
  private deleteProduct = new Subject<void>();

  submitProductForm$ = this.submitProductForm.asObservable();
  deleteProduct$ = this.deleteProduct.asObservable();

  triggerSubmit() {
    this.submitProductForm.next();
  }

  triggerDelete() {
    this.deleteProduct.next();
  }
}
