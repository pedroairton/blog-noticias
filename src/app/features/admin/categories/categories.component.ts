import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { Category } from '../../../core/models/category.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  }
  deleteCategory(category: Category){

  }

  ngOnInit(): void {
    this.loadCategories();
  }
}
