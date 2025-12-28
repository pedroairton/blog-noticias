import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'blog';

  hidePublic: boolean = false;

  constructor(private router: Router){
    this.router.events.subscribe(e => {
      if(e instanceof NavigationEnd){
        if(e.url.includes('admin') || e.url.includes('login')){
          this.hidePublic = true;
        } else {
          this.hidePublic = false;
        }
      }
    })
  }
}
