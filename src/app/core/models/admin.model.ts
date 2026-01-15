export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'author';
  slug: string;
  bio?: string;
  avatar?: string;
  avatar_url?: string;
  website?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_linkedin?: string;
  created_at: string;
  updated_at: string;
  published_news_count?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
  token_type: string;
}