<template>
    <div class="bg">
        <div class="container is-fluid is-multiline">
            <br/>
            <nav-bar v-on:isConnected="loadMain" v-on:search="showSearch"></nav-bar>


            <br/>
            <div class="columns" v-if="isConnected">
                <div class="column tree">
                    <div class="box">
                        <div class="columns">
                            <div class="column ">
                                <nav class="panel">
                                    <p class="panel-heading">
                                        Selected Database - {{db}}
                                    </p>
                                    <div class="panel-block">
                                        <p class="control has-icon">
                                            <input class="input is-small" type="text" placeholder="Search">
                                            <span class="icon is-small">
                                                <i class="fa fa-search"></i>
                                            </span>
                                        </p>
                                    </div>

                                    <a class="panel-block" v-for="(value, key) in keys" :key="key">
                                        <span class="panel-icon">
                                            <i class="fa fa-book"></i>
                                            </span> {{value}}
                                    </a>

                                </nav>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-three-quarters">
                    <section class="box">
                        <div class="container is-fluid">
                            <div class="columns">
                                <div class="column is-three-quarters">

                                </div>
                                <div class="column">
                                    <div class="field ">
                                        <p class="control">
                                            <span class="select">
                                        <select  v-model="db" v-on:change="dbSelected">
                                        <option value="" selected>Select a DB</option>
                                            <option  v-for="(value, key) in dbs" :key="key"  v-bind:value="key">{{key}}</option>
                                        </select>
                                        </span>
                                        </p>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="box">
                        <pre>
                        {{data}}</pre>
                        <h1>{{keys}}</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style>
    .tree .card-content,
    .tree .card-content-box {
        padding: 0 !important
    }

    .bg {
        background: #f3f3f3
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
                db: "",
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
                        db[`${i}`] = [];
                    }
                    this.dbs = db
                }

            },
            showSearch: function (status) {
                this.data = status

            },
            getKeys: function (db) {
                console.log(db, this.dbs)
                var res = ipcRenderer.sendSync('sendCommand', "SCAN", [db.split('-')[1]])
                console.info(res)
                this.dbs[db] = res[1];

            },
            dbSelected: function () {
                console.log(this.db)
                var res = ipcRenderer.sendSync('sendCommand', "SCAN", [this.db])
                console.info(res)
                this.keys = res[1];
            }
        }
    }
</script>