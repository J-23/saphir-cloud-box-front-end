import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoService } from '../info.service';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class FeedbackComponent implements OnInit {

  form: FormGroup;
  
  constructor(private _formBuilder: FormBuilder,
    private infoService: InfoService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {

    return this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      theme: ['', Validators.required],
      message: ['', Validators.required],
      fileName: ['', Validators.required],
      fileContent: ['', Validators.required]
    });
  }

  onFileChange(event) {
    var selectedFile = event.target.files[0];
    
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const base64 = reader.result.toString().split(',')[1];
      this.form.patchValue({
        fileContent: base64,
        fileName: selectedFile.name
      });
    };
  }

  send() {

    if (this.form.valid) {

      var message = {
        UserEmail : this.form.controls['email'].value,
        UserName: this.form.controls['userName'].value,
        Theme: this.form.controls['theme'].value,
        Message: this.form.controls['message'].value,
        FileName: this.form.controls['fileName'].value,
        FileContent: this.form.controls['fileContent'].value
      };

      this.infoService.send(message)
        .then(() => {
          this.translateService.get('PAGES.APPS.FEEDBACK.SUCCESS').subscribe(message => {
            this.createSnackBar(message);
          });
        })
        .catch(res => {
          if (res && res.status && res.status == 403) {
            this.translateService.get('PAGES.APPS.FEEDBACK.' + res.error).subscribe(message => {
              this.createSnackBar(message);
            });
          }
        });
    }
  }

  createSnackBar(message: string) {
    this._matSnackBar.open(message, 'OK', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
}
