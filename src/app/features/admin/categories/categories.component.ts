import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { Category } from '../../../core/models/category.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-categories',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  protected newsService = inject(NewsService);
  private toastr = inject(ToastrService);

  categories: Category[] = [];

  loadCategories(): void {
    this.newsService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;
      },
      error: (error) => {
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
