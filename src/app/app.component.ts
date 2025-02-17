// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'TascMaster';
  isLoginPage = false;
  isRegisterPage = false;
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login';
        this.isRegisterPage = event.url === '/register';
        this.isLoggedIn = this.authService.isLoggedIn();

        // ✅ Prevent unnecessary redirects
        if (this.isLoggedIn && (this.isLoginPage || this.isRegisterPage)) {
          if (this.router.url !== '/todo') {
            console.log("🔄 Redirecting to /todo (already logged in)");
            this.router.navigate(['/todo']);
          }
        }

        if (!this.isLoggedIn && event.url === '/todo') {
          if (this.router.url !== '/login') {
            console.log("🔄 Redirecting to /login (user not logged in)");
            this.router.navigate(['/login']);
          }
        }
      }
    });
  }

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');

    // ✅ Prevent redundant navigation loops
    if (!this.isLoggedIn && this.router.url !== '/login') {
      console.log("🔄 Redirecting to login page (user not logged in)");
      this.router.navigate(['/login']);
    }

    // ✅ Check if auto-logout should be triggered
    this.checkLoginTimestamp();
  }

  checkLoginTimestamp() {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loginTimestamp) {
      const currentTime = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000;

      if (currentTime - parseInt(loginTimestamp, 10) > twelveHours) {
        console.log("🔴 Auto-logging out due to inactivity");
        this.logout();
      } else {
        const remainingTime = twelveHours - (currentTime - parseInt(loginTimestamp, 10));
        console.log(`⏳ Setting auto-logout timer for ${remainingTime / 1000 / 60} minutes`);
        this.setLogoutTimer(remainingTime);
      }
    }
  }

  setLogoutTimer(timeout: number) {
    setTimeout(() => {
      console.log("⏳ Auto-logging out user...");
      this.logout();
    }, timeout);
  }

  logout() {
    console.log("🔴 Logging out user...");

    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginTimestamp');
    localStorage.removeItem('token');

    this.isLoggedIn = false;

    // ✅ Prevent multiple redirections
    if (this.router.url !== '/login') {
      console.log("🔄 Redirecting to login page...");
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    this.logout(); // ✅ Ensure logout works correctly
  }

  get loggedInUser(): string | null {
    return this.authService.loggedInUser;
  }
}
