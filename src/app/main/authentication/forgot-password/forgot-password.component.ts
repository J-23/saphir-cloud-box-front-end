import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router,
        private _matSnackBar: MatSnackBar,
        private translateService: TranslateService
    )
    {
        // Configure the layout
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    forgotPassword() {

        if (this.forgotPasswordForm.valid) {

            this.authenticationService.forgotPassword(this.forgotPasswordForm.controls['email'].value)
                .then(() => {
                    this.authenticationService.userEmail.next(this.forgotPasswordForm.controls['email'].value);
                    this.router.navigate(['/auth/mail-confirm']);
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
                })
        }
    }

    createSnackBar(message: string) {
        this._matSnackBar.open(message, 'OK', {
          verticalPosition: 'top',
          duration: 5000
        });
    }
}
