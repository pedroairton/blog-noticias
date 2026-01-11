import { Component, inject } from '@angular/core';
import { News } from '../../../../core/models/news.model';
import { NewsService } from '../../../../core/services/news.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-news-list',
  imports: [MatProgressSpinnerModule, MatButtonModule, MatIconModule],
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
  deleteNews(id: number) {
    if (confirm('Deseja realmente excluir esta notícia?')) {
      this.newsService.deleteNews(id).subscribe({
        next: () => {
          this.getNews();
          this.toastr.success('Notícia excluída com sucesso');
        },
        error: (error) => {
          this.toastr.error('Erro ao excluir notícia');
          console.error(error);
        },
      });
    }
  }
  publishNews(id: number) {
    if(confirm('Deseja realmente publicar esta notícia?')) {
      this.newsService.publishNews(id).subscribe({
        next: () => {
          this.getNews();
          this.toastr.success('Notícia publicada com sucesso');
        },
        error: (error) => {
          this.toastr.error('Erro ao publicar notícia');
          console.error(error);
        },
      });
    }
  }
  unpublishNews(id: number) {
    if(confirm('Deseja realmente despublicar esta notícia?')) {
      this.newsService.unpublishNews(id).subscribe({
        next: () => {
          this.getNews();
          this.toastr.success('Notícia despublicada com sucesso');
        },
        error: (error) => {
          this.toastr.error('Erro ao despublicar notícia');
          console.error(error);
        },
      });
    }
  }
}
