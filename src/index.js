import Vue from "vue"
import VueRouter from "vue-router"
import VueAnalytics from 'vue-analytics'

import Header from "./components/vue-header"
import Footer from "./components/vue-footer"
import Modal from "./components/vue-modal"
import Rpc from "./components/vue-modify-rpc"
import VueHighlightJS from 'vue-highlight.js';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-gist.css'

const vAppConfig = require("@/assets/app-config");

const vRouter = new VueRouter({routes: require("@/assets/routes")});

Vue.use(VueAnalytics, {
    id: 'UA-136959706-1',
    router: vRouter
})

let vApp = {};

// Expose jQuery to the global object
const jQuery = require('jquery');
window.jQuery = window.$ = jQuery;
const eBus = new Vue();
require("bootstrap");
require("bootstrap/dist/css/bootstrap.min.css");
require("font-awesome/css/font-awesome.min.css");
require("./index.css");

function isIE() {
    return !!window.ActiveXObject || "ActiveXObject" in window;
}
window.isIE = isIE;

const isProd = process.env.NODE_ENV === 'production';

Vue.config.productionTip = isProd;
Vue.use(VueRouter);
vRouter.beforeEach(onBeforeEach);
Vue.use(VueHighlightJS, {languages: {json}});

Number.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
};

String.prototype.shortAmount = function () {
    let dot_index = this.indexOf('.');
    if (dot_index === -1) return this + '.0000';
    if (this.length - 1 - dot_index > 4) {
        return this.slice(0, dot_index + 4 + 1);
    } else if (this.length - 1 - dot_index < 4) {
        return this.padEnd(5 + dot_index, '0');
    }
    return this;
};

String.prototype.padDecimal = function () {
    let dot_index = this.indexOf('.');
    if (dot_index === -1) return this + '.0000';
    if (this.length - 1 - dot_index > 4) {
        return this;
    } else if (this.length - 1 - dot_index < 4) {
        return this.padEnd(5 + dot_index, '0');
    }
    return this;
};

String.prototype.shortHash = function () {
    if (this.length > 12) {
        return this.slice(0, 6) + '...' + this.slice(-6);
    }
    return this;
};

Date.prototype.getWeekNumber = function () {
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

vApp = new Vue({
    components: {
        //"vue-popmsg": require("@/components/vue-popmsg").default,
        "vue-footer": Footer,
        "vue-header": Header,
        "vue-modal": Modal,
        "vue-modify-rpc": Rpc
    },
    data: {
        timestamp: Date.now(),
        showModalLoading: false,
        showAtpAds: true,
        testnetDipStarted: true,
        testnetGotDipWinners: true,
        eBus
    },
    el: "#app",
    router: vRouter
});

setInterval(() => {
    vApp.timestamp = Date.now();
}, 1000);

////////////////////////////////////////////////////////////
//
// api prefix

function onBeforeEach(to, from, next) {
    window.scrollTo(0, 0);

    vApp.showModalLoading = false;

    let apiPrefix, first, path;

    for (first in vAppConfig.apiPrefixes) break;

    if (to.name === "*") {
        path = (from.params.api ? "/" + from.params.api : "") + "/404";
    } else if (to.params.api)
        if (to.params.api in vAppConfig.apiPrefixes)
            if (to.params.api === first) {
                // mainnet/xxx -> /xxx
                to.params.api = undefined;
                path = vRouter.resolve({ params: to.params }, to).resolved.fullPath;
            } else
                apiPrefix = vAppConfig.apiPrefixes[to.params.api].url;
        else {
            path = (from.params.api ? "/" + from.params.api : "") + "/404";
        }
    else {
        apiPrefix = vAppConfig.apiPrefixes[first].url;
    }

    sessionStorage.apiPrefix = apiPrefix;
    next(path);
}
