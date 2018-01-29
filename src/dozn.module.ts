import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { DoznService } from './dozn.service';
import { DoznAppComponent } from './components/dozn-root/dozn-root.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { environment } from './environment';
import { DOZN_CONFIG, IDoznConfig } from './utils';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  declarations: [
    DoznAppComponent,
    DialogComponent,
    AutocompleteComponent
  ],
  exports: [
    DoznAppComponent
  ],
})
export class DoznModule {
  static forRoot(doznConfig: IDoznConfig): ModuleWithProviders {
    return {
      ngModule: DoznModule,
      providers: [
        { provide: DOZN_CONFIG, useValue: doznConfig },
        DoznService
      ]
    };
  }
}
