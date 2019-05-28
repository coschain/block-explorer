<style>
    .vue-tx {
        background-color: white;
    }

    .vue-tx .table tbody tr td {
        border: 0;
    }

    .vue-tx td.code {
        background-color: #f8f9fa;
    }

    .vue-tx td.text {
        white-space: pre-line;
    }
    .vue-tx .fail {
        color:red;
    }
    .vue-tx .success {
        color:green;
    }
    .vue-tx .atpAddress {
        width: 134px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: bottom;
        margin: auto 10px;
    }
    .vue-tx .td-left {
        width: 25%;
    }

    .vue-tx .atlaspAds-bottom>a>img {
        margin-top: 30px;
    }

    .vue-tx #atlaspAds-mobile {
        display: none;
    }

    .vue-tx #atlaspAds-side {
        position: fixed;
        top: 211px;
        left: calc((100% - 1140px) * 0.5 + 1140px + 5px);
        width: 300px;
        max-width: calc((100% - 1140px) * 0.5 - 25px);
    }

    .vue-tx .operation-json-bg {
        background: rgba(247, 247, 247, 1);
    }

    @media (max-width: 767.98px) {

        .vue-tx .atpAddress {
            margin: auto 0px;
        }

        .vue-tx .atlaspAds-bottom>a>img {
            margin-top: 15px;
        }

        .vue-tx #atlaspAds-bottom {
            display: none;
        }

        .vue-tx #atlaspAds-mobile {
            display: block;
        }
    }

    @media (max-width: 1199.98px) {
        #atlaspAds-side {
            display: none;
        }
    }

</style>
<template>
    <div class="vue-tx fullfill" v-bind:triggerComputed=urlChange>
        <vue-bread title='TxHash' :subtitle="$route.params.id" :subtitlemonospaced="$route.params.id"></vue-bread>
        <div v-if="trx" class="container">
            <div class="font-24 font-bold font-color-000000 table-title">
                Overview
            </div>
            <div class="explorer-table-container d-none d-md-block">
                <table class="explorer-table " style="table-layout: auto">
                    <tr>
                        <td class="td-left font-16 font-color-555555" style="padding-left: 24px;">TxHash:</td>
                        <td class="font-16 font-color-000000 monospace">{{ trx.getTrxId().getHexHash() }}</td>
                    </tr>
                    <tr v-if="trx.hasTrxWrap()" class="font-16">
                        <td class="font-color-555555" style="padding-left: 24px;">TxReceipt Status:</td>
                        <td class="d-flex align-items-center" v-if="getTrxApplyResult() === 500" style="height: inherit">
                            <img class="icon18" src="../../static/img/ic_tx_status_failed.png?v=20190110" />
                            <span class="font-color-F04434" style="margin-left: 10px;">Fail ( {{ errMsg() }} )</span>
                        </td>
                        <td class="d-flex align-items-center" v-else-if="getTrxApplyResult() === 200" style="height: inherit">
                            <img class="icon18" src="../../static/img/ic_tx_status_success.png" />
                            <span class="font-color-07A656" style="margin-left: 10px;">Success</span>
                        </td>
                        <td class="d-flex align-items-center" v-else-if="getTrxApplyResult() === 201" style="height: inherit">
                            <img class="icon18" src="../../static/img/ic_tx_receive_pending.png" />
                            <span class="font-color-F8BB08" style="margin-left: 10px;">Fail But Deducted Stamina ( {{ errMsg() }} )</span>
                        </td>
                        <td class="d-flex align-items-center" v-else-if="getTrxApplyResult() !== -1" style="height: inherit">
                            <img class="icon18" src="../../static/img/ic_tx_status_pending.png" />
                            <span class="font-color-F8BB08" style="margin-left: 10px;">Unknown</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-16 font-color-555555" style="padding-left: 24px;">Stamina:</td>
                        <td v-if="trx.hasTrxWrap()" class="font-16 font-color-000000">{{getTrxResourceConsumption(trx)}}</td>
                    </tr>
                    <tr>
                        <td class="font-16 font-color-555555" style="padding-left: 24px;">Block Height:</td>
                        <td>
                            <!--<template v-if=tx.isPending>-->
                                <!--<span class="font-color-000000 font-16"> pending </span>-->
                            <!--</template>-->
                            <template >
                                <router-link v-if=trx.getBlockHeight() v-bind:to='fragApi +"/block/" + trx.getBlockHeight()'>
                                    <span class="font-16">{{trx.getBlockHeight()}}</span>
                                </router-link>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-16 font-color-555555" style="padding-left: 24px;">TimeStamp:</td>
                        <td v-if="trx.hasBlockTime()" class="font-16 font-color-000000">{{ timeConversion(Date.now()-trx.getBlockTime().getUtcSeconds()*1000) }} ago ({{ new Date(trx.getBlockTime().getUtcSeconds()*1000).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ trx.getBlockTime().getUtcSeconds()*1000 }})</td>
                        <td v-else-if="!trx.hasBlockTime()" class="detail"></td>

                    </tr>
                    <tr>
                        <td class="font-16 font-color-555555" style="padding-left: 24px;">From:</td>
                        <td>
                            <router-link  v-bind:to='fragApi +"/account/" + trx.getTrxWrap().getSigTrx().getTrx().sender()'>
                                <span class="font-16 monospace">{{ trx.getTrxWrap().getSigTrx().getTrx().sender() }}</span>
                            </router-link>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-16 font-color-555555" style="padding-left: 24px;">Operations:</td>
                        <td>
                            <pre v-highlightjs><code class="json operation-json-bg">{{ trx.getTrxWrap().getSigTrx().getTrx().getOperationsObjectList() | pretty }}</code></pre>
                        </td>
                    </tr>

                </table>
            </div>

            <div v-if="trx" class="mobile-detail d-md-none">
                <div class="mobileCell">
                    <div class="font-color-555555">TxHash:</div>
                    <div class="detail monospace">{{ trx.getTrxId().getHexHash() }}</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">TxReceipt Status:</div>
                    <div v-if="trx.hasTrxWrap()">
                        <div class="detail d-flex align-items-center" v-if="getTrxApplyResult() === 500" style="height: inherit">
                                <img class="icon18" src="../../static/img/ic_tx_status_failed.png?v=20190110" />
                                <span class="font-color-F04434" style="margin-left: 10px;">Fail ( {{ errMsg() }} )</span>
                            </div>
                            <div class="detail d-flex align-items-center" v-else-if="getTrxApplyResult() === 200" style="height: inherit">
                                <img class="icon18" src="../../static/img/ic_tx_status_success.png" />
                                <span class="font-color-07A656" style="margin-left: 10px;">Success</span>
                            </div>

                            <div class="detail d-flex align-items-center" v-else-if="getTrxApplyResult() === 201" style="height: inherit">
                                <img class="icon18" src="../../static/img/ic_tx_receive_pending.png" />
                                <span class="font-color-F8BB08" style="margin-left: 10px;">Fail But Deducted Stamina ( {{ errMsg() }} )</span>
                            </div>

                            <div class="detail d-flex align-items-center" v-else-if="getTrxApplyResult() !== -1" style="height: inherit">
                                <img class="icon18" src="../../static/img/ic_tx_status_pending.png" />
                                <span class="font-color-F8BB08" style="margin-left: 10px;">Unknown</span>
                            </div>
                    </div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Stamina:</div>
                    <div v-if="trx.hasTrxWrap()" class="font-16 font-color-000000">{{getTrxResourceConsumption(trx)}}</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Block Height:</div>
                    <div class="detail">
                        <template >
                            <router-link v-if=trx.getBlockHeight() v-bind:to='fragApi +"/block/" + trx.getBlockHeight()'>
                                <span>{{trx.getBlockHeight()}}</span>
                            </router-link>
                        </template>
                    </div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">TimeStamp:</div>
                    <div v-if="trx.hasBlockTime()" class="detail">{{ timeConversion(Date.now()-trx.getBlockTime().getUtcSeconds()*1000) }} ago ({{ new Date(trx.getBlockTime().getUtcSeconds()*1000).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ trx.getBlockTime().getUtcSeconds()*1000 }})</div>
                    <div v-else-if="!trx.hasBlockTime()" class="detail"></div>

                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">From:</div>
                    <div class="detail">
                        <router-link  v-bind:to='fragApi +"/account/" + trx.getTrxWrap().getSigTrx().getTrx().sender()'>
                            <span class="font-16 monospace">{{ trx.getTrxWrap().getSigTrx().getTrx().sender() }}</span>
                        </router-link>
                    </div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Operations:</div>
                    <div class="detail">
                        <pre v-highlightjs><code class="json operation-json-bg">{{ trx.getTrxWrap().getSigTrx().getTrx().getOperationsObjectList() | pretty }}</code></pre>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    var jsBeautify = require("js-beautify").js_beautify,
        prism = require("prismjs"),
        api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        appConfig = require("@/assets/app-config"),
        BigNumber = require("bignumber.js");

    require("prismjs/themes/prism.css");
    const cos_sdk = require("cos-grpc-js");

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
           "vue-tab-buttons": require("@/components/vue-tab-buttons").default
        },
        computed: {

            formatCode() {
                let lang = prism.languages.javascript;
                if (this.tx.data)
                    if (this.tx.type ==="deploy")
                        return prism.highlight(jsBeautify(JSON.parse(this.tx.data).Source), lang);
                    else if (this.tx.type ==="call")
                        return prism.highlight(jsBeautify(this.tx.data), lang);

                return "";
            },
            txType() {
                // type=binary      【前端显示：Normal】
                // type=deploy      【前端显示：deploy contract】
                // type=call        【前端显示：call contract】
                // type=candidate   【前端显示：dpos candidate】
                // type=delegate    【前端显示：dpos delegate】
                if (this.tx) switch (this.tx.type) {
                    default:
                    case"binary": return"normal";
                    case"deploy": return"deploy contract";
                    case"call": return"call contract";
                    case"candidate": return"dpos candidate";
                    case"delegate": return"dpos delegate";
                } else
                    return"";
            },
            urlChange() {
                let hexHash = this.$route.params.id;
                let trxHash = new cos_sdk.raw_type.sha256();
                trxHash.setHexHash(hexHash);
                this.trxId = trxHash.getHash();
                this.$root.showModalLoading = true;
                api.fetchTrxInfoById( this.trxId, info => {
                    if (info != null && typeof info != "undefined") {
                       this.trx = info;
                    }
                    this.$root.showModalLoading = false;
                },(errCode,msg) => {
                    console.log("Get trx info fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                });

            },
            isTokenTransfer() {
                try {
                    if (this.tx.type === 'call' && JSON.parse(this.tx.data).Function === 'transfer' && JSON.parse(JSON.parse(this.tx.data).Args).length >= 2) {
                        return true;
                    }
                } catch (error) {
                }
                return false;
            },
            tokenAmount() {
                BigNumber.config({ DECIMAL_PLACES: this.tx.decimal })
                var amount = BigNumber(JSON.parse(JSON.parse(this.tx.data).Args)[1]);
                var decimals = BigNumber('1e+' + this.tx.decimal);
                return amount.div(decimals).toFormat();
            },
        },
        data() {
            return {
                fragApi: this.$route.params.api ?"/" + this.$route.params.api :"",
                tab: 0,
                tabButtons: ["Overview"],
                tx: null,
                trx: null,
                isShowPayload: false,
                trxId: null,
            };
        },
        methods: {
            showOrHidePayload(){
                this.isShowPayload = !this.isShowPayload;
                // setTimeout(() => {
                //     window.scrollTo(0, 10000);
                // }, 0);
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },

            errMsg() {
                if (this.trx != null  && typeof this.trx != "undefined" && this.trx.getTrxWrap().hasReceipt()
                    && this.trx.getTrxWrap().getReceipt().getErrorInfo()) {
                    return this.trx.getTrxWrap().getReceipt().getErrorInfo();
                } else {
                    return 'Apply Transaction Failed';
                }
            },

            getTrxApplyResult() {
                if (this.trx != null  && typeof this.trx != "undefined" && this.trx.hasTrxWrap &&
                    this.trx.getTrxWrap().hasReceipt()) {
                    return this.trx.getTrxWrap().getReceipt().getStatus();
                } else {
                    return -1;
                }
            },

            getTrxResourceConsumption(trx) {
                //Display format：100 (20 cpu/ 80 net )
                if (trx != null && typeof trx != "undefined" && trx.hasTrxWrap() && trx.getTrxWrap().hasReceipt()) {
                    let netCon = trx.getTrxWrap().getReceipt().getNetUsage();
                    let cpuCon = trx.getTrxWrap().getReceipt().getCpuUsage();
                    let total = netCon + cpuCon;
                    return "" + total + " (" + cpuCon + "CPU / " + netCon + "Net" + ")"
                }
                return "0"
            }

        },

        filters: {
            pretty: function(value) {
                return JSON.stringify(value, null, 2);
            }
        }
    };
</script>
