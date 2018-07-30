import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, private http: HttpClient, private toastCtrl: ToastController ) { }
  
  ionViewWillEnter() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position:any) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 10, 
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
    this.http.get('../../assets/data/recycleMarkers.json')
      .subscribe(data => {
        this.addRecycleMarkersToMap(data);
    });
  }

  addRecycleMarkersToMap(markers) {
    for(let marker of markers) {
      const infowindow = new google.maps.InfoWindow({
        content: marker.name
      });
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      const recycleMarker = new google.maps.Marker({position: position, 
                                                    title: marker.name, 
                                                    icon: '../../assets/img/markers/recycle-icon.png',
                                                    type: 'recyle'});
      recycleMarker.setMap(this.map);
      google.maps.event.addListener(recycleMarker, 'click', () => {
        infowindow.open(this.map, recycleMarker);
      }) ;
      this.recycleList.push(recycleMarker);
    };
  }

  loadTrashMarkers() {
    this.http.get('../../assets/data/trashMarker.json')
    .subscribe(data => {
      this.addTrashMarkersToMap(data);
    });
  }

    addTrashMarkersToMap(markers) {
    for(let marker of markers) {
      const infowindow = new google.maps.InfoWindow({
        content: marker.name
      });
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      const trashMarker = new google.maps.Marker({position: position, 
                                                  title: marker.name,
                                                  icon: '../../assets/img/markers/trash-icon.png',
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
 