import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '../../models/store.model';
import { ProductStore } from '../../models/product-store.model';
import { ApiService } from '../../services/api.service';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'product-store-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-store-modal.component.html',
  styleUrl: './product-store-modal.component.scss'
})
export class ProductStoreModalComponent implements OnInit {
  isEditMode = false;
  stores: Store[] = [];
  form: FormGroup;
  existingStoreIds: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProductStoreModalComponent>,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      productStore: ProductStore | null,
      existingStores: ProductStore[]
    }
  ) {
    this.isEditMode = !!data.productStore;
    this.existingStoreIds = data.existingStores
      .filter(store => store.id !== data.productStore?.id)
      .map(store => store.storeId);

    this.form = this.fb.group({
      storeId: ['', [Validators.required]],
      salePrice: ['', [Validators.required, Validators.min(0)]],
    });

    if (data.productStore) {
      this.form.patchValue({
        storeId: data.productStore.storeId,
        salePrice: data.productStore.salePrice,
      });
    }
  }

  ngOnInit(): void {
    this.apiService.getStores().subscribe(
      stores => {
        this.stores = stores;
      },
      error => {
        this.snackBar.open('Erro ao buscar lojas: ' + error, 'Fechar', {
          duration: 3000,
        });
      }
    );

    this.form.get('storeId')?.valueChanges.subscribe(storeId => {
      if (this.existingStoreIds.includes(storeId)) {
        this.snackBar.open('Não é permitido mais que um preço de venda para a mesma loja.', 'Fechar', {
          duration: 5000,
        });
        this.form.get('storeId')?.setValue('', { emitEvent: false });
      }
    });
  }


  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const selectedStoreId = this.form.value.storeId;

      if (this.existingStoreIds.includes(selectedStoreId)) {
        this.snackBar.open('Não é permitido mais que um preço de venda para a mesma loja.', 'Fechar', {
          duration: 5000,
        });
        return;
      }

      const selectedStore = this.stores.find(store => store.id === selectedStoreId);
      if (selectedStore) {
        const productStore = new ProductStore({
          id: this.data.productStore?.id,
          storeId: selectedStore.id,
          storeDescription: selectedStore.description,
          salePrice: this.form.value.salePrice
        });

        this.dialogRef.close(productStore);
      }
    }
  }

}
