<style>
    .vue-header .container {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .vue-header a {
        color: inherit;
    }

    .vue-header .dev-version {
        color: #2a88ff;
        left: -15px;
        padding: 5px;
        position: relative;
        top: 10px;
    }

    .vue-header .btn-group-toggle {
        margin-left: 20px;
    }

    .vue-header .btn-group-toggle label {
        padding: 0 10px;
    }

    .vue-header .visibility-hidden {
        visibility: hidden;
    }

    .vue-header form {
        border: none;
        margin-left: 20px;
        padding: 6px 0px 6px 10px;
        width: 350px;
        background-color: white;
    }

    .vue-header .form-inline img {
        margin-right: 6px;
    }

    .vue-header .form-inline input {
        outline: none;
        border: none;
        flex: 1;
    }

    .vue-header input::placeholder {
        font-size: 13px;
        line-height: 20px;
    }

    .vue-header .navbar-nav .nav-item:nth-child(2) a img {
        margin-top: -5px;
    }

    .vue-header .navbar-nav .nav-item:nth-child(3) a img {
        margin-top: -1.5px;
    }

    .vue-header .testNestWaring {
        display: flex;
        flex-direction: row;
        vertical-align: center;
        justify-content: center;
        justify-items: center;
        width: 100%;
        top: 0px;
        color: white;
        background: #5869FF;
        font-weight: 500;
        font-size: medium;
        left: 0;
    }

    .vue-header .warningIcon {
        width: 22px;
        height: 22px;
        margin-top: -1px;
    }

    @media (min-width: 992px) {

        .vue-header .navbar-nav>li>a {
            border-bottom: 2px solid transparent;
        }

        /* .vue-header .navbar-nav>li>a:hover, */
        .vue-header .navbar-nav>li.active>a,
        .vue-header .navbar-nav>li.show>a {
            border-bottom-color: white;
        }

        .vue-header .navbar-nav a:hover img {
            opacity: 0.6;
        }

        .vue-header.navbar.navbar-default .navbar-nav>li>a {
            background-color: initial;
        }

        .vue-header .dropdown-menu {
            margin-left: 30px;
        }
    }

    @media (max-width: 991.98px) {
        .vue-header .form-inline {
            align-items: center;
            display: flex;
            width: 100%;
            margin: 10px 0px;
        }
    }

    @media (max-width: 767.98px) {
        input {
            font-size: 16px;
        }
    }

</style>
<template>
    <div class="bg-black vue-header">
    <div class="testNestWaring">
        <img src="/static/img/cos_warn.png" class="warningIcon" alt="">
        <div>Be careful,This is the test network for Contentos. Any trading information is for testing purposes. </div>
    </div>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <vue-modify-rpc  v-if="isShowRpcAlert" v-on:close="closeRpcSwitchAlert" v-on:changeRpcAddress="modifyRpcAddress" :currentAddress=currentHost></vue-modify-rpc>

        <div class=container>
            <div>
                <router-link v-bind:to="fragApi + '/'" class=navbar-brand>
                    <img src="/static/img/logo_cos.png?v=20190117" width=210 alt="">
                </router-link>
            </div>

            <button class=navbar-toggler type=button data-toggle=collapse data-target=#navbarSupportedContent aria-controls=navbarSupportedContent aria-expanded=false aria-label="Toggle navigation">
                <span class=navbar-toggler-icon></span>
            </button>
            <div class="collapse navbar-collapse mr-28" id=navbarSupportedContent>
                <form class=form-inline v-on:submit.prevent=onSubmit>
                    <img src=/static/img/icon_search.png width=16 alt="">
                    <input class="mr-sm-2 font-12" v-model=search type=search placeholder="Search by Account / Txhash / Block">
                </form>
                <ul class="navbar-nav ml-auto">
                    <li class=nav-item v-bind:class="{ active: $route.meta.headerActive == 1 }">
                        <router-link v-bind:to="fragApi + '/'" class=nav-link>HOME
                            <span class=sr-only>(current)</span>
                        </router-link>
                    </li>
                    <li class="dropdown nav-item" v-bind:class="{ active: $route.meta.headerActive == 2 }">
                        <a class="nav-link" href=# id=header-dropdown-blockchain role=button data-toggle=dropdown aria-haspopup=true aria-expanded=false>
                            BLOCKCHAIN
                            <img src=/static/img/icon_arrow_down.png width=12 alt="">
                        </a>
                        <div class=dropdown-menu aria-labelledby=header-dropdown-blockchain>
                            <router-link class=dropdown-item v-bind:to="fragApi + '/txs'">Transactions</router-link>
                            <!--<router-link class=dropdown-item v-bind:to="fragApi + '/txs/pending'">Pending Transactions</router-link>
                            -->
                            <div class="dropdown-divider"></div>
                            <router-link class=dropdown-item v-bind:to="fragApi + '/blocks/' + getCurrentIrreversibleNum()">Blocks</router-link>
                            <div class="dropdown-divider"></div>
                            <router-link class=dropdown-item v-bind:to="fragApi + '/accounts'">Accounts</router-link>
                            <div class="dropdown-divider"></div>
                            <router-link class=dropdown-item v-bind:to="fragApi + '/DApp'">DApp Statistics</router-link>
                            <div class="dropdown-divider"></div>
                            <router-link class=dropdown-item v-bind:to="fragApi + '/contracts/'">Contracts</router-link>
                            <div class="dropdown-divider"></div>
                            <a href= "http://testwallet.contentos.io/" target="_blank" class="dropdown-item">Create Account</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href=# role=button v-on:click.prevent=apiSwitch()>{{ MenuMisc }}
                            <img src=/static/img/icon_switcher.png width=12 alt="">
                        </a>
                    </li>
                </ul>

            </div>
        </div>
    </nav>
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        appConfig = require("@/assets/app-config"),
        utility = require("@/assets/utility");
    import {searchUtil} from "../assets/utility";
    module.exports = {
        components: {
            "vue-modify-rpc": require("@/components/vue-modify-rpc").default
        },
        data() {
            return {
                apiPrefixes: null,
                fragApi: "",
                paramsApi: "",
                search: "",
                MenuMisc:"Change RPC",
                isShowRpcAlert: false,
                currentHost:this.getCurrentHostAddress(),
            };
        },
        methods: {
            apiSwitch() {
                // if (this.$route.params.api === 'testnet') {
                //     this.$router.replace("/");
                // } else {
                //     this.$router.replace("/testnet");
                // }
                this.isShowRpcAlert = true;
                // location.reload();
            },
            onSubmit() {
                let content = this.search.trim();
                if (content.length === 0) {
                    this.search = "";
                    return;
                }
                let sType = utility.searchType(this.search.trim());
                if (sType === 1 ) {
                    this.$router.push(this.fragApi + "/block/" + content);
                }else if (sType === 2) {
                    this.$router.push(this.fragApi + "/account/" + content);
                }else if (sType === 3) {
                    this.$router.push(this.fragApi + "/tx/" + content);
                }else  {
                    this.$root.search =content;
                    this.$router.push((this.$route.params.api ? "/" + this.$route.params.api : "") + "/nothing");
                }

            },
            atpAddress() {
                var api = this.$route.params.api ? this.$route.params.api : "mainnet";
                return appConfig.apiPrefixes[api].atp;
            },
            closeRpcSwitchAlert() {
                this.isShowRpcAlert = false;
            },
            modifyRpcAddress(address) {
                this.isShowRpcAlert = false;
                if (address) {
                    let isNetAddress = false;
                    if (address.length >= 4) {
                        let prefix = address.substring(0,4);
                        if (prefix === "http") {
                            isNetAddress = true;
                        }

                    }
                    if (isNetAddress) {
                        let curAddress = utility.getHost();
                        if (curAddress === address) {
                            return
                        }
                        this.$root.eBus.$emit("changeRpcAddress",address);
                        this.$router.replace(utility.getTestNetName());
                        utility.setHost(address);
                        location.reload();
                    }
                }
            },
            getCurrentHostAddress() {
                return utility.getHost();
            },
            getCurrentIrreversibleNum() {
                return utility.getIrreversibleBlkNum();
            }
        },
        mounted() {
            var paramsApi = this.$route.params.api, apiPrefixes = {}, i, first = true;

            for (i in appConfig.apiPrefixes)
                if (first) {
                    apiPrefixes[""] = appConfig.apiPrefixes[i];
                    first = false;
                } else
                    apiPrefixes[i] = appConfig.apiPrefixes[i];

            if (!(paramsApi in apiPrefixes))
                paramsApi = "";

            // paramsApi == 'testnet' ? this.MenuMisc = 'TESTNET' : this.MenuMisc = 'MAINNET';
            this.apiPrefixes = apiPrefixes;
            this.fragApi = paramsApi ? "/" + paramsApi : "";
            this.paramsApi = paramsApi;

            if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                // avoid auto zoom under iOS Safari when font size is less than 16px
                $('.vue-header input').css('font-size', '16px');
            }
        }
    };
</script>
