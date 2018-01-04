import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DoznService } from './dozn.service';
import { DoznAppComponent } from './components/dozn-root/dozn-root.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    DoznAppComponent,
    DialogComponent
  ],
  exports: [
    DoznAppComponent
  ],
})
export class DoznModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DoznModule,
      providers: [
        DoznService
      ],
    };
  }
}
