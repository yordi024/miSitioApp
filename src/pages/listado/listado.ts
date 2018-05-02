import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';

/**
 * Generated class for the ListadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado',
  templateUrl: 'listado.html',
})
export class ListadoPage {

  sitios: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController,
              public db:DbProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoPage');
  }

  ionViewDidEnter(){
    this.db.getSitios().then((res)=> {
      this.sitios = [];
      for (let i = 0; i < res.rows.length; i++) {
          this.sitios.push({
            id: res.rows.item(i).id,
            lat: res.rows.item(i).lat,
            lng: res.rows.item(i).lng,
            address: res.rows.item(i).address,
            description: res.rows.item(i).description,
            foto: res.rows.item(i).foto
          });
      }
    },(err) => { console.log('error al sacar de la bd' + err);})
    .catch((err) => {console.log(err)})
  }

  muestraSitio(sitio){
    let modalSitio = this.modalCtrl.create("ModalDetalleSitioPage", sitio);
    modalSitio.present();
  }

  borrarSitio(id){
    let alert = this.alertCtrl.create({
      title: 'Confirmar borrado',
      message: 'Estas seguro de que deseas eliminar este sitio',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            //Ha respondido que no asi que no hacemos nada
          }
        },
        {
          text: 'Si',
          handler: () => {
            //Aqui borramos el sitio de la base de datos
            this.db.borrarSitio(id).then((res)=> {
            //Una vez borrado el sitio recargamos el Listado
              this.db.getSitios().then((res) => {
                this.sitios = [];
                for (let i = 0; i < res.rows.length; i++) {
                    this.sitios.push({
                      id:  res.rows.item(i).id,
                      lat: res.row.item(i).lat,
                      lng: res.row.item(i).lng,
                      address: res.row.item(i).address,
                      description: res.row.item(i).description,
                      foto: res.row.item(i).foto,
                    });
                }
              },(err) => { console.log('error al cargar de la db despues de eliminar' + err)});
            },(err) => { console.log('error al eliminar de la db' + err)})
          }
        }
      ]
    });

    alert.present();
  }

}
