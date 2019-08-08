import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Client } from 'app/main/models/client.model';
import { ClientsService } from '../../clients/clients.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {

  object: any;
  form: FormGroup;
  dialogTitle: string;
  
  clients: Client[] = [];

  constructor(public matDialogRef: MatDialogRef<DepartmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private clientsService: ClientsService) { 
    
    this.dialogTitle = _data.dialogTitle;
    
    if (_data.object) {
      this.object = _data.object;
    }
    else {
      this.object = {};
    }
  }

  ngOnInit() {
    this.form = this.createForm();

    this.clientsService.getClients()
      .then(clients => {
        this.clients = clients;
      })
      .catch();
  }

  createForm(): FormGroup {

    if (this.object) {
      return this._formBuilder.group({
        id      : [this.object.id],
        name    : [this.object.name, Validators.required],
        client  : [this.object.client, Validators.required]
      });
    }
    
    return this._formBuilder.group({
      id      : [],
      name    : [null, Validators.required],
      client  : [null, Validators.required]
    });
  }

  clientCompare(client1: Client, client2: Client) {
    return client1 && client2 && client1.id == client2.id;
  }
}
