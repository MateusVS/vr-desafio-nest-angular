import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

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

  getProducts(params: any = {}): Observable<ApiResponse<Product>>  {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.append(key, value.toString());
      }
    });


    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products`, { params: httpParams });
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${productId}`);
  }

  createProduct(productData: any): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, productData);
  }

  updateProduct(productId: number, productData: any): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${productId}`, productData);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${productId}`);
  }
}
