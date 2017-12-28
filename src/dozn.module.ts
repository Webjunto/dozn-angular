import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { DOZN_CONFIG, IDoznConfig } from './utils';
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
  static forRoot(doznConfig: IDoznConfig): ModuleWithProviders {
    return {
      ngModule: DoznModule,
      providers: [
        { provide: DOZN_CONFIG, useValue: doznConfig },
        DoznService
      ],
    };
  }
}
