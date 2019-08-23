import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import {tap, first, map} from 'rxjs/operators';
import { RoleType } from '../models/role.model';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedAndAdminUserGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private _fuseNavigationService: FuseNavigationService) {

  } 
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      return this.authenticationService.user$.pipe(
        map(user => user && user.id != undefined && user.role.type == RoleType.SuperAdmin),
        tap(isInRole => {
          if (!isInRole) {

            var navigation = this._fuseNavigationService.getCurrentNavigation();
            
            if (navigation) {
              var currentNav = navigation.find(nav => nav.id == 'file-manager');

              if (currentNav) {
                var child = currentNav.children.find(ch => ch.title == 'My Folder');
                this.router.navigate([child.url]);
              }
              else {
                this.router.navigate(['/auth/login']);
              }
            }
            else {
              this.router.navigate(['/auth/login']);
            }
          }
        }
      ));
  }
}
