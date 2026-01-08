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
import { MatDialog } from '@angular/material/dialog';
import { GalleryImageDialogComponent } from '../../dialog/gallery-image-dialog/gallery-image-dialog.component';
import { environment } from '../../../../../environments/environment';
import { env } from 'process';

interface GalleryImage {
  id?: number;
  file: File | null;
  caption: string;
  alt_text: string;
  preview: string;
  placeholder: string;
  originalImage?: any;
  isExisting?: boolean;
}

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
  private dialog = inject(MatDialog);

  newsForm: FormGroup;
  categories: Category[] = [];
  tags: Tag[] = [];
  selectedTags: number[] = [];
  isLoading = false;
  isEditMode = false;
  newsId?: number;
  mainImagePreview: string | null = null;
  galleryImages: GalleryImage[] = [];
  galleryPreviews: string[] = [];
  existingGalleryImages: GalleryImage[] = [];
  selectedCategory?: Category;

  mainImageFile: File | null = null;

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
    this.loadTags();
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
      next: (response: any) => {
        this.tags = response.data;
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
        // Usar conteúdo original (com URLs)
        this.newsForm.patchValue({
          title: news.title,
          subtitle: news.subtitle,
          excerpt: news.excerpt,
          content: news.content, // Usar content, não content_with_full_urls
          category_id: news.category_id,
          main_image_caption: news.main_image_caption,
          main_image_alt: news.main_image_alt,
          is_published: Boolean(news.is_published),
          tags: news.tags?.map((tag) => tag.id) || [],
        });
  
        if (news.main_image_url) {
          console.log(news.main_image_url);
          console.log(news);

          this.mainImagePreview = news.main_image_url;
        } else if (news.main_image){
          this.mainImagePreview = environment.storageUrl +'/'+ news.main_image;
        }
  
        if (this.isEditMode) {
          this.loadGalleryImages(id);
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

  loadGalleryImages(newsId:number): void {
    this.newsService.getGallery(newsId).subscribe({
      next: ((images: any[]) => {
        this.existingGalleryImages = images.map((img, index) => ({
          id: img.id,
          file: null as any, // Não temos o File original
          caption: img.caption || '',
          alt_text: img.alt_text || '',
          preview: img.image_url || img.thumbnail_url,
          placeholder: `{{EXISTING_IMAGE_${img.id}}}`,
          originalImage: img, // Salvar objeto original para referência
          isExisting: true,
        }))

        this.galleryImages = [...this.existingGalleryImages]

        this.updateContentWithGalleryPlaceholders()
      }),
      error: (error) => {
        this.toastr.error('Erro ao carregar imagens da galeria');
        console.error(error);
      }
    })
  }

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

        // this.galleryImages.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          const galleryImage: GalleryImage = {
            file: file,
            caption: '',
            alt_text: '',
            preview: reader.result as string,
            placeholder: `{{IMAGE_PLACEHOLDER_${this.galleryImages.length}}}`
          }
          this.galleryImages.push(galleryImage)
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
  }

  openImageDialog(index: number): void {
    const image = this.galleryImages[index]

    const dialogRef = this.dialog.open(GalleryImageDialogComponent, {
      width: '500px',
      data: {
        caption: image.caption,
        alt_text: image.alt_text
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.galleryImages[index] = {
          ...this.galleryImages[index],
          caption: result.caption,
          alt_text: result.alt_text
        }
      }
    })
  }

  insertImageInContent(index: number): void {
    const image = this.galleryImages[index]
    // quill
    const quillEditor = document.querySelector('.ql-editor') as HTMLElement;
    if (quillEditor) {
      const img = document.createElement('img');
      img.src = image.preview;
      img.alt = image.alt_text || 'Imagem do conteúdo'
      img.className = 'content-image'
      img.setAttribute('data-placeholder', image.placeholder)
      quillEditor.appendChild(img);

      // this.newsForm.patchValue({ content: quillEditor.innerHTML });
    }
  }
  private updateContentWithGalleryPlaceholders(): void {
    let content = this.newsForm.get('content')?.value

    if(!content || this.existingGalleryImages.length === 0){
      return
    }

    this.existingGalleryImages.forEach(galleryImage => {
      if(galleryImage.preview && galleryImage.originalImage?.image_path){
        const imageUrl = galleryImage.preview
        const escapedUrl = imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(escapedUrl, 'g')

        content = content.replace(regex, galleryImage.placeholder)
      }
    })
    
    // this.newsForm.patchValue({ content })
  }
  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.newsForm.value;

    // Adicionar campos básicos
    Object.keys(formValue).forEach((key) => {
      if (key !== 'tags' && key !== 'main_image') {
        const value = formValue[key];
        // Converter valores booleanos para string
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    });

    // Adicionar imagem principal se existir
    if (this.mainImageFile) {
      formData.append(
        'main_image',
        this.mainImageFile,
        this.mainImageFile.name
      );
    }

    // Adicionar tags
    const tags = formValue.tags || [];
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
  
    // Processar imagens do conteúdo (isso agora manterá URLs das imagens existentes)
    const processed = this.processContentImages(this.newsForm.value.content);
  
    // Atualizar conteúdo com placeholders APENAS para novas imagens
    this.newsForm.patchValue({ content: processed.content });
  
    const formData = this.prepareFormData();
  
    if (this.isEditMode && this.newsId) {
      this.updateNews(formData, processed.images, processed.existingImageIds);
    } else {
      this.createNews(formData, processed.images, processed.existingImageIds);
    }
  }
  createNews(formData: FormData, galleryImages: GalleryImage[], existingImageIds: number[]): void {
    this.newsService.createNews(formData).subscribe({
      next: (response: any) => {
        const newsId = response.news.id;
        this.toastr.success('Notícia criada com sucesso!');
        // this.router.navigate(['/admin/noticias']);
        console.log(galleryImages);
        
        if(galleryImages.length > 0) {
          this.uploadGalleryImages(newsId, galleryImages, existingImageIds)
        } else {
          this.isLoading = false
          // this.router.navigate(['/admin/noticias'])
        }
      },
      error: (error) => {
        this.toastr.error(error.error?.message) || 'Erro ao criar notícia';
        this.isLoading = false;
      },
    });
  }
  updateNews(formData: FormData, galleryImages: GalleryImage[], existingImageIds: number[]): void {
    if (!this.newsId) return;
  
    this.newsService.updateNews(this.newsId, formData).subscribe({
      next: (response: any) => {
        this.toastr.success('Notícia atualizada com sucesso!');
        
        // Só fazer upload de novas imagens (não existentes)
        const newImages = galleryImages.filter(img => !img.isExisting);
        
        if (newImages.length > 0) {
          this.uploadGalleryImages(this.newsId!, newImages, existingImageIds);
        } else {
          this.isLoading = false;
          this.router.navigate(['/admin/noticias']);
        }
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
  private uploadGalleryImages(newsId: number, galleryImages: GalleryImage[], existingImageIds: number[] = []): void {
    if (galleryImages.length === 0) {
      this.isLoading = false;
      this.router.navigate(['/admin/noticias']);
      return;
    }
  
    const galleryFormData = new FormData();
    
    // Adicionar apenas novas imagens
    galleryImages.forEach((image, index) => {
      if (image.file) { // Apenas se tiver arquivo (nova imagem)
        galleryFormData.append(`images[${index}]`, image.file);
        galleryFormData.append(`captions[${index}]`, image.caption);
        galleryFormData.append(`alt_texts[${index}]`, image.alt_text);
      }
    });
  
    // Adicionar IDs de imagens existentes para referência
    if (existingImageIds.length > 0) {
      galleryFormData.append('existing_image_ids', JSON.stringify(existingImageIds));
    }
  
    this.newsService.uploadGalleryImages(newsId, galleryFormData).subscribe({
      next: (response: any) => {
        this.updateContentWithRealImageUrls(newsId, response.images, existingImageIds);
      },
      error: (error) => {
        console.error('Erro ao enviar imagens da galeria', error);
        this.toastr.warning('Notícia salva, mas algumas imagens não foram enviadas');
        this.isLoading = false;
        this.router.navigate(['/admin/noticias']);
      }
    });
  }
  private updateContentWithRealImageUrls(newsId: number, uploadedImages: any[], existingImageIds: number[] = []): void {
    let content = this.newsForm.value.content;
    let needsUpdate = false;
  
    uploadedImages.forEach((uploadedImage) => {
      const galleryImage = this.galleryImages.find(
        img => img.file?.name === uploadedImage.original_name
      );
  
      if (galleryImage && uploadedImage.image_path) {
        const imageUrl = uploadedImage.image_path;
        const fullImageUrl = `${environment.apiUrl.replace('/api', '')}/storage/${imageUrl}`;
        
        // Substituir apenas placeholders de novas imagens
        if (content.includes(galleryImage.placeholder)) {
          content = content.replace(
            new RegExp(galleryImage.placeholder, 'g'),
            fullImageUrl
          );
          needsUpdate = true;
        }
      }
    });
  
    // Para imagens existentes, não precisamos substituir nada - elas já têm URLs
  
    if (needsUpdate) {
      // Atualizar o form com o novo conteúdo
      this.newsForm.patchValue({ content });
  
      // Criar FormData completo usando prepareFormData
      const formData = this.prepareFormData();
  
      // Atualizar novamente a notícia com tudo
      this.newsService.updateNews(newsId, formData).subscribe({
        next: () => {
          this.toastr.success('Imagens da galeria enviadas com sucesso!');
          this.isLoading = false;
          this.router.navigate(['/admin/noticias']);
        },
        error: (error) => {
          console.error('Erro ao atualizar conteúdo com URLs:', error);
          this.toastr.warning('Imagens enviadas, mas conteúdo não foi atualizado');
          this.isLoading = false;
          this.router.navigate(['/admin/noticias']);
        }
      });
    } else {
      // Nenhuma substituição foi necessária
      this.toastr.success('Imagens da galeria enviadas com sucesso!');
      this.isLoading = false;
      this.router.navigate(['/admin/noticias']);
    }
  }
  // Método para extrair e processar imagens base64 do conteúdo
  private processContentImages(content: string): {
    content: string;
    images: GalleryImage[];
    existingImageIds: number[];
  } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const imgElements = doc.getElementsByTagName('img');
    const processedImages: GalleryImage[] = [];
    const existingImageIds: number[] = [];
  
    Array.from(imgElements).forEach((img) => {
      const src = img.getAttribute('src');
      const placeholder = img.getAttribute('data-placeholder');
      const imageId = img.getAttribute('data-image-id');
      console.log(img);
      
  
      // 1. Imagem existente da galeria (já rastreada)
      if (imageId) {
        const id = parseInt(imageId);
        existingImageIds.push(id);
        
        // Manter a URL original, mas garantir que o placeholder está definido
        if (!placeholder) {
          img.setAttribute('data-placeholder', `{{EXISTING_IMAGE_${id}}}`);
        }
      }
      // 2. Imagem existente sem data-image-id (detectar por URL)
      else if (src && src.startsWith('http') && this.existingGalleryImages.length > 0) {
        const existingImage = this.existingGalleryImages.find(
          imgData => imgData.preview === src || 
                    (imgData.originalImage?.image_url && imgData.originalImage.image_url === src)
        );
  
        if (existingImage && existingImage.id) {
          existingImageIds.push(existingImage.id);
          img.setAttribute('data-placeholder', existingImage.placeholder);
          img.setAttribute('data-image-id', existingImage.id.toString());
        }
      }
      // 3. Placeholder de nova imagem
      else if (placeholder && placeholder.startsWith('{{IMAGE_PLACEHOLDER_')) {
        const galleryIndex = this.galleryImages.findIndex(
          imgData => imgData.placeholder === placeholder && !imgData.isExisting
        );
  
        if (galleryIndex !== -1) {
          const galleryImage = this.galleryImages[galleryIndex];
          
          if (!processedImages.some(img => img.placeholder === placeholder)) {
            processedImages.push(galleryImage);
          }
        }
      }
      // 4. Imagem base64 (nova imagem colada/arrastada)
      if (src && src.startsWith('data:image')) {
        console.log(img);
        
        const file = this.base64ToFile(src, `gallery-${Date.now()}.jpg`);
        const placeholder = `{{IMAGE_PLACEHOLDER_${processedImages.length}}}`;
        
        const galleryImage: GalleryImage = {
          file: file,
          caption: '',
          alt_text: img.getAttribute('alt') || '',
          preview: src,
          placeholder: placeholder
        };
        
        img.setAttribute('src', placeholder);
        img.setAttribute('data-placeholder', placeholder);
        
        processedImages.push(galleryImage);
      }
      else{
        console.error('Imagem não processada:', img);
        return
      }
    });
  
    return {
      content: doc.body.innerHTML,
      images: processedImages,
      existingImageIds
    };
  }

  // Método para converter base64 para File
  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  get title() {
    return this.newsForm.get('title');
  }
  get excerpt() {
    return this.newsForm.get('excerpt');
  }
  get content() {
    return this.newsForm.get('content_with_full_urls');
  }
  get category_id() {
    return this.newsForm.get('category_id');
  }
}
