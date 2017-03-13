<template>
  <div>
    <nav class="nav box is-paddingless">
      <div class="nav-left">
        <a class="nav-item">
          <img src="./assets/logo.png" alt="electron-vue"><span>&nbsp; Redis toolbox</span>
        </a>
      </div>
      <span class="nav-toggle">
          <span></span>
      <span></span>
      <span></span>
      </span>
      <div class="nav-center" v-if="isConnected">

        <p class="control has-addons nav-item">
          <input class="input" type="text" placeholder="redis command" v-model="command">
          <a class="button is-info" @click="tryRedisCommand">
    Execute
  </a>
        </p>

      </div>
      <div class="nav-right">
        <p class="nav-item">

          <a class="button is-primary" @click="openModalBasic">Connect</a></p>
      </div>
    </nav>
    <modal :visible="showModal" transition="zoom" @close="closeModalBasic">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Redis Server Connection wizard - {{host}}
          </p>
        </header>
        <div class="card-content">
          <div class="content">
            <p class="control has-icon">
              <input class="input" type="text" required v-model="host" placeholder="host:port">
              <span class="icon is-small">    <i class="fa fa-server"></i>  </span>
            </p>
            <p class="control has-icon">
              <input class="input" type="password" v-model="password" placeholder="password">
              <span class="icon is-small">    <i class="fa fa-lock"></i>  </span>
            </p>
            <p v-bind:class="{ 'help is-success': isConnected,'help is-danger':isConnected===false }">
              <i v-bind:class="{ 'fa fa-check': isConnected,'fa fa-exclamation-triangle':isConnected===false }"></i> {{connectMessage}}
            </p>
          </div>

        </div>
        <footer class="card-footer">
          <a class="card-footer-item" @click="testRedisConnection">
          Test</a>
          <a class="card-footer-item" @click="closeModalBasic">Cancel</a>
          <a class="card-footer-item is-success">Save</a>
        </footer>
      </div>

    </modal>
  </div>

</template>

<script>
  import {
    Modal
  }
  from 'vue-bulma-modal'
  import {
    ipcRenderer
  } from 'electron'
  // import Notification from 'vue-bulma-notification'
  import Vue from 'vue'
  // const NotificationComponent = Vue.extend(Notification)

  // const openNotification = (propsData = {
  //   title: '',
  //   message: '',
  //   type: '',
  //   direction: '',
  //   duration: 1000,
  //   container: '.bg'
  // }) => {
  //   return new NotificationComponent({
  //     el: document.createElement('div'),
  //     propsData
  //   })
  // }

  export default {
    data() {
      return {
        isConnected: undefined,
        connectMessage: undefined,
        showModal: false,
        host: 'localhost:6379',
        password: "",
        command: "CONFIG GET databases"
      }
    },
    methods: {
      openModalBasic() {
        this.showModal = true
      },
      closeModalBasic() {
        this.showModal = false
      },
      testRedisConnection() {
        let op = ipcRenderer.sendSync('testRedisConnection', this.host, this.password);
        console.log(op, this.host, this.password)
        this.isConnected = op.success;
        this.connectMessage = op.message;
        if (op.success === true) {
          // openNotification({
          //   message: op.message,
          //   type: 'success',
          //   duration: 0
          // })
          console.info(ipcRenderer.sendSync('getDBS'))
          op.dbs = Number(ipcRenderer.sendSync('sendCommand', "CONFIG", ["GET", "databases"])[1])
          this.$emit('isConnected', op);
        } else {
          // openNotification({
          //   message: op.message,
          //   type: 'danger',
          //   duration: 0
          // })
        }



      },
      tryRedisCommand() {

        let args = this.command.split(" ");
        let rest = args.splice(1, args.length)
        console.log(args[0], rest)
        var res = ipcRenderer.sendSync('sendCommand', args[0], rest)
        console.log(res);
        this.$emit('search', res);


      }
    },
    components: {
      Modal
    },
    created() {
      // Set $route values that are not preset during unit testing
      if (process.env.NODE_ENV === 'testing') {
        this.$route = {
          name: 'landing-page',
          path: '/landing-page'
        }
      }
    }
  }
</script>