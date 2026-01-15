import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewsService } from '../../../../core/services/news.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tag-dialog',
  imports: [MatButtonModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './tag-dialog.component.html',
  styleUrl: './tag-dialog.component.scss'
})
export class TagDialogComponent {
  protected data = inject(MAT_DIALOG_DATA);
  private newsService = inject(NewsService);
  private dialogRef = inject(MatDialogRef<TagDialogComponent>);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  tagForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.minLength(8), Validators.maxLength(255)]]
  });

  constructor() {
    console.log(this.data);
    if (this.data?.id) {
      this.tagForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.tagForm.invalid) {
      this.toastr.error('Preencha todos os campos necessários');
      return;
    }
    if (this.data?.id) {
      this.newsService.updateTag(this.data.id, this.tagForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastr.success('Tag atualizada com sucesso');
        },
        error: () => {
          this.toastr.error('Erro ao atualizar tag');
        }
      });
    } else {
      this.newsService.createTag(this.tagForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastr.success('Tag criada com sucesso');
        },
        error: () => {
          this.toastr.error('Erro ao criar tag');
        }
      });
    }
  }
  get name() {
    return this.tagForm.get('name');
  }
}
