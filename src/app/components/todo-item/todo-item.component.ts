// src/app/components/todo-item/todo-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../Todo';

@Component({
  selector: 'app-todo-item',
  standalone: false,
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoDelete = new EventEmitter<string>();
  @Output() todoUpdate = new EventEmitter<Todo>();
  @Output() todoToggle = new EventEmitter<Todo>();

  isEditing = false;
  editTitle = '';
  editDescription = '';

  constructor(private todoService: TodoService) {}

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.todo.title;
    this.editDescription = this.todo.description || '';
  }

  saveEdit() {
    this.todoUpdate.emit({
      id: this.todo.id,
      title: this.editTitle,
      description: this.editDescription,
      completed: this.todo.completed
    }); // ✅ Emits full updated Todo object
    this.isEditing = false;
  }

  onDelete() {
  console.log("🗑️ Emitting delete event for ID:", this.todo.id);
  this.todoDelete.emit(this.todo.id); // ✅ Pass `_id` as a string
}

onToggleComplete() {
  console.log("🔄 Emitting toggle event for ID:", this.todo.id, "Current Status:", this.todo.completed);
  this.todoToggle.emit(this.todo); // ✅ Emit entire todo object
}


  cancelEdit() {
    this.isEditing = false;
  }
}
