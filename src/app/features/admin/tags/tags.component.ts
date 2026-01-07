import { Component, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { ToastrService } from 'ngx-toastr';
import { Tag } from '../../../core/models/tag.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tags',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
protected newsService = inject(NewsService);
  private toastr = inject(ToastrService);

  tags: Tag[] = [];

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

  ngOnInit(): void {
    this.loadTags();
  }
}
