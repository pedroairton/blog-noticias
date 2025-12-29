import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NewsService } from '../../../../core/services/news.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../../core/models/category.model';
import { Tag } from '../../../../core/models/tag.model';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';
import 'quill/dist/quill.snow.css';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-news-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    QuillModule,
],
  templateUrl: './news-form.component.html',
  styleUrl: './news-form.component.scss',
})
export class NewsFormComponent {
  @ViewChild('mainImageInput') mainImageInput!: ElementRef;
  @ViewChild('galleryInput') galleryInput!: ElementRef;

  private fb = inject(FormBuilder);
  private newsService = inject(NewsService);
  protected authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  newsForm: FormGroup;
  categories: Category[] = [];
  tags: Tag[] = [];
  selectedTags: number[] = [];
  isLoading = false;
  isEditMode = false;
  newsId?: number;
  mainImagePreview: string | null = null;
  galleryImages: File[] = [];
  galleryPreviews: string[] = [];
  selectedCategory?: Category;

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      // [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  };

  constructor() {
    this.newsForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    // this.loadTags();
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      subtitle: ['', [Validators.maxLength(255)]],
      excerpt: ['', [Validators.required, Validators.maxLength(500)]],
      content: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      main_image_caption: ['', [Validators.maxLength(255)]],
      main_image_alt: ['', [Validators.maxLength(255)]],
      tags: [[]],
      is_published: [this.authService.isSuperAdmin()],
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.newsId = +id;
      this.loadNewsData(this.newsId);
    }
  }

  loadCategories(): void {
    this.newsService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar categorias');
        console.error(error);
      },
    });
  }

  loadTags(): void {
    this.newsService.getTags().subscribe({
      next: (tags) => {
        this.tags = tags;
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar tags');
        console.error(error);
      },
    });
  }

  loadNewsData(id: number): void {
    this.isLoading = true;
    this.newsService.getNewsById(id).subscribe({
      next: (news) => {
        this.newsForm.patchValue({
          title: news.title,
          subtitle: news.subtitle,
          excerpt: news.excerpt,
          content: news.content,
          category_id: news.category_id,
          main_image_caption: news.main_image_caption,
          main_image_alt: news.main_image_alt,
          is_published: Boolean(news.is_published),
          tags: news.tags?.map((tag) => tag.id) || [],
        });

        if (news.main_image) {
          this.mainImagePreview = news.main_image;
        }

        this.selectedTags = news.tags?.map((tag) => tag.id) || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Erro ao carregar notícia');
        console.error(error);
      },
    });
  }

  mainImageFile: File | null = null;

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Selecione uma imagem válida');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.toastr.error('A imagem deve ser menor que 2MB');
        return;
      }

      this.mainImageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      input.value = '';
    }
  }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
          this.toastr.error(`Arquivo ${file.name} não é uma imagem válida.`);
          continue;
        }

        if (file.size > 2 * 1024 * 1024) {
          this.toastr.error(`Arquivo ${file.name} excede 2MB.`);
          continue;
        }

        this.galleryImages.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          this.galleryPreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      input.value = '';
    }
  }

  removeMainImage(): void {
    this.mainImagePreview = null;
    this.mainImageFile = null;
  }

  removeGalleryImage(index: number): void {
    this.galleryImages.splice(index, 1);
    this.galleryPreviews.splice(index, 1);
  }

  insertImageInContent(imageUrl: string): void {
    // quill
    const editor = document.querySelector('.ql-editor') as HTMLElement;
    if (editor) {
      const img = document.createElement('img');
      img.src = imageUrl;
      (img.alt = 'Imagem do conteúdo'), (img.className = 'content-image');
      editor.appendChild(img);
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.newsForm.value

    Object.keys(formValue).forEach(key => {
      if(key !== 'tags' && key !== 'main_image') {
        const value = formValue[key]
        if(typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      }
    })

    if(this.mainImageFile) {
      formData.append('main_image', this.mainImageFile)
    }

    const tags = this.newsForm.value.tags || [];
    tags.forEach((tagId: number) => {
      formData.append('tags[]', tagId.toString());
    });
    return formData;
  }

  onSubmit(): void {
    if (this.newsForm.invalid) {
      this.markFormGroupTouched(this.newsForm);
      this.toastr.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    
    const formData = this.prepareFormData();

    Object.keys(this.newsForm.value).forEach((key) => {
      if (key !== 'tags') {
        formData.append(key, this.newsForm.value[key]);
      }
    });

    if (this.isEditMode && this.newsId) {
      this.updateNews(formData);
    } else {
      this.createNews(formData);
    }
  }
  createNews(formData: FormData): void {
    this.newsService.createNews(formData).subscribe({
      next: (response) => {
        this.toastr.success('Notícia criada com sucesso!');
        // this.router.navigate(['/admin/noticias']);
      },
      error: (error) => {
        this.toastr.error(error.error?.message) || 'Erro ao criar notícia';
        this.isLoading = false;
      },
    });
  }
  updateNews(formData: FormData): void {
    if (!this.newsId) return;

    this.newsService.updateNews(this.newsId, formData).subscribe({
      next: (response) => {
        this.toastr.success('Notícia atualizada com sucesso!');
        this.router.navigate(['/admin/noticias']);
      },
      error: (error) => {
        this.toastr.error(error.error?.message) || 'Erro ao atualizar notícia';
        this.isLoading = false;
      },
    });
  }

  saveDraft(): void {
    this.newsForm.patchValue({ is_published: false });
    this.onSubmit();
  }

  publish(): void {
    if (!this.authService.isSuperAdmin()) {
      this.toastr.error('Apenas administradores podem publicar notícias');
      return;
    }
    this.newsForm.patchValue({ is_published: true });
    this.onSubmit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get title() {
    return this.newsForm.get('title');
  }
  get excerpt() {
    return this.newsForm.get('excerpt');
  }
  get content() {
    return this.newsForm.get('content');
  }
  get category_id() {
    return this.newsForm.get('category_id');
  }
}
