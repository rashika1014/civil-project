import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgProgressModule }      from 'ngx-progressbar';

import { GalleryPage } from './gallery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgProgressModule,
    RouterModule.forChild([
      {
        path: '',
        component: GalleryPage
      }
    ])
  ],
  declarations: [GalleryPage]
})
export class GalleryPageModule {}
