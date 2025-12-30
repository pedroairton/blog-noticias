import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { GalleryImage, GalleryUploadData, News } from '../models/news.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private api = inject(ApiService)

  // public
  getNews(params?: any): Observable<{data: News[], meta: any}> {
    return this.api.get('news', params)
  }

  getNewsBySlug(slug: string): Observable<News> {
    return this.api.get(`news/${slug}`)
  }

  getFeaturedNews(): Observable<News[]> {
    return this.api.get('news/featured')
  }

  getNewsByCategory(slug: string, params?: any): Observable<any> {
    return this.api.get(`news/category/${slug}`, params)
  }

  getNewsByAuthor(slug: string, params?: any): Observable<any> {
    return this.api.get(`news/author/${slug}`, params)
  }

  incrementViews(id: string): Observable<any> {
    return this.api.post(`news/${id}/increment-views`)
  }

  // admin
  getAdminNews(params?: any): Observable<{data: News[], meta: any}> {
    return this.api.get('admin/news', params)
  }

  getNewsById(id: number): Observable<News> {
    return this.api.get(`admin/news/${id}`)
  }

  createNews(formData: FormData): Observable<News> {
    return this.api.post('admin/news', formData)
  }

  updateNews(id: number, formData: FormData): Observable<News> {
    return this.api.put(`admin/news/${id}`, formData)
  }

  deleteNews(id: number): Observable<any> {
    return this.api.delete(`admin/news/${id}`)
  }

  publishNews(id: number): Observable<any> {
    return this.api.patch(`admin/news/${id}/publish`, {})
  }

  unpublishNews(id: number): Observable<any> {
    return this.api.patch(`admin/news/${id}/unpublish`, {})
  }

  // uploadGalleryImages(newsId: number, images: File[]): Observable<any> {
  //   const formData = new FormData()
  //   images.forEach(image => {
  //     formData.append('images[]', image)
  //   })
  //   return this.api.post(`admin/news/${newsId}/gallery`, formData)
  // }

  getCategories(): Observable<Category[]> {
    return this.api.get('admin/categories')
  }

  getTags(): Observable<Tag[]> {
    return this.api.get('admin/tags')
  }

  getGallery(newsId: number): Observable<GalleryImage[]> {
    return this.api.get<GalleryImage[]>(`admin/news/${newsId}/gallery`)
  }

  uploadGalleryImages(newsId: number, images: GalleryUploadData[]): Observable<any> {
    const formData = new FormData()

    images.forEach((item, index) => {
      formData.append(`images[${index}]`, item.file)
      if(item.caption) {
        formData.append(`captions[${index}]`, item.caption)
      }
      if(item.alt_text) {
        formData.append(`alt_texts[${index}]`, item.alt_text)
      }
    })

    return this.api.upload(`admin/news/${newsId}/gallery`, formData)
  }

  uploadSingleGalleryImage(newsId: number, imageId: number, data: Partial<GalleryImage>): Observable<any> {
    return this.api.put(`admin/news/${newsId}/gallery/${imageId}`, data)
  }

  deleteGalleryImage(newsId: number, imageId: number): Observable<any> {
    return this.api.delete(`admin/news/${newsId}/gallery/${imageId}`)
  }

  reorderGallery(newsId: number, images: {id: number, position: number}[]): Observable<any> {
    return this.api.put(`admin/news/${newsId}/gallery/reorder`, {images})
  }
}
