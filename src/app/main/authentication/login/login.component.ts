import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;

    isLogin: boolean = true;

    constructor(private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router,
        private _matSnackBar: MatSnackBar,
        private translateService: TranslateService) {

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
    }

    login(){
        if (this.loginForm.valid) {
            this.authenticationService.login(this.loginForm.controls['email'].value,
                this.loginForm.controls['password'].value)
                .then(() => {
                    this.isLogin = false;
                    this.router.navigate(['/']);
                })
                .catch(res => {
                    if (res && res.status && res.status == 401) {
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

    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
}
