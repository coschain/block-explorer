<style>
    div .vue-tx {
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
                <table class="explorer-table">
                    <tr>
                        <td class="td-left font-16 font-color-555555" style="padding-left: 24px;">TxHash:</td>
                        <td class="font-16 font-color-000000 monospace">{{ trx.getTrxId().getHexHash() }}</td>
                    </tr>
                    <tr v-if="trx.hasTrxWrap()" class="font-16">
                        <td class="font-color-555555" style="padding-left: 24px;">TxReceipt Status:</td>
                        <td class="d-flex align-items-center" v-if="trx.getTrxWrap().getInvoice().getStatus() === 500" style="height: inherit">
                            <img class="icon18" src="../../static/img/ic_tx_status_failed.png?v=20190110" />
                            <span class="font-color-F04434" style="margin-left: 10px;">Fail ( {{ errMsg }} )</span>
                        </td>
                        <td class="d-flex align-items-center" v-else-if="trx.getTrxWrap().getInvoice().getStatus() === 200" style="height: inherit">
                            <img class="icon18" src="../../static/img/ic_tx_status_success.png" />
                            <span class="font-color-07A656" style="margin-left: 10px;">Success</span>
                        </td>
                        <td class="d-flex align-items-center" v-else style="height: inherit">
                            <img class="icon18" src="../../static/img/ic_tx_status_pending.png" />
                            <span class="font-color-F8BB08" style="margin-left: 10px;">Pending</span>
                        </td>
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
                            <router-link  v-bind:to='fragApi +"/address/" + trx.getTrxWrap().getSigTrx().getTrx().sender()'>
                                <span class="font-16 monospace">{{ trx.getTrxWrap().getSigTrx().getTrx().sender() }}</span>
                            </router-link>
                        </td>
                    </tr>
                    <tr>
                        <!--<td class="font-16 font-color-555555" style="padding-left: 24px;">Data:</td>-->
                        <!--<td>-->
                            <!--&lt;!&ndash;<router-link v-if=tx.from v-bind:to='fragApi +"/address/" + tx.from.hash'>&ndash;&gt;-->
                            <!--&lt;!&ndash;<span class="font-16 monospace">{{ tx.from.hash }}</span>&ndash;&gt;-->
                            <!--&lt;!&ndash;</router-link>&ndash;&gt;-->
                        <!--</td>-->
                    </tr>
                    <!--<tr>-->
                        <!--<td class="font-16 font-color-555555" style="padding-left: 24px;">To:</td>-->
                        <!--<td class="detail"></td>-->
                        <!--<td v-if="tx.type === 'call'">-->
                            <!--<span class="font-color-000000 font-16">Contract</span>-->
                            <!--<router-link v-if=tx.to v-bind:to='fragApi +"/address/" + tx.to.hash'>-->
                                <!--<span style="margin-left: 20px;" class="font-16 monospace">{{ tx.to.hash }}</span>-->
                            <!--</router-link>-->
                            <!--<div class="token-name font-16 font-color-000000" style="margin-left: 14px;" v-if="isTokenTransfer && tx.tokenName">{{ '(' + tx.tokenName + ' Token)' }}</div>-->
                        <!--</td>-->
                        <!--<td v-else>-->
                            <!--<router-link v-if=tx.to v-bind:to='fragApi +"/address/" + tx.to.hash'>-->
                                <!--<span class="font-16 monospace">{{ tx.to.hash }}</span>-->
                            <!--</router-link>-->
                        <!--</td>-->
                    <!--</tr>-->
                    <!--<tr  v-if=isTokenTransfer class="font-16">-->
                        <!--<td class="font-color-555555" style="padding-left: 24px;">Token Transfered:</td>-->
                        <!--<td>-->
                            <!--<span class="font-color-000000">From</span>-->
                            <!--<router-link class=atpAddress v-if=tx.to v-bind:to='fragApi +"/address/" + tx.from.hash'>-->
                                <!--<span class="monospace">{{ tx.from.hash }}</span>-->
                            <!--</router-link>-->
                            <!--<span class="font-color-000000">To </span>-->
                            <!--<router-link  class=atpAddress v-if=tx.to v-bind:to='fragApi +"/address/" + JSON.parse(JSON.parse(tx.data).Args)[0]'>-->
                                <!--<span class="monospace">{{ JSON.parse(JSON.parse(tx.data).Args)[0] }} </span>-->
                            <!--</router-link>-->
                            <!--<span class="font-color-000000">for {{ tokenAmount }}</span>-->
                            <!--<div class="token-name" v-if="tx.tokenName">-->
                                <!--<a href=# @click="search(tx.tokenName)">{{ tx.tokenName }}</a>-->
                            <!--</div>-->
                        <!--</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                        <!--<td class="font-16 font-color-555555" style="padding-left: 24px;">Value:</td>-->
                        <!--<td class="font-16 font-color-000000">{{ nasAmount(tx.value) }} COS</td>-->
                    <!--</tr>-->

                </table>
            </div>

            <div v-if="trx" class="mobile-detail d-md-none">
                <div>
                    TxHash:
                    <!--<div class="detail monospace">{{ tx.hash }}</div>-->
                    <div class="detail monospace">{{ trx.getTrxId().getHexHash() }}</div>
                </div>
                <div>
                    TxReceipt Status:
                    <div v-if="trx.hasTrxWrap()">
                        <td class="detail d-flex align-items-center" v-if="trx.getTrxWrap().getInvoice().getStatus() === 500" style="height: inherit">
                                <img class="icon18" src="../../static/img/ic_tx_status_failed.png?v=20190110" />
                                <span class="font-color-F04434" style="margin-left: 10px;">Fail ( {{ errMsg }} )</span>
                            </td>
                            <td class="detail d-flex align-items-center" v-else-if="trx.getTrxWrap().getInvoice().getStatus() === 200" style="height: inherit">
                                <img class="icon18" src="../../static/img/ic_tx_status_success.png" />
                                <span class="font-color-07A656" style="margin-left: 10px;">Success</span>
                            </td>
                            <td class="detail d-flex align-items-center" v-else style="height: inherit">
                                <img class="icon18" src="../../static/img/ic_tx_status_pending.png" />
                                <span class="font-color-F8BB08" style="margin-left: 10px;">Pending</span>
                            </td>
                    </div>
                </div>
                <div>
                    Block Height:
                    <div class="detail">
                        <!--<template v-if=tx.isPending>-->
                            <!--<span class="font-color-000000"> pending </span>-->
                        <!--</template>-->
                        <template >
                            <router-link v-if=trx.getBlockHeight() v-bind:to='fragApi +"/block/" + trx.getBlockHeight()'>
                                <span>{{trx.getBlockHeight()}}</span>
                            </router-link>
                        </template>
                    </div>
                </div>
                <div>
                    TimeStamp:
                    <div v-if="trx.hasBlockTime()" class="detail">{{ timeConversion(Date.now()-trx.getBlockTime().getUtcSeconds()*1000) }} ago ({{ new Date(trx.getBlockTime().getUtcSeconds()*1000).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ trx.getBlockTime().getUtcSeconds()*1000 }})</div>
                    <div v-else-if="!trx.hasBlockTime()" class="detail"></div>

                </div>
                <div>
                    From:
                    <div class="detail">
                        <router-link  v-bind:to='fragApi +"/address/" + trx.getTrxWrap().getSigTrx().getTrx().sender()'>
                            <span class="font-16 monospace">{{ trx.getTrxWrap().getSigTrx().getTrx().sender() }}</span>
                        </router-link>
                    </div>
                </div>
                <tr>
                    <!--<td class="font-16 font-color-555555" style="padding-left: 24px;">Data:</td>-->
                    <!--<td>-->
                        <!--&lt;!&ndash;<router-link v-if=tx.from v-bind:to='fragApi +"/address/" + tx.from.hash'>&ndash;&gt;-->
                        <!--&lt;!&ndash;<span class="font-16 monospace">{{ tx.from.hash }}</span>&ndash;&gt;-->
                        <!--&lt;!&ndash;</router-link>&ndash;&gt;-->
                    <!--</td>-->
                </tr>
                <!--<div>-->
                    <!--To:-->
                    <!--<div class="detail"></div>-->
                    <!--<div v-if="tx.type == 'call'" class="detail">-->
                        <!--<span class="font-color-000000" style="margin-right: 20px;">Contract</span>-->
                        <!--<router-link v-if=tx.to v-bind:to='fragApi +"/address/" + tx.to.hash' style="margin-right: 14px;">-->
                            <!--<span class="monospace">{{ tx.to.hash }}</span>-->
                        <!--</router-link>-->
                        <!--<div class="token-name font-color-000000" v-if="isTokenTransfer && tx.tokenName">{{ '(' + tx.tokenName + ' Token)' }}</div>-->
                    <!--</div>-->
                    <!--<div v-else class="detail">-->
                        <!--<router-link v-if=tx.to v-bind:to='fragApi +"/address/" + tx.to.hash'>-->
                            <!--<span class="monospace">{{ tx.to.hash }}</span>-->
                        <!--</router-link>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div v-if=isTokenTransfer>-->
                    <!--Token Transfered:-->
                    <!--<div class="detail">-->
                        <!--<span class="font-color-000000">From</span>-->
                        <!--<router-link class=atpAddress v-if=tx.to v-bind:to='fragApi +"/address/" + tx.from.hash'>-->
                            <!--<span class="monospace">{{ tx.from.hash }}</span>-->
                        <!--</router-link>-->
                        <!--<span class="font-color-000000">To </span>-->
                        <!--<router-link class=atpAddress v-if=tx.to v-bind:to='fragApi +"/address/" + JSON.parse(JSON.parse(tx.data).Args)[0]'>-->
                            <!--<span class="monospace">{{ JSON.parse(JSON.parse(tx.data).Args)[0] }} </span>-->
                        <!--</router-link>-->
                        <!--<span class="font-color-000000">for {{ tokenAmount }}</span>-->
                        <!--<div class="token-name" v-if="tx.tokenName">-->
                            <!--<a href=# @click="search(tx.tokenName)">{{ tx.tokenName }}</a>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div>-->
                    <!--Value:-->
                    <!--<div class="detail">{{ nasAmount(tx.value) }} COS</div>-->
                <!--</div>-->
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
                var lang = prism.languages.javascript;
                if (this.tx.data)
                    if (this.tx.type =="deploy")
                        return prism.highlight(jsBeautify(JSON.parse(this.tx.data).Source), lang);
                    else if (this.tx.type =="call")
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

                // api.getTx(this.$route.params.id, o => {
                //     this.$root.showModalLoading = false;
                //     this.tx = o;
                //     // if (!o.tokenName || o.tokenName.length == 0) {
                //     //     if (o.to.hash == this.atpAddress()) {
                //     //         this.tx.tokenName ="ATP";
                //     //     }
                //     // }
                // }, xhr => {
                //     this.$root.showModalLoading = false;
                //     this.$router.replace((this.$route.params.api ?"/" + this.$route.params.api :"") +"/404");
                // });
            },
            isTokenTransfer() {
                try {
                    if (this.tx.type == 'call' && JSON.parse(this.tx.data).Function == 'transfer' && JSON.parse(JSON.parse(this.tx.data).Args).length >= 2) {
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
            errMsg() {
                if (trx != null  && this.trx.getTrxWrap().getInvoice().getErrorInfo()) {
                    return this.trx.getTrxWrap().getInvoice().getErrorInfo().getValue();
                } else {
                    return 'Apply Transaction Failed';
                }
            }
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
            nasAmount(n) {
                BigNumber.config({ DECIMAL_PLACES: 18 })
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat();
            },
            hexTobyte(str) {
                return utility.hexStrToByte(str);
            },
            // atpAddress() {
            //     var api = this.$route.params.api ? this.$route.params.api :"mainnet";
            //     return appConfig.apiPrefixes[api].atp;
            // },
            // search(keyword) {
            //     console.log("tx search");
            //     if (keyword.trim().length === 0) {
            //         return;
            //     }
            //     this.$root.showModalLoading = true;
            //     api.getSearch(keyword.trim(), o => {
            //         this.$root.showModalLoading = false;
            //         this.search = "";
            //
            //         if (o.type == "block")
            //             this.$router.push(this.fragApi + "/block/" + o.q);
            //         else if (o.type == "address")
            //             this.$router.push(this.fragApi + "/address/" + o.q);
            //         else if (o.type == "tx")
            //             this.$router.push(this.fragApi + "/tx/" + o.q);
            //         else if (o.type == "contract")
            //             this.$router.push(this.fragApi + "/token/" + o.q);
            //         else {
            //             this.$router.push((this.$route.params.api ? "/" + this.$route.params.api : "") + "/nothing");
            //         }
            //     }, () => {
            //         this.$root.showModalLoading = false;
            //         this.$router.push((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
            //     });
            // }
        },
        mounted() {
            let hexHash = this.$route.params.id;
            let trxHash = new cos_sdk.raw_type.sha256();
            trxHash.setHexHash(hexHash);
            this.trxId = trxHash.getHash();
        },
    };
</script>
