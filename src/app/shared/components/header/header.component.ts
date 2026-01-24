import { Component, Input } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() categories: Category[] = [];
}
