import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-news-detail',
  imports: [],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent {
  ativo: boolean = false;
  protected newsService = inject(NewsService);
  newsDetail: News | null = null;
  slug: string;
  storageUrl: string = environment.storageUrl
  moreNews: News[] = []

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer){
    this.slug = this.route.snapshot.paramMap.get('slug') as string;
    console.log(this.slug)
    this.newsService.getNewsBySlug(this.slug).subscribe({
      next: (news) => {
        console.log(news)
        this.newsDetail = news;
      }, error: (error) => {
        console.error(error);
      }
    })
    this.newsService.getNews().subscribe({
      next: (news) => {
        console.log(news.data)
        this.moreNews = news.data;
      }, error: (error) => {
        console.error(error);
      }
    })
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  removeNbsp(input: string): string {
    if (typeof input !== "string") {
        throw new TypeError("Input must be a string");
    }

    // Replace HTML entity &nbsp; and Unicode non-breaking space \u00A0
    return input
        .replace(/&nbsp;/gi, " ") // Replace HTML entity with normal space
        .replace(/\u00A0/g, " ")  // Replace Unicode NBSP with normal space
        .trim();                  // Remove leading/trailing spaces
  }
  formatDateToBR(dateString: string | undefined): string {
    if(dateString){
      const date = new Date(dateString);
  
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
    
      return `${day}/${month}/${year}`;
    }
    return '';
  }
  
}
