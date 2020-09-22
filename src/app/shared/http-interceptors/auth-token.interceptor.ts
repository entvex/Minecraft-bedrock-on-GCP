import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {mergeMap, switchMap, take} from 'rxjs/operators';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private auth: AngularFireAuth) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.auth.idToken.pipe(
      switchMap((token: any) => {
        take(1);
        if (token) {
          request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        }

        return next.handle(request);

      }));
  }
}
