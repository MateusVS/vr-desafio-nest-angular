import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'products-inputs',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './products-inputs.component.html',
  styleUrl: './products-inputs.component.scss',
})
export class ProductsInputsComponent {
  @Input() formGroup!: FormGroup;
}
