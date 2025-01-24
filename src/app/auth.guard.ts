// // src/app/auth.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const isLoggedIn = !!localStorage.getItem('loggedInUser');
//     if (!isLoggedIn) {
//       const currentUrl = state.url;
//       if (currentUrl === '/todo') {
//         // If the user is trying to access the /todo route, do not redirect
//         return false;
//       }
//       this.router.navigate(['/login']);
//       return false;
//     }
//     return true;
//   }
// }
