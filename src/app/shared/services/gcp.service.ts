import { Injectable } from '@angular/core';
import {Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ServerStatus} from '../classes/server-status';
import { environment } from '../../../environments/environment';
import {Start} from '../classes/start';

@Injectable({
  providedIn: 'root'
})
export class GcpService {
  private API_URL = environment.API_URL;

  constructor(private httpClient: HttpClient) {

  }

   public GetServerStatus(): Observable<ServerStatus[]> {
     return this.httpClient.get<ServerStatus[]>(`${this.API_URL}/api/status`)
       .pipe(
         catchError(this.handleError<ServerStatus[]>('GetServerStatus', []))
       );
  }

  public StartServer(): Observable<Start[]> {
    return this.httpClient.get<Start[]>(`${this.API_URL}/api/start`)
      .pipe(
        catchError(this.handleError<Start[]>('StartServer', []))
      );
  }

  public StopServer(): Observable<ServerStatus[]> {
    return this.httpClient.get<ServerStatus[]>(`${this.API_URL}/api/stop`)
      .pipe(
        catchError(this.handleError<ServerStatus[]>('StopServer', []))
      );
  }

  public GetServerCheckClaims(): Observable<ServerStatus[]> {
    return this.httpClient.get<ServerStatus[]>(`${this.API_URL}/api/checkclaims`)
      .pipe(
        catchError(this.handleError<ServerStatus[]>('checkclaims', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
