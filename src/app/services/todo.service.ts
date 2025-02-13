import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { environment } from '../../environments/environment.prod';
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
        'Authorization': `Bearer ${token}` // ✅ Ensure token is sent
      })
    };
  }

  getTodos(): Observable<TodoResponse[]> {
    return this.http.get<TodoResponse[]>(this.apiUrl, this.getAuthHeaders());
  }

  addTodo(todo: Omit<Todo, 'id'>): Observable<TodoResponse> {
    return this.http.post<TodoResponse>(this.apiUrl, todo, this.getAuthHeaders());
  }

  updateTodo(id: string, updatedTodo: Partial<Todo>): Observable<TodoResponse> {
    return this.http.put<TodoResponse>(`${this.apiUrl}/${id}`, updatedTodo, this.getAuthHeaders());
  }

  deleteTodo(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
