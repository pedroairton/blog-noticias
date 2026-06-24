import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NewsService } from '../services/news.service';

export const newsDetailResolver: ResolveFn<any> = (route) => {
  const newsService = inject(NewsService);

  const slug = route.paramMap.get('slug')!;

  return newsService.getNewsBySlug(slug);
};