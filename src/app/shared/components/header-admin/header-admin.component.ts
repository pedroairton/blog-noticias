import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header-admin',
  imports: [],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss'
})
export class HeaderAdminComponent {
  authService = inject(AuthService)
  name = 'Usuário'
  logout() {
    if (confirm('Deseja realmente sair?')) {
      this.authService.logout()
    }
  }
  getName(){
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.name = user.name
      } else {
        this.name = 'Usuário'
      }
    })
  }
  // constructor() {
  //   this.getName()
  // }
}
