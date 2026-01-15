import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit-dialog',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './profile-edit-dialog.component.html',
  styleUrl: './profile-edit-dialog.component.scss'
})
export class ProfileEditDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProfileEditDialogComponent>);
  protected data = inject(MAT_DIALOG_DATA);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @ViewChild('avatarInput') avatarInput!: ElementRef

  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  profileForm: FormGroup 

  constructor() {
    console.log(this.data);
    this.profileForm = this.fb.group({
      bio: [this.data?.bio || '', [Validators.maxLength(255), Validators.minLength(10)]],
      website: [this.data?.website || '', [Validators.pattern('https?://.+')]],
      social_facebook: [this.data?.social_facebook || '', [Validators.pattern('https?://.+')]],
      social_twitter: [this.data?.social_twitter || '', [Validators.pattern('https?://.+')]],
      social_instagram: [this.data?.social_instagram || '', [Validators.pattern('https?://.+')]],
      social_linkedin: [this.data?.social_linkedin || '', [Validators.pattern('https?://.+')]],
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if(input.files && input.files[0]) {
      this.selectedFile = input.files[0]

      console.log(this.selectedFile.type);
      if(!this.selectedFile.type.match('image.*')) {
        this.toastr.error('Por favor, selecione apenas imagens')
        this.selectedFile = null
        return
      }

      if(this.selectedFile.size > 5 * 1024 * 1024) {
        this.toastr.error('A imagem não pode ser maior que 5MB')
        this.selectedFile = null
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string
      }
      reader.readAsDataURL(this.selectedFile)
    }
  }

  onSubmit() {
    if(this.profileForm.invalid){
      return
    }
    const formData = new FormData()

    if(this.selectedFile){
      formData.append('avatar', this.selectedFile)
    }

    Object.keys(this.profileForm.controls).forEach(key => {
      formData.append(key, this.profileForm.get(key)?.value ||  '')
    })

    this.authService.updateProfile(formData).subscribe({
      next: (response: any) => {
        console.log('perfil atualizado');
        
        this.toastr.success('Perfil atualizado com sucesso')
        this.dialogRef.close(response)
      },
      error: (error: any) => {
        console.error('Erro ao atualizar perfil', error)
        this.toastr.error('Erro ao atualizar perfil')
      }
    })
    console.log(this.profileForm.value);
  }
}
