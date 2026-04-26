import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Release Management Tool';
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
}
