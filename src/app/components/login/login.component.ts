// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    });
  }

  ngOnInit() {
    // ✅ Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      console.log("🔄 User already logged in, redirecting...");
      this.router.navigate(['/todo']);
    }
  }

  usernameValidator(control: any) {
    const username = control.value;
    if (!username) return null;

    const isNumeric = /^\d+$/.test(username);
    if (isNumeric) return { invalidUsername: true };

    const alphabeticCount = (username.match(/[a-zA-Z]/g) || []).length;
    if (alphabeticCount < 3) return { invalidUsername: true };

    if (username === '_') return { invalidUsername: true };

    const hasInvalidChars = /[^a-zA-Z0-9_]/.test(username);
    if (hasInvalidChars) return { invalidUsername: true };

    return null;
  }

  onUsernameInput(event: any) {
    event.target.value = event.target.value.toLowerCase();
  }

  passwordValidator(control: any) {
    const password = control.value;
    if (!password) return null;

    const numberCount = (password.match(/\d/g) || []).length;
    const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    return numberCount >= 2 && upperCaseCount >= 2 && hasSpecialChar && hasLowerCase
      ? null
      : { invalidPassword: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log("✅ Login successful:", response);

        // ✅ Store token and user details in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('loggedInUser', response.user.username);
        localStorage.setItem('loginTimestamp', Date.now().toString());

        this.isLoading = false;
        this.router.navigate(['/todo']);
      },
      error: (error) => {
        console.error("❌ Login failed:", error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed';
      }
    });

    this.loginForm.reset();
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
