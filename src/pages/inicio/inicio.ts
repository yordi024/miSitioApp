import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 declare var google:any;

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  map:any; //Manejador del mapa
  coords = { lat: 0, lng: 0};
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform:Platform, public geolocation:Geolocation, public modalCtrl:ModalController) {
    platform.ready().then(() => {
      //La plataforma esat lista y ya tenemos acceso a  los plugins.
    this.obtenerPosicion();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioPage');
  }

  obtenerPosicion():any{
    this.geolocation.getCurrentPosition().then(res => {
      this.coords.lat = res.coords.latitude;
      this.coords.lng = res.coords.longitude;

      this.loadMap();
    })
    .catch((error) => {
      console.log(error.message);
      this.coords.lat = 43.2686712;
      this.coords.lng = -2.9340118000000075;
      this.loadMap();
    })
  }

  loadMap(){
    let mapContainer = document.getElementById('map');
    this.map = new google.maps.Map(mapContainer, {
      center: this.coords,
      zoom:12
    });

    //Colocamos el marcador
    let miMarker;
    miMarker = new google.maps.Marker({
      icon: 'assets/imgs/icon-map.png',
      map: this.map,
      position: this.coords
    });
  }

  nuevoSitio(){
    let mimodal = this.modalCtrl.create('ModalNuevoSitioPage', this.coords);
    mimodal.present();
  }

}
