import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

export interface DashboardItensSuperAdmin{
  total_news: number,
  published_news: number,
  draft_news: number,
  total_authors: number,
  total_categories: number,
  total_tags: number,
  total_views: number,
  recent_news: News[]
}
export interface DashboardItensAutor{
  my_total_news: number,
  my_published_news: number,
  my_draft_news: number,
  my_total_views: number,
  recent_my_news: News[]
}
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  isSuperAdmin$: boolean = false
  private newsService = inject(NewsService)
  private authService = inject(AuthService)
  private toastr = inject(ToastrService)
  dashboardSuperAdmin?: DashboardItensSuperAdmin;
  dashboardAutor?: DashboardItensAutor; 

  ngOnInit(){
    this.checkSuperAdmin()
    this.newsService.getDashboardStats().subscribe({
      next: (response) => {
        if (this.isSuperAdmin$) {
          this.dashboardSuperAdmin = response as DashboardItensSuperAdmin;
        } else {
          this.dashboardAutor = response as DashboardItensAutor;
        }
      },
      error: (error) => {
        console.error(error)
        this.toastr.error('Erro ao carregar estatísticas do painel')
      }
    })
  }
  checkSuperAdmin() {
    this.authService.isSuperAdmin().subscribe({
      next: (response: any) => {
        this.isSuperAdmin$ = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
