import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Admin } from '../../../core/models/admin.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileEditDialogComponent } from '../dialog/profile-edit-dialog/profile-edit-dialog.component';
import { ProfileChangePasswordDialogComponent } from '../dialog/profile-change-password-dialog/profile-change-password-dialog.component';

@Component({
  selector: 'app-profile',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  protected admin: Admin | null = null;
  isLoading = true;

  constructor(private dialog: MatDialog) {
    this.authService.getCurrentUser().subscribe({
      next: (admin: Admin | null) => {
        this.admin = admin;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  editUser(): void {
    const dialogRef = this.dialog.open(ProfileEditDialogComponent, {
      width: '500px',
      data: this.admin,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.getCurrentUser().subscribe({
          next: (admin: Admin | null) => {
            this.admin = admin;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          },
        });
      }
    });
  }
  changePasswordDialog() {
    this.dialog.open(ProfileChangePasswordDialogComponent, {
      width: '500px',
      data: this.admin,
    });
  }
}
