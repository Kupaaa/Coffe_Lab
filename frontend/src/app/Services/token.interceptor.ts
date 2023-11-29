import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if there's a token in local storage.
    const token = localStorage.getItem('token');

    if (token) {
      // Clone the request and add the authorization header with the token.
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpResponse) {
          // Log the URL where the error occurred (optional).
          console.log(err.url);

          if (err.status === 401 || err.status === 403) {
            if (this.router.url === '/') {
            }
            // Do nothing if the user is on the home page.
            else {
              // Clear local storage and navigate to the home page for unauthorized access.
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        }
        return throwError(err);
      })
    );
  }
}
