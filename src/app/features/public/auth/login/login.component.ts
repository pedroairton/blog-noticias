import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../../core/models/admin.model';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService)
  private fb: FormBuilder = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private router = inject(Router)
  loginForm: FormGroup

  constructor(){
    this.loginForm = this.createForm()
  }

  createForm(){
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  login(){
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/admin/dashboard'])
      },
      error: (error) => {
        console.error(error)
        this.toastr.error("Erro ao fazer login")
      }
    })
  }
}
