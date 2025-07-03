import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { Product, PRODUCT_CATEGORIES } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode() ? 'Edit Product' : 'Create Product' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter product name">
              <mat-error *ngIf="productForm.get('name')?.errors?.['required']">
                Name is required
              </mat-error>
              <mat-error *ngIf="productForm.get('name')?.errors?.['minlength']">
                Name must be at least 3 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category">
                <mat-option *ngFor="let category of categories" [value]="category">
                  {{category}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="productForm.get('category')?.errors?.['required']">
                Category is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Price</mat-label>
              <input matInput type="number" formControlName="price" placeholder="Enter price">
              <mat-error *ngIf="productForm.get('price')?.errors?.['required']">
                Price is required
              </mat-error>
              <mat-error *ngIf="productForm.get('price')?.errors?.['min']">
                Price must be greater than 0
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid">
                {{ isEditMode() ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  protected productForm: FormGroup;
  protected categories = PRODUCT_CATEGORIES;
  protected isEditMode = signal(false);
  private productId: string | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId = id;
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProduct(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(product => {
      this.productForm.patchValue({
        name: product.name,
        category: product.category,
        price: product.price
      });
    });
  }

  protected onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      
      if (this.isEditMode()) {
        product.idProduct = this.productId!;
        product.updatedAt = new Date();
      } else {
        product.createdAt = new Date();
        product.updatedAt = new Date();
      }

      const action$ = this.isEditMode()
        ? this.productService.updateProduct(product)
        : this.productService.createProduct(product);

      action$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  protected goBack(): void {
    this.router.navigate(['/products']);
  }
}
