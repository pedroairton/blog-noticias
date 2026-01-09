import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { ToastrService } from 'ngx-toastr';
import { Tag } from '../../../core/models/tag.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-tags',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
protected newsService = inject(NewsService);
  private toastr = inject(ToastrService);
  isLoading = false;

  tags: Tag[] = [];

  loadTags(): void {
    this.isLoading = true;
    this.newsService.getTags().subscribe({
      next: (response: any) => {
        this.tags = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Erro ao carregar tags');
        console.error(error);
      },
    });
  }

  ngOnInit(): void {
    this.loadTags();
  }
}
