import { Component, OnInit, Input,  Output, EventEmitter, ViewChild, Inject, NgZone } from '@angular/core';
import { NgModel, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { DoznService } from '../../dozn.service';
import { DoznIonic } from '../../models/models';
import 'rxjs/add/operator/map';

@Component({
  selector: 'auto-complete',
  template: `
  <div>
    <form [formGroup]="autocompleteForm">
      <label>{{label}}</label>
      <input type="text" [(ngModel)]="name" formControlName="name" placeholder="What {{type}} do you want?" class="input" (input)="onType($event.target.value)">

      <div *ngIf="autocompleteForm.controls.name.errors?.maxlength?.requiredLength">
      <p>Not valid, must be at max</p>
      <p>{{autocompleteForm.controls.name.errors.maxlength.requiredLength}} characters long</p>
      </div>
      <div *ngIf="autocompleteForm.controls.name.hasError('required') && autocompleteForm.controls.name.touched">
      <p>This name can't be empty</p>
      </div>

      <div *ngIf="name.length > 0 && !selected">
        <div *ngFor="let item of items | filter:name" (click)="onSelectOption(item)">
            <p>{{item?.name}}</p>
        </div>
      </div>

      <div *ngIf="name.length > 0 &&
                  !isUserSelect &&
                  !selected && (items | filter:name).length === 0 &&
                  !autocompleteForm.controls.name.errors?.maxlength?.requiredLength &&
                  !autocompleteForm.controls.name.hasError('required')"
            (click)="onCreateOption(name)">
          <p>Create {{type}} {{ (name.length>9)? (name | slice:0:8)+'...':(name) }}</p>
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
  @Output() autocompleteSelected: EventEmitter<DoznIonic.SelectOption> = new EventEmitter<DoznIonic.SelectOption>();
  @Output() create: EventEmitter<DoznIonic.CreateOption> = new EventEmitter<DoznIonic.CreateOption>();

  autocompleteForm: FormGroup;
  isUserSelect: boolean;
  items: Array<DoznIonic.ItemOption> = [];
  selected: boolean = false;
  name: string = '';

  constructor(private http: Http, private _dozn: DoznService, formBuilder: FormBuilder) {
    this.isUserSelect = this.type === 'user' ? true : false;
    this.autocompleteForm = formBuilder.group({
      'name': [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(30)
        ])
      ]
    });
  }

  async ngOnInit() {
    if (this._dozn.apiKey) {
      try {
        const items = await this.http.get(this.getCloudFunctionUrl(this.type, this._dozn.apiKey)).toPromise();
        this.items = items.json();
      } catch (error) {
        throw error._body;
      }
    }
  }

  getCloudFunctionUrl(type, apiKey) {
    if (type === 'user') {
      return this._dozn.environment.firebase.GET_COMPANY_USERS + apiKey;
    } else if (type === 'feature'){
      return this._dozn.environment.firebase.GET_FEATURES + apiKey;
    } else {
      return this._dozn.environment.firebase.GET_FLOWS + apiKey;
    }
  }

  onType(value: string) {
    if (this.selected) {
      this.selected = false;
      const item = {name: value, id:'', type: this.type};
      this.autocompleteSelected.emit(item);
    }
  }

  onCreateOption(name: string) {
    if (this.autocompleteForm.controls.name.valid) {
      this.selected = true;
      this.name = name;

      const option = {name: name, type: this.type};
      this.create.emit(option);
    }
  }

  onSelectOption(item: DoznIonic.ItemOption) {
    if (this.autocompleteForm.controls.name.valid) {
      this.selected = true;
      this.name = item.name;

      const option = {name: item.name, id: item.id, type: this.type};
      this.autocompleteSelected.emit(option);
    }
  }
}
