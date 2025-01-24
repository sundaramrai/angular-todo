// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    });
  }

  ngOnInit() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      this.router.navigate(['/todo']);
    }
  }

  usernameValidator(control: any) {
    const username = control.value;

    if (!username) {
      return null;
    }

    const isNumeric = /^\d+$/.test(username);
    if (isNumeric) {
      return { invalidUsername: true };
    }

    const alphabeticCount = (username.match(/[a-zA-Z]/g) || []).length;
    if (alphabeticCount < 3) {
      return { invalidUsername: true };
    }

    if (username === '_') {
      return { invalidUsername: true };
    }

    const hasInvalidChars = /[^a-zA-Z0-9_]/.test(username);
    if (hasInvalidChars) {
      return { invalidUsername: true };
    }

    return null;
  }

  onUsernameInput(event: any) {
    const input = event.target;
    input.value = input.value.toLowerCase();
  }

  passwordValidator(control: any) {
    const password = control.value;

    if (!password) {
      return null;
    }

    const numberCount = (password.match(/\d/g) || []).length;
    const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    const valid = numberCount >= 2 && upperCaseCount >= 2 && hasSpecialChar && hasLowerCase;

    if (!valid) {
      return { invalidPassword: true };
    }
    return null;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    const savedData = JSON.parse(localStorage.getItem('registerData') || '[]');

    const user = savedData.find((user: any) => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      localStorage.setItem('loginTimestamp', Date.now().toString());
      this.setLogoutTimer();
      this.router.navigate(['/todo']);
      // console.log('Login successful:', this.loginForm.value);
    } else {
      this.errorMessage = 'Invalid username or password';
      // console.log('Login failed:', this.loginForm.value);
    }
  }

  setLogoutTimer() {
    const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    setTimeout(() => {
      this.logout();
    }, twelveHours);
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginTimestamp');
    this.router.navigate(['/login']);
    // console.log('User logged out automatically after 12 hours');
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
