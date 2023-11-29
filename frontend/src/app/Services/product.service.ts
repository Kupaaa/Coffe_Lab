import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.apiUrl; // Base URL for API endpoints

  constructor(private httpClient: HttpClient) {}

  // Method for adding a new product
  add(data: any) {
    return this.httpClient.post(this.url + '/product/add/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Method for updating an existing product
  update(data: any) {
    return this.httpClient.patch(this.url + '/product/update/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Method for fetching a list of products
  getProduct() {
    return this.httpClient.get(this.url + '/product/get');
  }

  // Method for updating the status of a product (e.g., activate or deactivate)
  updateStatus(data: any) {
    return this.httpClient.patch(this.url + '/product/updateStatus/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Method for deleting a product by its ID
  delete(id: any) {
    return this.httpClient.delete(this.url + '/product/delete/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Method for get Product by Category
  getproductsByCategory(id: any) {
    return this.httpClient.get(this.url + "/product/getByCategory/ "+ id);
  }

  // Method for get by ID
  getById(id: any) {
    return this.httpClient.get(this.url + "/product/getById/" + id);
  }
}
