<template>
    <div class="bg">
        <div class="container is-fluid is-multiline">
            <br/>
            <nav-bar v-on:isConnected="loadMain"
                     v-on:search="showSearch"></nav-bar>
    
            <br/>
            <div class="columns"
                 v-if="isConnected">
                <div class="column tree">
                    <div class="">
                        <div class="columns">
                            <div class="column">
                                <nav class="panel">
                                    <p class="panel-heading">
                                        <span class="select is-small full-width">
                                            <select class="full-width"  v-model="db" v-on:change="dbSelected">
                                            <option value="" selected>Select a DB</option>
                                                <option  v-for="(value, key) in dbs" :key="key"  v-bind:value="key">{{key}}</option>
                                            </select>
                                            </span>
                                        <br/>
                                        <nav class="level">
                                            <div class="level-item has-text-centered">
                                                <div>
                                                    <p class="heading">keys</p>
                                                    <p class="title">{{keyTotal}}</p>
                                                </div>
                                            </div>
                                        </nav>
                                    </p>
                                    <p class="panel-tabs">
                                        <a class="is-active"><i class="fa fa-list"></i></a>
                                        <a><i class="fa fa-th-list"></i></a>
                                    </p>
                                    <div class="panel-block">
                                        <p class="control has-icon">
                                            <input class="input is-small"
                                                   type="text"
                                                   placeholder="Search">
                                            <span class="icon is-small">
                                                    <i class="fa fa-search"></i>
                                                </span>
                                        </p>
                                    </div>
    
                                    <a class="panel-block"
                                       v-for="(value, key) in keys"
                                       :key="key"
                                       v-on:click="getValue(value)">
                                        <span class="panel-icon">
                                                <i class="fa fa-key"></i>
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
                                    <h1  class="caps title">{{value.type}}</h1>
                                </div>
                                <div class="column">
    
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="box">
                        <pre>
                            {{data}}</pre>
                        <code> {{value}}</code>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
/*.tree .card-content,
    .tree .card-content-box {
        padding: 0 !important
    }*/
.caps{
text-transform: uppercase
}
.full-width {
    width: 100%;
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
            keys: [],
            keyTotal: 0,
            value: undefined
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
        getValue: function (key) {
            console.log(key)

            var res = ipcRenderer.sendSync('sendCommand', "SELECT", [this.db])

            res = ipcRenderer.sendSync('get', key)
            console.info(res)
            this.value = res;

        },
        dbSelected: function () {
            console.log(this.db)
            var res = ipcRenderer.sendSync('sendCommand', "SELECT", [this.db])

            res = ipcRenderer.sendSync('scan')
            console.info(res)
            this.keyTotal = res[0];
            this.keys = res[1];
        }
    }
}
</script>