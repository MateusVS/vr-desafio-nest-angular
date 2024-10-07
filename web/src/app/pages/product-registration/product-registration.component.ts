import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductsStoresTableComponent } from '../../components/products-stores-table/products-stores-table.component';
import { ImageUploadComponent } from '../../components/image-upload/image-upload.component';
import { ProductsInputsComponent } from '../../components/products-inputs/products-inputs.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductStore } from '../../models/product-store.model';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'product-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProductsStoresTableComponent,
    ImageUploadComponent,
    ProductsInputsComponent,
  ],
  templateUrl: './product-registration.component.html',
  styleUrl: './product-registration.component.scss',
})
export class ProductRegistrationComponent implements OnInit, OnDestroy {
  form: FormGroup;
  productStores: ProductStore[] = [];
  imageBuffer: string | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.titleService.setTitle('Cadastro de Produto');
    this.form = this.fb.group({
      id: [],  // Campo id apenas para exibição
      description: ['', Validators.required],
      cost: [null],
    });
  }

  ngOnInit() {
    this.subscription = this.productService.submitProductForm$.subscribe(() => {
      this.onSubmit();
    });

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.getProductById(+productId);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onProductStoresChange(stores: ProductStore[]) {
    this.productStores = stores;
  }

  onImageChange(imageBuffer: string | null) {
    this.imageBuffer = imageBuffer;
  }

  submitForm() {
    this.onSubmit();
  }

  onSubmit() {
    if (this.form.valid && this.productStores.length > 0) {
      const formData = this.form.value;
      delete formData.id;  // CREATE

      const productData = {
        description: formData.description,
        cost: formData.cost,
        image: this.imageBuffer,
        productsStores: this.productStores.map(store => ({
          storeId: store.storeId,
          salePrice: store.salePrice
        }))
      };

      this.apiService.createProduct(productData).subscribe(
        response => {
          this.snackBar.open('Produto criado com sucesso!', 'Fechar', {
            duration: 3000
          });

          setTimeout(() => {
            this.router.navigate(['/produto']);
          }, 1500);
        },
        error => {
          this.snackBar.open('Erro ao criar produto: ' + error.message, 'Fechar', {
            duration: 5000
          });
        }
      );
    } else {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', {
        duration: 3000
      });
    }
  }

  private getProductById(productId: number): void {
    this.apiService.getProductById(productId).subscribe(
      (product: Product) => {
        this.form.patchValue({
          id: product.id,
          description: product.description,
          cost: product.cost,
        });

        if (product.imageBase64) {
          const binaryString = atob(product.imageBase64);

          const utf8String = decodeURIComponent(escape(binaryString));

          product.imageBase64 = utf8String;
          this.imageBuffer = utf8String;
        }

        if (product.productStores && Array.isArray(product.productStores)) {
          this.productStores = product.productStores.map(productStore => ({
            id: productStore.id,
            storeId: productStore.store.id,
            storeDescription: productStore.store.description,
            salePrice: productStore.salePrice
          }));
        }
      },
      error => {
        this.snackBar.open('Erro ao carregar produto: O produto não foi localizado', 'Fechar', {
          duration: 5000,
        });

        setTimeout(() => {
          this.router.navigate(['/produto']);
        }, 1000);
      }
    );
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    buffer.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
}
