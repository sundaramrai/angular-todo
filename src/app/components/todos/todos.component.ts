// src/app/components/todos/todos.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Todo } from '../../Todo';

@Component({
  selector: 'app-todos',
  standalone: false,
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  username: string | null = null;
  loggedInUser: any = null;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/todo') {
        this.loadFromLocalStorage();
      }
    });
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.username = this.loggedInUser.username;
    if (this.username) {
      this.loadFromLocalStorage();
    }
  }

  loadFromLocalStorage() {
    if (this.username) {
      const storedTodos = localStorage.getItem(`todos_${this.username}`);
      this.todos = storedTodos ? JSON.parse(storedTodos) : [];
      console.log('Loaded todos from localStorage:', this.todos);
    }
  }

  saveToLocalStorage() {
    if (this.username) {
      localStorage.setItem(`todos_${this.username}`, JSON.stringify(this.todos));
    }
  }

  addTodo(todo: Todo) {
    todo.id = Date.now();
    this.todos.push(todo);
    this.saveToLocalStorage();
    console.log('Added new todo:', {
      title: todo.title,
      description: todo.description,
      id: todo.id,
      timestamp: new Date().toLocaleString(),
    });
  }

  deleteTodo(todo: Todo) {
    this.todos = this.todos.filter((t) => t.id !== todo.id);
    this.saveToLocalStorage();
    console.log('Deleted todo:', {
      title: todo.title,
      id: todo.id,
      timestamp: new Date().toLocaleString(),
    });
  }

  updateTodo(updatedTodo: Todo) {
    const index = this.todos.findIndex((t) => t.id === updatedTodo.id);
    if (index !== -1) {
      const oldTodo = { ...this.todos[index] };
      this.todos[index] = updatedTodo;
      this.saveToLocalStorage();
      console.log('Updated todo:', {
        id: updatedTodo.id,
        oldTitle: oldTodo.title,
        newTitle: updatedTodo.title,
        oldDescription: oldTodo.description,
        newDescription: updatedTodo.description,
        timestamp: new Date().toLocaleString(),
      });
    }
  }

  toggleComplete(todo: Todo) {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveToLocalStorage();
      console.log('Toggled todo completion:', {
        title: todo.title,
        id: todo.id,
        completed: this.todos[index].completed,
        timestamp: new Date().toLocaleString(),
      });
    }
  }
}
