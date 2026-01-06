import { Component, inject } from '@angular/core';
import { News } from '../../../../core/models/news.model';
import { NewsService } from '../../../../core/services/news.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-news-list',
  imports: [MatProgressSpinnerModule],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent {
  protected news: News[] = [];
  private newsService = inject(NewsService);
  private toastr = inject(ToastrService);
  protected storageUrl = environment.storageUrl;
  isLoading = false;

  constructor(private sanitizer: DomSanitizer) {
    this.isLoading = true;
    this.getNews();
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  getNews() {
    this.newsService.getAdminNews().subscribe({
      next: (response: any) => {
        this.news = response.data;
        console.log(this.news);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Erro ao carregar notícias');
        console.error(error);
      },
    });
  }
}
