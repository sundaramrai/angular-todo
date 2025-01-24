// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'My Todo CRUD';
  isLoginPage = false;
  isRegisterPage = false;
  isLoggedIn = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login';
        this.isRegisterPage = event.url === '/register';
        this.isLoggedIn = !!localStorage.getItem('loggedInUser');

        // Redirect logged-in users away from login and register pages
        if (this.isLoggedIn && (this.isLoginPage || this.isRegisterPage)) {
          this.router.navigate(['/todo']);
        }

        // Redirect non-logged-in users away from todo page
        if (!this.isLoggedIn && event.url === '/todo') {
          if (this.isLoginPage) {
            this.router.navigate(['/login']);
          } else if (this.isRegisterPage) {
            this.router.navigate(['/register']);
          } else {
            this.router.navigate(['/login']);
          }
        }
      }
    });
  }

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('loggedInUser');
    this.checkLoginTimestamp();
    // Check if user is not logged in and trying to access todo page
    if (!this.isLoggedIn && this.router.url === '/todo') {
      this.router.navigate(['/login']);
    }
  }

  checkLoginTimestamp() {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loginTimestamp) {
      const currentTime = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
      if (currentTime - parseInt(loginTimestamp, 10) > twelveHours) {
        this.logout();
      } else {
        this.setLogoutTimer(twelveHours - (currentTime - parseInt(loginTimestamp, 10)));
      }
    }
  }

  setLogoutTimer(timeout: number) {
    setTimeout(() => {
      this.logout();
    }, timeout);
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginTimestamp');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    console.log('User logged out automatically after 12 hours');
  }

  onLogin() {
    if (this.isLoginPage || this.isRegisterPage) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onRegister() {
    if (this.isRegisterPage) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  onLogout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginTimestamp');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    console.log('User logged out manually', this.isLoggedIn);
  }
}
