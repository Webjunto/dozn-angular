import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { DoznService } from './dozn.service';
import { DoznAppComponent } from './dozn-root.component';

@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    DoznAppComponent,
  ],
  exports: [
    DoznAppComponent,
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
