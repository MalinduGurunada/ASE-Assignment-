import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
<<<<<<< HEAD
import { Router, RouterLink } from '@angular/router';
=======
>>>>>>> shazaan
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models';

@Component({
  selector: 'app-registration',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
=======
  imports: [CommonModule, ReactiveFormsModule],
>>>>>>> shazaan
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['VIEWER' as Role, Validators.required]
  });

  loading = false;
  error = '';
  success = '';

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

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
<<<<<<< HEAD
        this.router.navigate(['/dashboard']);
=======
        this.loading = false;
        this.success = 'Registration succeeded and token was saved.';
        this.form.patchValue({ password: '' });
>>>>>>> shazaan
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error ?? 'Registration failed.';
      }
    });
  }

}
