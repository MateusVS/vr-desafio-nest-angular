import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'image-upload',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  @Output() imageChange = new EventEmitter<string | null>();
  imageUrl: string | null = null;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.imageChange.emit(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }
}
