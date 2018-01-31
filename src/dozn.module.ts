import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DoznService } from './dozn.service';
import { DoznAppComponent } from './components/dozn-root/dozn-root.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { DOZN_CONFIG, IDoznConfig } from './utils';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule
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
