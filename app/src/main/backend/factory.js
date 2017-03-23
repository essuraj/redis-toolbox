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
ipcMain.on('sendCommand', async function (event, command, arg) {
    try {
        client.sendCommandAsync(command, arg, (err, res) => {
            if (err)
                console.error(err)
            event.returnValue = res;
        })
    } catch (error) {
        event.returnValue = error;

    }


})