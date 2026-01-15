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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dialog',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './admin-dialog.component.html',
  styleUrl: './admin-dialog.component.scss'
})
export class AdminDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AdminDialogComponent>);
  protected data = inject(MAT_DIALOG_DATA);
  private newsService = inject(NewsService);
  private toastr = inject(ToastrService);
  adminForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
    role: ['', [Validators.required]],
  })

  onSubmit(): void {
    if (this.adminForm.invalid) {
      this.toastr.error('Preencha todos os campos necessários');
      return;
    }
    this.newsService.createAdmin(this.adminForm.value).subscribe({
      next: () => {
        this.dialogRef.close();
        this.toastr.success('Admin criado com sucesso');
      },
      error: () => {
        this.toastr.error('Erro ao criar admin');
      },
    });
  }
  get name() {
    return this.adminForm.get('name');
  }
  get email() {
    return this.adminForm.get('email');
  }
  get password() {
    return this.adminForm.get('password');
  }
  get password_confirmation() {
    return this.adminForm.get('password_confirmation');
  }
  get role() {
    return this.adminForm.get('role');
  }
}
    