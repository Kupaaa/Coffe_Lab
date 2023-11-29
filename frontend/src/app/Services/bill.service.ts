import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
   // Define the API URL by fetching it from environment settings
   url = environment.apiUrl;

   constructor(private httpClient: HttpClient) { }
 
   // Method to generate a report
   generateReport(data: any) {
     return this.httpClient.post(this.url +
       "/bill/generateReport/", data, {
       headers: new HttpHeaders().set('Content-Type', "application/json")
     });
   }
 
   // Method to retrieve a PDF file as a Blob
   getPDF(data: any): Observable<Blob> {
     return this.httpClient.post(this.url + "/bill/getPdf", data, {
       responseType: 'blob'
     });
   }

   // This method retrieves a list of bills by making an HTTP GET request.
   getBills(){
    return this.httpClient.get(this.url + "/bill/getBills/")
   }

   // This method deletes a bill by its ID using an HTTP DELETE request.
   delete(id:any){
    return this.httpClient.delete(this.url + "/bill/delete/"+id,{
      headers:new HttpHeaders().set('Content-Type', "application/json")
    })
   }
 }