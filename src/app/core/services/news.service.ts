import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private api = inject(ApiService)

  // public
  getNews(params?: any): Observable<{data: News[], meta: any}> {
    return this.api.get('/news', params)
  }

  getNewsBySlug(slug: string): Observable<News> {
    return this.api.get(`/news/${slug}`)
  }

  getFeaturedNews(): Observable<News[]> {
    return this.api.get('/news/featured')
  }

  getNewsByCategory(slug: string, params?: any): Observable<any> {
    return this.api.get(`/news/category/${slug}`, params)
  }

  getNewsByAuthor(slug: string, params?: any): Observable<any> {
    return this.api.get(`/news/author/${slug}`, params)
  }

  incrementViews(id: string): Observable<any> {
    return this.api.post(`/news/${id}/increment-views`)
  }

  // admin
  getAdminNews(params?: any): Observable<{data: News[], meta: any}> {
    return this.api.get('/admin/news', params)
  }

  getNewsById(id: number): Observable<News> {
    return this.api.get(`/admin/news/${id}`)
  }

  createNews(formData: FormData): Observable<News> {
    return this.api.post('/admin/news', formData)
  }

  updateNews(id: number, formData: FormData): Observable<News> {
    return this.api.put(`/admin/news/${id}`, formData)
  }

  deleteNews(id: number): Observable<any> {
    return this.api.delete(`/admin/news/${id}`)
  }

  publishNews(id: number): Observable<any> {
    return this.api.patch(`admin/news/${id}/publish`, {})
  }

  unpublishNews(id: number): Observable<any> {
    return this.api.patch(`admin/news/${id}/unpublish`, {})
  }

  uploadGalleryImages(newsId: number, images: File[]): Observable<any> {
    const formData = new FormData()
    images.forEach(image => {
      formData.append('images[]', image)
    })
    return this.api.post(`admin/news/${newsId}/gallery`, formData)
  }

  getCategories(): Observable<Category[]> {
    return this.api.get('admin/categories')
  }

  getTags(): Observable<Tag[]> {
    return this.api.get('admin/tags')
  }
}
