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
    return this.api.get(`admin/news/${id}`, {
      include: 'category,author,tags,gallery'
    })
  }

  createNews(formData: FormData): Observable<News> {
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    return this.api.post('admin/news', formData)
  }

  // update precisa ser feito com POST, bug do laravel com PUT
  updateNews(id: number, formData: FormData): Observable<News> { 
    // formData.append('_method', 'PUT');   
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    return this.api.post(`admin/news/${id}`, formData)
  }

  updateNewsContent(id: number, data: any): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    formData.append('_method', 'PUT');
    
    return this.api.post(`admin/news/${id}`, formData);
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

  updateCategory(id: number, data: any): Observable<Category> {
    return this.api.put(`admin/categories/${id}`, data)
  }

  createCategory(data: any): Observable<Category> {
    return this.api.post('admin/categories', data)
  }
  deleteCategory(id: number): Observable<any> {
    return this.api.delete(`admin/categories/${id}`)
  }

  getTags(): Observable<Tag[]> {
    return this.api.get('admin/tags')
  }
  createTag(data: any): Observable<Tag> {
    return this.api.post('admin/tags', data)
  }
  updateTag(id: number, data: any): Observable<Tag> {
    return this.api.put(`admin/tags/${id}`, data)
  }
  deleteTag(id: number): Observable<any> {
    return this.api.delete(`admin/tags/${id}`)
  }

  getGallery(newsId: number): Observable<any[]> {
    return this.api.get(`admin/news/${newsId}/gallery`)
  }

  uploadGalleryImages(newsId: number, formData: FormData): Observable<any> {
    return this.api.upload(`admin/news/${newsId}/gallery`, formData);
  }

  uploadSingleGalleryImage(newsId: number, file: File, caption?: string, altText?: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    if (caption) formData.append('caption', caption);
    if (altText) formData.append('alt_text', altText);
    
    return this.api.upload(`admin/news/${newsId}/gallery/single`, formData);
  }

  updateGalleryImage(newsId: number, imageId: number, data: Partial<GalleryImage>): Observable<GalleryImage> {
    return this.api.put(`admin/news/${newsId}/gallery/${imageId}`, data)
  }

  deleteGalleryImage(newsId: number, imageId: number): Observable<any> {
    return this.api.delete(`admin/news/${newsId}/gallery/${imageId}`)
  }

  reorderGallery(newsId: number, images: {id: number, position: number}[]): Observable<any> {
    return this.api.put(`admin/news/${newsId}/gallery/reorder`, {images})
  }

  getAdmins(): Observable<any> {
    return this.api.get('admin/admins')
  }
}
