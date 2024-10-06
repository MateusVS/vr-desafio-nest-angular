import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getStores(): Observable<Store[]> {
    return this.http
      .get<ApiResponse<Store>>(`${this.baseUrl}/stores`)
      .pipe(
        map(response => response.items.map(store => ({
          ...store,
          description: `${store.id} - ${store.description}`
        })))
      );
  }

  createProduct(productData: any): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, productData);
  }
}
