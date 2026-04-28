import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';
  success = '';
  tokenPreview = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.success = '';
    this.tokenPreview = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.success = 'Login succeeded. Token saved in local storage.';
        if (response && response.accessToken) {
          this.tokenPreview = response.accessToken.slice(0, 45) + '...';
        }
        // Delay redirect slightly so user can see the success state (optional but nice)
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error ?? 'Invalid username or password.';
      }
    });
  }
}