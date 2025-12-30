import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-gallery-image-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './gallery-image-dialog.component.html',
  styleUrl: './gallery-image-dialog.component.scss'
})
export class GalleryImageDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GalleryImageDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  imageForm: FormGroup;

  constructor() {
    this.imageForm = this.fb.group({
      caption: [this.data?.caption || '', [Validators.maxLength(255)]],
      alt_text: [this.data?.alt_text || '', [Validators.maxLength(255)]]
    });
  }

  onSave(): void {
    if (this.imageForm.valid) {
      this.dialogRef.close(this.imageForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
