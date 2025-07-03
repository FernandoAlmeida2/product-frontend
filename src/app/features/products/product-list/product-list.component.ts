import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Product } from '../../../models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Products</h1>
        <button mat-raised-button color="primary" routerLink="/products/new">
          <mat-icon>add</mat-icon>
          New Product
        </button>
      </div>

      <mat-form-field class="filter">
        <mat-label>Filter</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Type to filter..." #input>
      </mat-form-field>

      <div class="mat-elevation-z8">
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
            <mat-cell *matCellDef="let product">{{product.name}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="category">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Category</mat-header-cell>
            <mat-cell *matCellDef="let product">{{product.category}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="price">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Price</mat-header-cell>
            <mat-cell *matCellDef="let product">{{product.price | currency}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let product">
              <button mat-icon-button color="primary" [routerLink]="['/products', product.id, 'edit']">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProduct(product)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">
              No products matching the filter "{{input.value}}"
            </td>
          </tr>
        </mat-table>

        <mat-paginator 
          [pageSizeOptions]="[5, 10, 25, 100]"
          aria-label="Select page of products">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .filter {
      width: 100%;
      margin-bottom: 20px;
    }

    .mat-mdc-row:hover {
      background: whitesmoke;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .mat-mdc-cell {
      padding: 8px 16px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  protected dataSource!: MatTableDataSource<Product>;
  protected displayedColumns: string[] = ['name', 'category', 'price', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  protected deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.deleteProduct(product.idProduct!).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.loadProducts();
        this.snackBar.open('Product deleted successfully', 'Close', {
          duration: 3000
        });
      });
    }
  }

  private loadProducts() {
    this.productService.getProducts().pipe(
      takeUntil(this.destroy$)
    ).subscribe(products => {
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
