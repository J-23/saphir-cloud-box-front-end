import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    var token = localStorage.getItem('access_token');

    request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })

    return next.handle(request);
  }
}

