import { Admin } from "./admin.model";
import { Category } from "./category.model";
import { Tag } from "./tag.model";

export interface News {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  excerpt: string;
  content: string;
  content_with_full_urls?: string;
  main_image?: string;
  main_image_url?: string;
  main_image_caption?: string;
  main_image_alt?: string;
  is_published: boolean;
  published_at?: string;
  views_count: number;
  reading_time?: number;
  category_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  category?: Category;
  author?: Admin;
  tags?: Tag[];
  gallery?: NewsGallery[];
}

export interface NewsGallery {
  id: number;
  image_path: string;
  thumbnail_path?: string;
  caption?: string;
  alt_text?: string;
  position: number;
}

export interface NewsFormData {
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category_id: number;
  main_image?: File;
  main_image_caption?: string;
  main_image_alt?: string;
  tags?: number[];
  is_published?: boolean;
}

export interface GalleryImage {
  id: number;
  news_id: number;
  image_path: string;
  thumbnail_path?: string;
  caption?: string;
  alt_text?: string;
  position: number;
  original_name: string;
  mime_type: string;
  file_size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  image_url?: string;
  thumbnail_url?: string;
}

export interface GalleryUploadData {
  file: File;
  caption?: string;
  alt_text?: string;
}