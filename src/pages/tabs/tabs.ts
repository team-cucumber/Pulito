import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DomSanitizer } from "@angular/platform-browser";

import { Camera, CameraOptions } from "@ionic-native/camera";



import { Tab1Root, Tab2Root, Tab3Root, Tab4Root, Tab5Root } from '../';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab5Root: any = Tab5Root;

  // For translating service tabs only, tabs are set my html
  // tab1Title = " ";
  // tab2Title = " ";
  // tab3Title = " ";
  // tab4Title = " ";
  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService,
    public navParams: NavParams,
    private camera: Camera,
    public alertCtrl: AlertController) {
    // translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE', 'TAB3_TITLE']).subscribe(values => {
    //   this.tab1Title = values['TAB1_TITLE'];
    //   this.tab2Title = values['TAB2_TITLE'];
    //   this.tab3Title = values['TAB3_TITLE'];
    //   this.tab4Title = values['TAB4_TITLE'];
    // });
  }

  onTakePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: false,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log('Something messed up', err);
    })
  }
}