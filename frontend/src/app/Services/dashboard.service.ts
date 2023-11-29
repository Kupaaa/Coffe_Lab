import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // Store the base API URL from the environment configuration.
  url = environment.apiUrl;

  // Constructor for the DashboardService class.
  constructor(private httpclient: HttpClient) {}

  // Method to fetch dashboard details from the API.
  getDetails() {
    return this.httpclient.get(this.url + '/dashboard/details/');
  }
}
