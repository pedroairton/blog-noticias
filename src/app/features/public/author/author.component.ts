import { Component, inject } from '@angular/core';
import { News } from '../../../core/models/news.model';
import { environment } from '../../../../environments/environment';
import { NewsService } from '../../../core/services/news.service';
import { Admin } from '../../../core/models/admin.model';
import { ActivatedRoute } from '@angular/router';
import { formatDateToBR } from '../../../core/utils/functions';

@Component({
  selector: 'app-author',
  imports: [],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
})
export class AuthorComponent {
  slug: string = '';
  storageUrl: string = environment.storageUrl;
  protected newsService = inject(NewsService);
  news: News[] = [];
  author: Admin | null = null;

  constructor(private route: ActivatedRoute) {
    this.slug = this.route.snapshot.paramMap.get('slug') as string;
    this.newsService.getNewsByAuthor(this.slug).subscribe({
      next: (response) => {
        console.log(response);
        this.news = response.news.data;
        this.author = response.author;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  formatDateToBR(dateString: string | undefined): string {
      return formatDateToBR(dateString);
    }
}
