import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // [x: string]: any;
  // Initialize the URL for API calls using the environment configuration.
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  // Method for user signup.
  // Sends a POST request to the signup API endpoint.
  // Accepts user data as a parameter and sets the 'content-Type' header.
  signup(data: any) {
    return this.httpClient.post(this.url + '/user/signup', data, {
      headers: new HttpHeaders().set('content-Type', "application/json"),
    });
  }

  // Method for handling password reset requests.
  // Sends a POST request to the forgotPassword API endpoint.
  // Accepts user data as a parameter and sets the 'content-Type' header.
  forgotPassword(data: any) {
    return this.httpClient.post(this.url + '/user/forgotPassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Method for user Login.
  // Sends a POST request to the signup API endpoint.
  // Accepts user data as a parameter and sets the 'content-Type' header. 
  login(data: any) {
    return this.httpClient.post(this.url + '/user/login', data, {
      headers: new HttpHeaders().set('Content-Type', "application/json"),
    });
  }

  checkToken() {
    // Send an HTTP GET request to the server to check the user's token validity.
    return this.httpClient.get(this.url + '/user/checkToken');
  }

  // Send an HTTP POST request to change a user's password.
  changePassword(data: any) {
    return this.httpClient.post(
      this.url + '/user/changePassword', // URL for the POST request
      data,
      {
        // The data to be sent in the request body
        headers: new HttpHeaders().set('Content-Type', 'application/json'), // Set request headers
      }
    );
  }

  // Define a method to retrieve user data
  getUsers(){
    return this.httpClient.get(this.url + "/user/get");
  }

  // Define a method to update user data 
  update(data:any){
    return this.httpClient.patch(this.url+ "/user/update/",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }

    // Method for deleting a User its ID
    delete(id: any) {
      return this.httpClient.delete(this.url + '/user/delete/' + id, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }
}
