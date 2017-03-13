<template>
    <div class="bg">
        <div class="container is-fluid is-multiline">
        <br/>
            <nav-bar v-on:isConnected="loadMain" v-on:search="showSearch"></nav-bar>
        <br/>
            <div class="columns"  v-if="isConnected">
                <div class="column tree">
                    <collapse>
                        <collapse-item v-bind:title="key" v-for="(value, key) in dbs" :key="key" v-on:open="getKeys(key)">
                            <a class="panel-block" v-for="a in value" :key="a">
                                <span class="panel-icon">
      <i class="fa fa-book"></i>
    </span> {{a}}
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
<style >
    .tree .card-content,
    .tree .card-content-box {
        padding: 0 !important
    }
    .bg{
        background:#f3f3f3
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
                keys: []
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
                    let db = {};
                    for (let i = 0; i < status.dbs; i++) {
                        db[`DB-${i}`]=[];
                    }
                    this.dbs = db
                }

            },
            showSearch: function (status) {
                this.data = status

            },
            getKeys: function (db) {
                console.log(db,  this.dbs)
                var res = ipcRenderer.sendSync('sendCommand', "SCAN", [db.split('-')[1]])
                console.info(res)
                this.dbs[db] = res[1];
            }
        }
    }
</script>