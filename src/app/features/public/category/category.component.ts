import { Component, inject } from '@angular/core';
import { formatDateToBR } from '../../../core/utils/functions';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category',
  imports: [],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  slug: string = '';
  storageUrl: string = environment.storageUrl
  protected newsService = inject(NewsService)
  news: News[] = []
  category: Category | null = null

  constructor(private route: ActivatedRoute) {
    this.slug = this.route.snapshot.paramMap.get('slug') as string;
    this.newsService.getNewsByCategory(this.slug).subscribe({
      next: (response) => {
        console.log(response);
        this.news = response.news.data
        this.category = response.category        
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  formatDateToBR(dateString: string | undefined): string {
    return formatDateToBR(dateString);
  }
}
