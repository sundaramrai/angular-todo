import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Todo, TodoResponse } from '../Todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      withCredentials: false
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend error: ${error.status}`, error.error);
    if (error.status === 0) {
      console.error('Network error or CORS issue:', error);
    }
    return throwError(() => error);
  }

  checkApiHealth(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/health`);
  }

  getTodos(): Observable<TodoResponse[]> {
    return this.http.get<TodoResponse[]>(this.apiUrl, this.getAuthHeaders())
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addTodo(todo: Omit<Todo, 'id'>): Observable<TodoResponse> {
    return this.http.post<TodoResponse>(this.apiUrl, todo, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  updateTodo(id: string, updatedTodo: Partial<Todo>): Observable<TodoResponse> {
    return this.http.put<TodoResponse>(`${this.apiUrl}/${id}`, updatedTodo, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  deleteTodo(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }
}
