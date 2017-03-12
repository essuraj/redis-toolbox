'use strict'

import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'
export const redis = require('redis')
const bluebird = require("bluebird")

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let mainWindow

export var client

ipcMain.on('testRedisConnection', function (event, host, password) {
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
      success: true,
      message: "Connect error",
      data: err
    }
  })
  client.on('ready', function () {
    console.log('ready')
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

const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:${require('../../../config').port}` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})