import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { formatDateToBR } from '../../../core/utils/functions';

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
    this.newsService.getNewsBySlug(this.slug).subscribe({
      next: (news) => {
        console.log(news)
        this.newsDetail = news;
        this.incrementView(news.id);
      }, error: (error) => {
        console.error(error);
      }
    })
    this.newsService.getNews({limit: 6}).subscribe({
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
    return formatDateToBR(dateString);
  }
  incrementView(id: number){
    this.newsService.incrementViews(id.toString()).subscribe({
      next: (response) => {
        console.log(response);
      }, error: (error) => {
        console.error(error);
      }
    })
  }
  copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copiada para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar URL: ', err);
    });
  }
  shareUrlWhatsapp() {
    const url = window.location.href;
    window.open(`https://wa.me/?text=${url}`, '_blank');
  }
  shareUrlTwitter() {
    const url = window.location.href;
    window.open(`https://x.com/intent/tweet?url=${url}`, '_blank');
  }
  shareUrlFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }
  shareUrlTelegram() {
    const url = window.location.href;
    window.open(`https://t.me/share/url?url=${url}`, '_blank');
  }
  // shareUrlLinkedIn() {
  //   const url = window.location.href;
  //   window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}`, '_blank');
  // }
}
