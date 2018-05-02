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
  ready: Promise<void>;
  constructor(public sqlite:SQLite) {
    console.log('Hello DbProvider');
  }

  public openDb(){

    return this.sqlite.create({
      name: 'data.db',
      location: 'default' //el campo location es obligatorio
    }).then((db: SQLiteObject) =>{
      console.log("Opened");
      this.db = db;
    }).catch(e => {
      console.log("Error");
      console.log(e);
    });
  }

  public createTableSitios(){
    console.log('aqui');
    return this.db.executeSql("CREATE TABLE IF NOT EXISTS sitios( id INTERGER PRIMARY KEY AUTOINCREMENT, lat FLOAT, lng FLOAT, address TEXT, description TEXT, foto TEXT)",{});
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
}
