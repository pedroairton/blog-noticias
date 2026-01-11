import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { Category } from '../../../core/models/category.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../dialog/category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  protected newsService = inject(NewsService);
  private toastr = inject(ToastrService);
  isLoading = false;

  categories: Category[] = [];

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loadCategories();
      }
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.newsService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Erro ao carregar categorias');
        console.error(error);
      },
    });
  }
  editCategory(category: Category){
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: category
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loadCategories();
      }
    });
  }
  deleteCategory(category: Category){
    if(!confirm('Deseja excluir esta categoria?')) return;
    this.newsService.deleteCategory(category.id).subscribe({
      next: () => {
        this.loadCategories();
        this.toastr.success('Categoria excluída com sucesso');
      },
      error: () => {
        this.toastr.error('Erro ao excluir categoria');
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }
}
