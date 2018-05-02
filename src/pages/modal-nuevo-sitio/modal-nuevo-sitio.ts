import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController } from 'ionic-angular';
import {DbProvider} from '../../providers/db/db';
/**
 * Generated class for the ModalNuevoSitioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 declare var google;
@IonicPage()
@Component({
  selector: 'page-modal-nuevo-sitio',
  templateUrl: 'modal-nuevo-sitio.html',
})
export class ModalNuevoSitioPage {

  coords:any = { lat: 0, lng: 0};
  address: string;
  description: string = '';
  foto: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private camera:Camera, private db:DbProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalNuevoSitioPage');
    this.coords.lat = this.navParams.get('lat');
    this.coords.lng = this.navParams.get('lng');
    this.getAddress(this.coords).then(results => {
      this.address = results[0]['formatted_address'];
    }, errStatus => {
      //Aqui iria el codigo para manejar el error
    });
  }

  getAddress(coords){
    var geocoder = new google.maps.Geocoder();
    return new Promise(function(resolve, reject){
      geocoder.geocode({'location':coords}, function(results, status){
        //Llamada asincronamente
        if(status == google.maps.GeocoderStatus.OK){
          resolve(results);
        }else{
          reject(status);
        }
      })
    })
  }

  sacarFoto(){
    let cameraOptions : CameraOptions = {
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
      //imageData is a base64 encoded string
      this.foto = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    })
  }

  guardarSitio(){
    let sitio = {
      lat: this.coords.lat,
      lng: this.coords.lng,
      address: this.address,
      description: this.description,
      foto: this.foto
    }
    this.db.addSitio(sitio).then((res) => {
      this.cerrarModal();
      console.log('se ha introducido correctamente en la db')
    }, (err) => { console.log('error al meter los datos en la db' + err)})
    .catch((err) => {
    //   console.log(err);
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: err,
        buttons: ['OK']
      });
      alert.present();
    })
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

}
