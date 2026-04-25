import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    private readonly authService: AuthService
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
      next: (response) => {
        this.loading = false;
        this.success = 'Login succeeded. Token saved in local storage.';
        this.tokenPreview = response.accessToken.slice(0, 45) + '...';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error ?? 'Login failed.';
      }
    });
  }

}
