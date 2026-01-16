import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { Category } from '../../../core/models/category.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Admin } from '../../../core/models/admin.model';
import { AdminDialogComponent } from '../dialog/admin-dialog/admin-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admins',
  imports: [MatButtonModule, MatProgressSpinnerModule, MatIconModule, CommonModule],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.scss'
})
export class AdminsComponent {
  protected newsService = inject(NewsService);
  protected authService = inject(AuthService);
  private toastr = inject(ToastrService);
  isLoading = false;
  isSuperAdmin$ = false;

  checkSuperAdmin() {
    this.authService.isSuperAdmin().subscribe({
      next: (response: any) => {
        this.isSuperAdmin$ = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  constructor(private dialog: MatDialog) {}

  admins: {authors: Admin[], admins: Admin[]} = {authors: [], admins: []};

  loadAdmins(): void {
    this.isLoading = true;
    this.newsService.getAdmins().subscribe({
      next: (response: any) => {
        this.admins.authors = response.authors.data;
        this.admins.admins = response.admins.data;
        console.log(this.admins);
        console.log(this.admins.authors);
        console.log(this.admins.admins);
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Erro ao carregar administradores');
        console.error(error);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.loadAdmins();
      }
    });
  }
  toggleStatus(id: number): void {
    this.newsService.toggleStatus(id).subscribe({
      next: (response) => {
        this.loadAdmins();
        this.toastr.success('Status do administrador alterado com sucesso');
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Erro ao alterar status do administrador');
        console.error(error);
      }
    });
  }
  editAdmin(author: Admin): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '500px',
      data: author
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.loadAdmins();
      }
    });
  }
  deleteAdmin(author: Admin): void {
    if(!confirm('Deseja excluir este administrador?')) return;
    this.isLoading = true;
    this.newsService.deleteAdmin(author.id).subscribe({
      next: (response) => {
        this.loadAdmins();
        this.toastr.success('Administrador excluído com sucesso');
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Erro ao excluir administrador');
        console.error(error);
      }
    });
  }
  ngOnInit(): void {
    this.loadAdmins();
    this.checkSuperAdmin();
  }
}
