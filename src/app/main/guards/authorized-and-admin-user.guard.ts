import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import {tap, first, map} from 'rxjs/operators';
import { RoleType } from '../models/role.model';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FolderNavigationService } from 'app/navigation/folder-navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedAndAdminUserGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private folderNavigationService: FolderNavigationService) {

  } 
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      return this.authenticationService.user$.pipe(
        map(user => user && user.id != undefined && user.role.type == RoleType.SuperAdmin),
        tap(isInRole => {
          if (!isInRole) {
            this.folderNavigationService.onNavigationChanged
              .subscribe((folders) => {

                if (folders.length > 0) {
                  var folder = folders.find(fold => fold.title == "My Folder");

                  if (folder) {
                    this.router.navigate([folder.url]);
                  }
                  else {
                    folder = folders[0];

                    if (folder) {
                      this.router.navigate([folder.url]);
                    }
                  }  
                }
                else {
                  this.router.navigate(['/info/faq']);
                }
              });  
          }
        }
      ));
  }
}
