import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-edit-dialog',
  imports: [MatIconModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './profile-edit-dialog.component.html',
  styleUrl: './profile-edit-dialog.component.scss'
})
export class ProfileEditDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProfileEditDialogComponent>);
  protected data = inject(MAT_DIALOG_DATA);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  profileForm: FormGroup = this.fb.group({
    name: [this.data?.name || '', [Validators.required]],
    email: [this.data?.email || '', [Validators.required, Validators.email]],
    avatar: [this.data?.avatar || ''],
    bio: [this.data?.bio || ''],
    website: [this.data?.website || ''],
    social_facebook: [this.data?.social_facebook || ''],
    social_instagram: [this.data?.social_instagram || ''],
    social_twitter: [this.data?.social_twitter || ''],
    social_linkedin: [this.data?.social_linkedin || ''],
  });

  constructor() {
    console.log(this.data);
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
