import { Component, Input } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() categories: Category[] = [];
}
