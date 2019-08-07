import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import {tap, first, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedUserGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) {

  } 

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      return this.authenticationService.isLoggedIn$.pipe(
        tap(isLoggedIn => {
          if (!isLoggedIn) {
            this.router.navigate(['/auth/login']);
          }
        }));
  }
}
