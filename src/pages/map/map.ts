import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ILocation } from '../../app/interfaces/location';
import { AngularFireDatabase } from 'angularfire2/database';
import { firebaseService } from '../../app/services/firebase';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  private map: any;
  private recycleList: any[] = []; 
  private trashList: any[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public geolocation: Geolocation, 
              private http: HttpClient, 
              private toastCtrl: ToastController,
              private firebase: firebaseService) {}
  
  ionViewDidLoad(){
  }

  ionViewWillEnter() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position:any) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 12, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        streetViewControl: false
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.loadRecycleMarkers();
      this.loadTrashMarkers();
    }, err => {
      const toast = this.toastCtrl.create({
        message: 'Please enable your location services for this feature',
        duration: 4000
      });
      toast.present();
    });
  }

  loadRecycleMarkers() {
    return this.firebase.loadRecyleLocations().subscribe((data) => { 
      console.log(data)
      this.addRecycleMarkersToMap(data);
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
      this.addTrashMarkersToMap(data);
      },(err)=>{
        const toast = this.toastCtrl.create({
          message: 'Error in loading Landfill locations',
          duration: 4000
        });
        toast.present();
      });
  }

  addRecycleMarkersToMap(markers) {
    for(let marker of markers) {
      console.log(marker)
      const infowindow = new google.maps.InfoWindow({
        content: marker.name
      });
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      const recycleMarker = new google.maps.Marker({position: position, 
                                                    title: marker.name, 
                                                    icon: '../../assets/img/markers/recycle-01.png',
                                                    type: 'recyle'});
      recycleMarker.setMap(this.map);
      google.maps.event.addListener(recycleMarker, 'click', () => {
        infowindow.open(this.map, recycleMarker);
      }) ;
      this.recycleList.push(recycleMarker);
    };
  }

  addTrashMarkersToMap(markers) {
    for(let marker of markers) {
      const infowindow = new google.maps.InfoWindow({
        content: marker.name
      });
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      const trashMarker = new google.maps.Marker({position: position, 
                                                  title: marker.name,
                                                  icon: '../../assets/img/markers/trash-02.png',
                                                  type: 'trash'});
      trashMarker.setMap(this.map);
      google.maps.event.addListener(trashMarker, 'click', () => {
        infowindow.open(this.map, trashMarker);
      });
      this.trashList.push(trashMarker);
    }
  }

  bothMarkers(){
    for(let recycle of this.recycleList){
      recycle.setMap(this.map)
    };
    for(let trash of this.trashList){
      trash.setMap(this.map)
    };
  }

  toggleTrash(){
    for(let recycle of this.recycleList){
      recycle.setMap(null)
    };
    for(let trash of this.trashList){
      trash.setMap(this.map)
    };
  }
        
  toggleRecycle() {
    for(let trash of this.trashList){
      trash.setMap(null)
    };
    for(let recycle of this.recycleList){
      recycle.setMap(this.map)
    };
  }
}
 