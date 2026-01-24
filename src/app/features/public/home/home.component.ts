import { Component, inject } from '@angular/core';
import { Category } from '../../../core/models/category.model';
import { News } from '../../../core/models/news.model';
import { NewsService } from '../../../core/services/news.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected newsService = inject(NewsService)
  categories: Category[] = []
  newsRecent: News[] = []
  newsMostViewed: News[] = []
  public storageUrl = environment.storageUrl

  ngOnInit(){
    this.getRandomCategories()
    this.getRecentNews()
    this.getMostViewedNews()
  }
  getRandomCategories(){
    this.newsService.getRandomCategories().subscribe({
      next: (categories) => {
        this.categories = categories
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
  getRecentNews(){
    this.newsService.getRecentNews().subscribe({
      next: (news) => {
        this.newsRecent = news
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
  getMostViewedNews(){
    this.newsService.getMostViewedNews().subscribe({
      next: (news) => {
        this.newsMostViewed = news
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
}