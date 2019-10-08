import { Component, OnDestroy, OnInit, ViewEncapsulation, ɵConsole } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ClientsService } from 'app/main/apps/clients/clients.service';
import { DepartmentsService } from 'app/main/apps/departments/departments.service';
import { Client } from 'app/main/models/client.model';
import { Department } from 'app/main/models/department.model';
import { FolderNavigationService } from 'app/navigation/folder-navigation.service';

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;

    isRegister: boolean = true;

    private _unsubscribeAll: Subject<any>;

    clients: Client[] = [];
    departments: Department[] = [];

    constructor(private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router,
        private _matSnackBar: MatSnackBar,
        private translateService: TranslateService,
        private clientsService: ClientsService,
        private departmentsService: DepartmentsService,
        private folderNavigationService: FolderNavigationService) {

        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this.getClients();

        this.registerForm = this._formBuilder.group({
            userName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            client: [null, Validators.required],
            department: [null],
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    register(){
        if (this.registerForm.valid) {
            this.authenticationService.register(this.registerForm.controls['userName'].value,
                this.registerForm.controls['email'].value,
                this.registerForm.controls['client'].value.id,
                this.registerForm.controls['password'].value,
                this.registerForm.controls['passwordConfirm'].value,
                this.registerForm.controls['department'].value ? this.registerForm.controls['department'].value.id : null)
                .then(() => {
                    this.isRegister = false;
                    this.router.navigate(['/']);
                })
                .catch(res => {
                    if (res && res.status && res.status == 401) {
                        this.translateService.get('PAGES.AUTH.'+ res.error).subscribe(message => {
                            this.createSnackBar(message);
                        });
                    }
                    else if (res && res.status && res.status == 403) {
                        this.translateService.get('PAGES.AUTH.'+ res.error).subscribe(message => {
                          this.createSnackBar(message);
                        });
                    }
                    else {
                        this.translateService.get('PAGES.AUTH.OOPS').subscribe(message => {
                            this.createSnackBar(message);
                        });
                    }
                });
        }
    }

    createSnackBar(message: string) {
        this._matSnackBar.open(message, 'OK', {
          verticalPosition: 'top',
          duration: 5000
        });
    }

    getClients(){
        this.clientsService.getClients()
        .then(clients => {
            this.clients = clients;
        })
        .catch();
    }

    getDepartmentsByClientId() {
        if (this.registerForm.controls['client'].valid && this.registerForm.controls['client'].value) {
          this.departmentsService.getDepartmentsByClientId(this.registerForm.controls['client'].value.id)
            .then(departments => {
              this.departments = departments;
            })
            .catch();
        }
      }
    
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return {'passwordsNotMatching': true};
};
