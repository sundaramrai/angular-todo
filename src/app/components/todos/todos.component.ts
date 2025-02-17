// src/app/components/todos/todos.component.ts
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo, TodoResponse } from '../../Todo';

@Component({
  selector: 'app-todos',
  standalone: false,
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  loading = false;
  error: string | null = null;
  username: string | null = null; // ✅ Added username property

  constructor(private todoService: TodoService, private authService: AuthService) {}

  ngOnInit() {
    this.fetchTodos();
    this.username = this.authService.loggedInUser;
  }

  fetchTodos() {
    this.loading = true;
    this.todoService.getTodos().subscribe(
      (todos) => {
        this.todos = todos.map(todo => ({
          ...todo,
          id: String(todo._id), // ✅ Ensure `id` is stored as a string
          userId: todo.userId,
          completed: todo.completed // ✅ Store completed status correctly
        }));
        console.log("✅ Fetched todos:", this.todos);
        this.loading = false;
      },
      (error) => {
        console.error("❌ Error fetching todos:", error);
        this.error = "Error fetching todos";
        this.loading = false;
      }
    );
  }

  addTodo(newTodo: Omit<Todo, 'id'>) {
    this.todoService.addTodo(newTodo).subscribe(
      (todoResponse) => {
        const addedTodo: Todo = {
          ...todoResponse,
          id: todoResponse._id // ✅ Convert `_id` to number
        };
        this.todos.push(addedTodo);
      },
      (error) => {
        this.error = 'Error adding todo';
      }
    );
  }

  deleteTodo(todoId: string) {
    if (!todoId) {
      console.error("❌ Error: Todo ID is undefined");
      this.error = "Invalid Todo ID";
      return;
    }

    console.log("🗑️ Sending delete request for Todo ID:", todoId);

    this.todoService.deleteTodo(todoId).subscribe(
      () => {
        this.todos = this.todos.filter(todo => todo.id !== todoId); // ✅ Ensure comparison is with a string
        console.log("✅ Todo deleted successfully:", todoId);
      },
      (error) => {
        console.error("❌ Error deleting todo:", error);
        this.error = error.error?.message || "Error deleting todo";
      }
    );
  }

  updateTodo(updatedTodo: Todo) {
    this.todoService.updateTodo(updatedTodo.id.toString(), updatedTodo).subscribe(
      (response) => {
        console.log("✅ Todo updated successfully:", response); // ✅ Log success response
        this.todos = this.todos.map(todo =>
          todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
        );
      },
      (error) => {
        console.error("❌ Error updating todo:", error); // ✅ Log actual error
        this.error = error.error?.message || 'Error updating todo';
      }
    );
  }

  toggleComplete(todo: Todo) {
    if (!todo.id) {
      console.error("❌ Error: Todo ID is undefined");
      this.error = "Invalid Todo ID";
      return;
    }
    console.log("🔄 Sending toggle request for ID:", todo.id, "Current Status:", todo.completed);
    this.todoService.updateTodo(todo.id.toString(), { completed: !todo.completed }).subscribe(
      (updatedTodo) => {
        console.log("✅ Todo toggled successfully:", updatedTodo);

        // ✅ Update UI based on the response
        this.todos = this.todos.map(t =>
          t.id === updatedTodo._id ? { ...t, completed: updatedTodo.completed } : t
        );
      },
      (error) => {
        console.error("❌ Error toggling todo:", error);
        this.error = error.error?.message || "Error updating todo status";
      }
    );
  }

}
