import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject} from '@ionic-native/sqlite';
/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  db: SQLiteObject = null;

  constructor(public sqlite:SQLite) {
    console.log('Hello DbProvider');
  }

  public openDb(){

    return this.sqlite.create({
      name: 'data.db',
      location: 'default' //el campo location es obligatorio
    })
    .then((db: SQLiteObject) => {
      console.log("Opened");
      this.db = db;
    }).catch(e => {
      console.log("Error");
      console.log(e);
    });
  }

  public createTableSitios(){
    return this.db.executeSql("CREATE TABLE IF NOT EXISTS sitios( id INTEGER PRIMARY KEY AUTOINCREMENT, lat FLOAT, lng FLOAT, address TEXT, description TEXT, foto TEXT)",{});
  }

  public addSitio(sitio){
    let sql = "INSERT INTO sitios (lat, lng, address, description, foto) values (?,?,?,?,?)";
    console.log(sitio);
    return this.db.executeSql(sql,[sitio.lat, sitio.lng, sitio.address, sitio.description, sitio.foto]);
  }

  public getSitios(){
    let sql = "SELECT * FROM sitios";
    return this.db.executeSql(sql,{});
  }

  public modificarSitio(sitio){
    let sql = "UPDATE sitios SET lat = ?, lng = ?, address = ?, description = ?, foto = ? WHERE id = ?";
    return this.db.executeSql(sql, [sitio.lat, sitio.lng, sitio.address, sitio.description, sitio.foto, sitio.id]);
  }

  public borrarSitio(id){
    let sql = 'DELETE FROM sitios WHERE id = ?';
    return this.db.executeSql(sql , [id]);
  }
}
