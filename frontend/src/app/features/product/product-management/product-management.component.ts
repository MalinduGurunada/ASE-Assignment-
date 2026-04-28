import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent implements OnInit {
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  products: Product[] = [];
  loading = false;
  error = '';
  showForm = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.list().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  createProduct(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.productService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({ name: '', description: '' });
        this.loadProducts();
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to create product.';
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to delete product.';
      }
    });
  }
}