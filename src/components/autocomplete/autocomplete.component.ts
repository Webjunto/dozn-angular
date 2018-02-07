import { Component, OnInit, Input,  Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { NgModel, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { DoznService } from '../../dozn.service';

@Component({
  selector: 'auto-complete',
  template: `
  <div>
    <form [formGroup]="autocompleteForm">
      <label>{{label}}</label>
      <input type="text" [(ngModel)]="name" formControlName="name" placeholder="{{placeholder}}" class="input">
      <div *ngIf="autocompleteForm.controls.name.errors?.maxlength?.requiredLength">
        Not valid, must be at max {{autocompleteForm.controls.name.errors.maxlength.requiredLength}} characters long.
      </div>
      <div *ngIf="name.length > 0 && !selected">
        <div *ngFor="let item of items | filter:name" (click)="selectItem(item)">
            <p>{{item?.name}}</p>
        </div>
      </div>
      <div *ngIf="name.length > 0 && !selected && (items | filter:name).length === 0 && !autocompleteForm.controls.name.errors?.maxlength?.requiredLength"
            (click)="onCreate(name)">
          <p>Create {{name}} {{type}}</p>
      </div>
    </form>
  </div>
  `,
  styles: [
    `label {
      display: block;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 5px;
    }`,
    `input {
      border: none;
      border-radius: 3px;
      color: #fff;
      font-size: 14px;
      background-color: #934db6;
      padding: 8.5px;
      width: 100%;

      &::-webkit-input-placeholder { color: white; opacity: 0.6; }
      &::-moz-placeholder { color: white; opacity: 0.6; }
      &:focus::-webkit-input-placeholder { color:transparent; }
      &:focus::-moz-placeholder { color:transparent; }
    }`
  ]

})
export class AutocompleteComponent implements OnInit {
  @Input('label') label: string;
  @Input('type') type: string;
  @Output() autocompleteSelected: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() create: EventEmitter<{}> = new EventEmitter<{}>();

  autocompleteForm: FormGroup;

  items = [];
  name = '';
  placeholder = '';
  selected = false;

  constructor(private http: Http, private _dozn: DoznService, formBuilder: FormBuilder) {
    this.placeholder = 'What ' + this.type + ' do you want?';
    this.autocompleteForm = formBuilder.group({
      'name': [
        this.name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(30)
        ])
      ]
    });
  }

  getUrl() {
    if (this.type === 'user') {
      return this._dozn.environment.firebase.GET_COMPANY_USERS + this._dozn.apiKey;
    } else if (this.type === 'feature'){
      return this._dozn.environment.firebase.GET_FEATURES + this._dozn.apiKey;
    } else {
      return this._dozn.environment.firebase.GET_FLOWS + this._dozn.apiKey;
    }
  }

  async ngOnInit() {
    const items = await this.http.get(this.getUrl()).toPromise();
    this.items = items.json();
  }

  onCreate(name) {
    if (this.autocompleteForm.controls.name.valid) {
      this.selected = true;
      this.create.emit({name, type:this.type});
    }
  }

  selectItem(item) {
    if (this.autocompleteForm.controls.name.valid) {
      this.name = item.name;
      this.selected = true;
      this.autocompleteSelected.emit({item, type: this.type});
    }
  }
}
