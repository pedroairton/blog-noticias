import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewsService } from '../../../../core/services/news.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-dialog',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss',
})
export class CategoryDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  protected data = inject(MAT_DIALOG_DATA);
  private newsService = inject(NewsService);
  private toastr = inject(ToastrService);
  categoryForm: FormGroup = this.fb.group({
    name: [this.data?.name || '', [Validators.required]],
    description: [
      this.data?.description || '',
      [Validators.minLength(8), Validators.maxLength(255)],
    ],
  });

  constructor() {
    console.log(this.data);
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.toastr.error('Preencha todos os campos necessários');
      return;
    }
    if (this.data?.id) {
      this.newsService
        .updateCategory(this.data.id, this.categoryForm.value)
        .subscribe({
          next: () => {
            this.dialogRef.close();
            this.toastr.success('Categoria atualizada com sucesso');
          },
          error: () => {
            this.toastr.error('Erro ao atualizar categoria');
          },
        });
    } else {
      this.newsService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastr.success('Categoria criada com sucesso');
        },
        error: () => {
          this.toastr.error('Erro ao criar categoria');
        },
      });
    }
  }
  get name() {
    return this.categoryForm.get('name');
  }
  get description() {
    return this.categoryForm.get('description');
  }
}
