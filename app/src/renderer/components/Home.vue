<template>
    <div>
        <div class="container is-fluid is-multiline">
            <nav-bar v-on:isConnected="loadMain" v-on:search="showSearch"></nav-bar>
            <div class="columns">
                <div class="column tree">
                    <collapse>
                        <collapse-item v-bind:title="'DB '+ (n-1)" v-for="n in dbs" :key="n" v-on:open="getKeys(n-1)">
                            <a class="panel-block" v-for="a in keys[(n-1)]" :key="a" >
    <span class="panel-icon">
      <i class="fa fa-book"></i>
    </span>
    {{a}}
  </a>
                            
                        </collapse-item>
                    </collapse>
               </div>
                <div class="column is-three-quarters">
                    <div class="box">
                        <p class="title is-5">is-three-quarters {{isConnected}} {{data}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.tree .card-content,.tree .card-content-box{
    padding:0
}
</style>
<script>
    import NavBar from './sections/NavBar'


    import {
        Collapse,
        Item as CollapseItem
    } from 'vue-bulma-collapse'
    import {
        ipcRenderer
    } from 'electron'
    export default {
        data() {
            return {
                isConnected: false,
                dbs: [],
                data: {},
                keys:[]
            }

        },
        components: {
            NavBar,
            Collapse,
            CollapseItem
        },
        name: 'home-page',
        methods: {
            loadMain: function (status) {
                this.isConnected = status.success
                if (status.success === true) {
                    this.dbs = status.dbs
                }

            },
            showSearch: function (status) {
                this.data = status

            },
            getKeys: function (dbNumber) {
                console.log(dbNumber,this.keys)
 var res = ipcRenderer.sendSync('sendCommand', "SCAN", [dbNumber.toString()])
 console.log(res)
 this.keys[dbNumber]=res[1];
            }
        }
    }
</script>
