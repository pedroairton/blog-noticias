import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-change-password-dialog',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './profile-change-password-dialog.component.html',
  styleUrl: './profile-change-password-dialog.component.scss'
})
export class ProfileChangePasswordDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProfileChangePasswordDialogComponent>);
  protected data = inject(MAT_DIALOG_DATA);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  constructor(){
    console.log(this.data);
  }

  changePasswordForm: FormGroup = this.fb.group({
    current_password: ['', [Validators.required]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required, Validators.minLength(8)]]
  })

  onSubmit(){
    if(this.changePasswordForm.valid){
      this.authService.changePassword(this.changePasswordForm.value).subscribe({
        next: () => {
          this.toastr.success('Senha alterada com sucesso!');
          this.dialogRef.close();
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          this.dialogRef.close();
        }
      })
    }
  }
}
