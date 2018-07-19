import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleLoginComponent} from '../../components/google-login/google-login';
import { map } from '../../../node_modules/rxjs/operators';

declare var google;
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
]map: any;
  showRecycleView: boolean = false;
  showTrashView:  boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15, 
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
     
    }, (err) => {
      console.log(err);
    });
  
    (success) => {
      console.log(success);
    }
  };
   

  const recycleLocations = [
    ['TSG Recycling Disposal', 36.695616, 119.783011, 3],
    ['Fresno Recycling', 36.725920, -119.763342, 2],
    ['Barrios Recycling', 36.701790, -119.757840, 1]
  ];

  const trash = [
    ['Mid Valley Disposal', 36.702229, -119.788517, 1],
    ['Orange Avenue Disposal', 36.685982, -119.755236, 2]
  ];

  const marker, i;
  
    showRecycleMarkers() {
      for (i = 0; i < this.recycleLocations.length; i++ ) {
        marker = new google.maps.Marker({
          positon: new google.maps.LatLng(recycleLocations[i][1], [i][2]), )
          map: map

      });
       
      google.maps.event.addListener(marker, 'click' (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    };

    showTrashMarkers() {
      for (i = 0; i < this.trashLocations.length; i++ ) {
        marker = new google.maps.Marker({
          positon: new google.maps.LatLng(trashLocations[i][1], [i][2]), )
          map: map

      });
       
      google.maps.event.addListener(marker, 'click' (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    };


    toggleRecycle() {
      this.showRecycleView = !this.showRecycleView;
      this.showRecycleMarkers();
    }
    
    toggleTrash() {
      this.showTrashView = !this.showTrashView;
      this.showTrashMarkers();
    }

  


      // addMarker() {
    //   let marker = new google.maps.Marker({
    //     map: this.map,
    //     animation: google.maps.Animation.DROP,
    //     position: this.map.getCenter()
    //   });

    //   let content = '<h4>Information!</h4>';
      
    //   this.addInfoWindow(marker, content);
    // }

    // addInfoWindow(marker, content) {
    //   let infoWindow = new google.maps.infoWindow({
    //     content: content
    //   });

    //   google.maps.event.addListener(marker , 'click', () => {
    //     infoWindow.open(this.map, marker);

    //   });

    // }
}