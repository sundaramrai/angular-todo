import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';
import { Todo, TodoResponse } from '../Todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<TodoResponse[]> {
    return this.http.get<TodoResponse[]>(this.apiUrl);
  }

  addTodo(todo: Omit<Todo, 'id'>): Observable<TodoResponse> {
    return this.http.post<TodoResponse>(this.apiUrl, todo);
  }

  updateTodo(id: string, updatedTodo: Partial<Todo>): Observable<TodoResponse> {
    return this.http.put<TodoResponse>(`${this.apiUrl}/${id}`, updatedTodo);
  }

  deleteTodo(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
