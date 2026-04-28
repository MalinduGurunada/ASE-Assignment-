import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
<<<<<<< HEAD
import { Router, RouterLink } from '@angular/router';
=======
>>>>>>> shazaan
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
=======
  imports: [CommonModule, ReactiveFormsModule],
>>>>>>> shazaan
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
<<<<<<< HEAD
    private readonly authService: AuthService,
    private readonly router: Router
=======
    private readonly authService: AuthService
>>>>>>> shazaan
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.login(this.form.getRawValue()).subscribe({
<<<<<<< HEAD
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error ?? 'Invalid username or password.';
=======
      next: (response) => {
        this.loading = false;
        this.success = 'Login succeeded. Token saved in local storage.';
        this.tokenPreview = response.accessToken.slice(0, 45) + '...';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error ?? 'Login failed.';
>>>>>>> shazaan
      }
    });
  }

}
