import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private submitProductForm = new Subject<void>();

  submitProductForm$ = this.submitProductForm.asObservable();

  triggerSubmit() {
    this.submitProductForm.next();
  }
}
