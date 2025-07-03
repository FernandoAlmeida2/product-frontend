import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductStats, CategoryDistribution } from '../../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.idProduct}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductStats(): Observable<ProductStats> {
    return this.getProducts().pipe(
      map(products => {
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, product) => sum + product.price, 0);
        const averagePrice = totalValue / totalProducts;

        // Calculate category distribution
        const categoryMap = new Map<string, number>();
        products.forEach(product => {
          categoryMap.set(
            product.category,
            (categoryMap.get(product.category) || 0) + 1
          );
        });

        const categoryDistribution: CategoryDistribution[] = Array.from(categoryMap.entries())
          .map(([category, count]) => ({ category, count }));

        return {
          totalProducts,
          averagePrice,
          totalValue,
          categoryDistribution
        };
      })
    );
  }
}
