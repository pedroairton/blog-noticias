import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from "../../../../shared/components/header-admin/header-admin.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
