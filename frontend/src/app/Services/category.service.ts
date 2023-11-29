import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Define the API base URL from environment configuration
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  // Method to add a new category
  add(data: any) {
    return this.httpClient.post(this.url + '/category/add/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Method to update an existing category
  update(data: any) {
    return this.httpClient.patch(this.url + '/category/update/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Method to retrieve a list of categories
  getCategorys() {
    return this.httpClient.get(this.url + '/category/get');
  }

  // Method for deleting a product by its ID
  delete(id: any) {
    return this.httpClient.delete(this.url + '/category/delete/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // updateStatus(data: any) {
  //   return this.httpClient.patch(this.url + "/category/updateStatus/", data, {
  //     headers: new HttpHeaders().set('content-Type', "application/json")
  //   });
  // }
}
