import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ILocation } from '../../app/interfaces/location';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { Center } from './../../app/interfaces/center';
import { firebaseService } from '../../app/services/firebase';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'list-view',
    templateUrl: 'list-view.html',
})

export class ListViewPage implements OnInit {
    
    page: string = 'main';
    pageTitleKey: string = 'LISTVIEW_TITLE';
    pageTitle: string;
    public myLat;
    public myLong;
    public recycle: any[];
    public trash: any[];
    public both: any[]= [];
    // public staticLocations:ILocation[] = [{
    //     lat: 36.702229,
    //     long: -119.788517,
    //     name: "Mid Valley Disposal",
    //     // description: "The Disposal from the mid valley...",
    //     // type: Center.landfill,
    //     address: '1234 main st.'
    // },
    // {
    //     lat: 36.685982,
    //     long: -119.755236,
    //     name: "Orange Avenue Disposal",
    //     // description: "I like oranges...",
    //     type: Center.landfill,
    //     address: '5678 medium rd.'
    // }]

    constructor(public navCtrl: NavController,
        public settings: Settings,
        public formBuilder: FormBuilder,
        public navParams: NavParams,
        public geolocation: Geolocation,
        public translate: TranslateService,
        public firebase: firebaseService,
        private toastCtrl: ToastController) {
            // this._database.list('/locations').push(fakePickup).then( resp => console.log('fake add', resp));
            // this._database.list('/locations').valueChanges().subscribe(resp => console.log(resp));
            // this.locations = this._database.list('locations');
            // this.locations.snapshotChanges().subscribe(resp => console.log(resp))
    }

    ngOnInit(): void {
        this.loadRecycleMarkers()
        this.loadTrashMarkers()
        this.geolocation.getCurrentPosition().then((position:any) => {
            this.myLat = position.coords.latitude;
            this.myLong = position.coords.longitude;
        });

    }
    loadRecycleMarkers() {
        return this.firebase.loadRecyleLocations().subscribe((data) => { 
          this.recycle = data
          },(err)=>{
            const toast = this.toastCtrl.create({
              message: 'Error in loading Recycle locations',
              duration: 4000
            });
            toast.present();
          });
    }
    loadTrashMarkers() {
        return this.firebase.loadTrashPlaces().subscribe((data) => { 
            this.trash = data
          },(err)=>{
            const toast = this.toastCtrl.create({
              message: 'Error in loading Landfill locations',
              duration: 4000
            });
            toast.present();
          });
      }
    



    public getDistanceFromLatLonInMi(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        d = d * .0621371
        if (isNaN(d)) d = 0;
        return d.toFixed(1);
    }
    
    private deg2rad(deg) {
        return deg * (Math.PI/180)
        }
}