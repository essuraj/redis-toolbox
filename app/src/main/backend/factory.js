"use strict"

export const redis = require('redis')
const bluebird = require("bluebird")
import {
    ipcMain
} from 'electron'
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


export var client

ipcMain.on('testRedisConnection', function (event, host, password) {
    try {
        let config = {
            host: host.split(':')[0],
            port: host.split(':')[1]
        }
        if (password) {
            config.password = password
        }
        client = redis.createClient(config)
        client.on("monitor", function (time, args, raw_reply) {
            console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
        });
        client.on('error', function (err) {
            console.log('Error ' + err)

            event.returnValue = {
                success: false,
                message: "Connect error",
                data: err
            }
        })

    } catch (error) {
        console.log('Error ' + error)
        event.returnValue = {
            success: false,
            message: "Connect error",
            data: error
        }
    }
    client.on('ready', function () {
        console.log('ready')
        // for(var i=0;i<10000;i++)
        //     client.set("sd:as:dcv"+i*+Math.PI, "string val"+i*Math.E+Math.PI, redis.print);
        event.returnValue = {
            success: true,
            message: "Connected and ready"
        }
    })

})
ipcMain.on('getDBS', async function (event) {
    client.sendCommand("INFO", ["keyspace"], (err, res) => {
        if (err)
            console.error(err)
        event.returnValue = res;
    })

})
ipcMain.on('sendCommand', function (event, command, arg) {
    try {
        client.sendCommandAsync(command, arg).then(res => {

            event.returnValue = res;
        }, err => {
            if (err)
                console.error(err)
            event.returnValue = err;
        });
    } catch (error) {
        event.returnValue = error;
    }


})
ipcMain.on('scan', function (event, cursor = "0", match = "*", count = 1000) {
    try {
        client.scanAsync(
            cursor,
            'MATCH', match,
            'COUNT', count).then(
            res => {
                event.returnValue = res;

            }, err => {
                console.error(err)
                event.returnValue = err
            })
    } catch (err) {
        console.error(err)
        event.returnValue = err
    }
});

ipcMain.on('get', (event, key) => {
    var _client = client;
    client.typeAsync(key).then(type => {
        console.info(type);
        switch (type) {
            case "string":
                _client.getAsync(key).then(res => {
                    event.returnValue = {
                        type: type,
                        data: res
                    }
                }, err => {
                    event.returnValue = err
                });
                break;
            case "set":
                _client.smembersAsync(key).then(res => {
                    event.returnValue = {
                        type: type,
                        data: res
                    }

                }, err => {
                    event.returnValue = err
                });
                break;
            case "zset":
                _client.zrangeAsync(key, 0, -1, "WITHSCORES").then(res => {
                    event.returnValue = {
                        type: type,
                        data: res
                    }
                }, err => {
                    event.returnValue = err
                });
                break;
            case "hash":
                _client.hgetallAsync(key).then(res => {
                    event.returnValue = {
                        type: type,
                        data: res
                    }
                }, err => {
                    event.returnValue = err
                });
                break;
            default:
                console.error("unknown -no code wriiten", type);
                break;
        }
    }, err => {
        console.error(err);

    });

});

ipcMain.on('getKey', function (event, key) {
    client.getAsync(key).then(res => {
        event.returnValue = res
    }, err => {
        event.returnValue = err
    });
});