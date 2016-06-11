/// <reference path="../../../typings/index.d.ts" />
import { Injectable } from '@angular/core';

import {createClient}  from "redis";

@Injectable()
export class HeaderService {
    connect() {
        // var client = createClient();
        // console.log("init ");
        // console.info("connection");
        // client.on("connect", function (err, a) {
        //     console.log("Error " + err, a);
        // });

    }
}

