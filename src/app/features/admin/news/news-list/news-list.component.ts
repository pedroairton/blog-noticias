import { Component, inject } from '@angular/core';
import { News } from '../../../../core/models/news.model';
import { NewsService } from '../../../../core/services/news.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-news-list',
  imports: [],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent {
  protected news: News[] = [];
  private newsService = inject(NewsService);
  private toastr = inject(ToastrService);

  constructor() {
    this.getNews();
  }

  getNews() {
    this.newsService.getAdminNews().subscribe({
      next: (response: any) => {
        this.news = response.data;
        console.log(this.news);
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar notícias');
        console.error(error);
      },
    });
  }
}
