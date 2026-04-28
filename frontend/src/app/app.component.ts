import { Component } from '@angular/core';
<<<<<<< HEAD
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
=======
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
>>>>>>> shazaan

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
=======
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
>>>>>>> shazaan
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Release Management Tool';
<<<<<<< HEAD
  productsOpen = true;
  deploymentsOpen = true;

  constructor(readonly router: Router, private readonly authService: AuthService) {}

  get isAuthRoute(): boolean {
    return this.router.url.startsWith('/auth');
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/auth/login']);
  }
=======
>>>>>>> shazaan
}
