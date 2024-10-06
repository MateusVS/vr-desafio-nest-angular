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
import { Router } from '@angular/router';

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
            this.router.navigate(['/']);
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
}
