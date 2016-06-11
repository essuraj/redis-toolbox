/// <reference path="../../../typings/index.d.ts" />


import { Component} from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import {HeaderService} from './app.service'
interface IConnection {
  host: string;
  port: number;
}
@Component({
  selector: 'header',
  templateUrl: "src/app/header/header.html",
  providers:[HeaderService]
})
export class HeaderComponent {
  name: string;
  connection: IConnection;

  constructor(private service:HeaderService) {
    this.name = "Suraj";
    this.connection = {
      host: "localhost", port: 6379
    };

  }
  testConnection(data: any) {
    console.log(data)
    this.service.connect();
  }
}

bootstrap(HeaderComponent);
