import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'noticia/:slug',
    loadComponent: () =>
      import('./features/public/news-detail/news-detail.component').then(
        (m) => m.NewsDetailComponent
      ),
  },
  {
    path: 'categoria/:slug',
    loadComponent: () =>
      import('./features/public/category/category.component').then(
        (m) => m.CategoryComponent
      ),
  },
  {
    path: 'autor/:slug',
    loadComponent: () =>
      import('./features/public/author/author.component').then(
        (m) => m.AuthorComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/public/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import(
        './features/admin/layout/admin-layout/admin-layout.component'
      ).then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'noticias',
        loadComponent: () =>
          import('./features/admin/news/news-list/news-list.component').then(
            (m) => m.NewsListComponent
          ),
      },
      {
        path: 'noticias/nova',
        loadComponent: () =>
          import('./features/admin/news/news-form/news-form.component').then(
            (m) => m.NewsFormComponent
          ),
      },
      {
        path: 'noticias/editar/:id',
        loadComponent: () =>
          import('./features/admin/news/news-form/news-form.component').then(
            (m) => m.NewsFormComponent
          ),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/admin/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
          canActivate: [adminGuard]
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./features/admin/tags/tags.component').then(
            (m) => m.TagsComponent
          ),
          canActivate: [adminGuard]
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('./features/admin/admins/admins.component').then(
            (m) => m.AdminsComponent
          ),
          canActivate: [adminGuard]
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      )
  }
];
