<style>

    .vue-address td.out {
        width: 50px;
    }

    .vue-address td.in::before,
    .vue-address td.out::before {
        border-radius: 4px;
        color: white;
        padding: 3px 5px;
    }

    .vue-address td.in::before {
        background-color: var(--green);
        content: "in";
    }

    .vue-address td.out::before {
        background-color: var(--orange);
        content: "out";
    }

    .vue-address {
        background-color: white;
    }

    .vue-address .container .table th {
        border-top: 0;
    }

    .vue-address .container .title {
        overflow: auto;
    }

    .vue-address .txfee {
        font-size: 14px;
        /* font-family: OpenSans; */
        color: rgba(85, 85, 85, 1);
        line-height: 20px;
    }

    .vue-address .fail {
        background: url(../../static/img/warning_icon.png) no-repeat 0 10px;
        padding-left: 28px;
    }

    .vue-address .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vue-address .tdxxxwddd {
        padding: .75rem 0.4rem;
    }

    /* .contract-creator a {
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
    } */

    .contract-creator a {
        position: relative;
    }

    .contract-creator .popover {
        background-color: rgba(0, 0, 0, .8);
        color: white;
        display: none;
        left: 50%;
        top: -50px;
        padding: 10px;
        border-radius: 0px;
        border: none;
        pointer-events: none;
        position: absolute;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 1;
    }

    .contract-creator a:hover .popover {
        display: block;
    }

    #dropdown-tokens a {
        margin-right: 5px;
    }

    #dropdown-tokens>* {
        vertical-align: baseline;
    }

    .c000 {
        font-size: 16px;
        /* font-family: OpenSans-Semibold; */
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 20px;
    }

    .txs-hash {
        max-width: 185px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    .txs-block {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    /*.txs-from-to {*/
        /*max-width: 168px;*/
    /*}*/

    .txs-from-to a {
        /*max-width: 150px;*/
    }

    .hash-normal {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        color: rgba(0, 87, 255, 1);
        line-height: 20px;
    }

    .hash-failed {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        line-height: 20px;
        color: rgba(240, 68, 52, 1);
    }

    .fromTo {
        /*max-width: 150px;*/
        /* margin-left: 10px; */
        line-height: 24px;
    }

    .amount {
        font-size: 14px;
        /* font-family: OpenSans; */
        color: rgba(0, 0, 0, 1);
        line-height: 20px;
    }

    .overview {
        margin-top: 60px;
        margin-bottom: 30px;
        height: 30px;
        font-size: 24px;
        /* font-family: OpenSans-Semibold; */
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 30px;
    }

    .base-info-key {
        width: 23%;
    }

    .base-info-value-normal {
        height: 20px;
        font-size: 16px;
        /* font-family: OpenSans; */
        color: rgba(0, 0, 0, 1);
        line-height: 20px;
    }

    .base-info-value-num-of-tx {
        height: 20px;
        font-size: 16px;
        /* font-family: OpenSans; */
        color: rgba(0, 87, 255, 1);
        line-height: 20px;
    }

    .base-info-value-token-name {
        height: 20px;
        font-size: 16px;
        /* font-family: OpenSans-Semibold; */
        font-weight: 600;
        color: rgba(0, 87, 255, 1);
        line-height: 20px;
    }

    .text-no-content {
        height: 17px;
        font-size: 12px;
        /* font-family: OpenSans-Semibold; */
        font-weight: 600;
        color: rgba(155, 155, 155, 1);
        line-height: 17px;
    }

    .vue-address .dropdown-menu {
        min-width: initial;
    }

    .vue-address .block {
        margin-right: 8px;
    }

    .vue-address .pl-16 {
        padding-left: 16px;
    }

</style>
<template>
    <!-- https://etherscan.io/address/0xea674fdde714fd979de3edf0f56aa9716b898ec8 -->
    <div class="vue-address fullfill" v-bind:triggerComputed=urlChange>
        <vue-bread v-bind:title='navTitle'
                   v-bind:subtitle="$route.params.id"
                   v-bind:subtitlemonospaced="!!$route.params.id"
                   v-bind:blockies="$route.params.id">
        </vue-bread>
        <div class="container explorer-table-container" v-if=accountInfo>
            <div class="font-24 font-bold font-color-000000 table-title">
                Overview
                <!--<span class=c777 v-show=obj.address.alias> | {{ obj.address.alias }}</span>-->
            </div>
            <table class="explorer-table d-none d-md-table">
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">COS Balance:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ accountInfo.getCoin().toString() }}
                    </td>
                </tr>
                <!--<tr v-if="creator && deployTxHash">-->
                    <!--<td class="base-info-key font-16 font-color-555555 pl-16">-->
                        <!--Contract Creator:-->
                    <!--</td>-->
                    <!--<td class="contract-creator font-16 font-color-000000">-->
                        <!--<router-link v-bind:to='fragApi + "/address/" + creator'-->
                                     <!--title="Creator Address">-->
                            <!--<span>{{ toShortStr(creator) }}</span>-->
                            <!--<div class="popover down-arrow-tip">Creator Address</div>-->
                        <!--</router-link>-->
                        <!--at txn-->
                        <!--<router-link v-bind:to='fragApi + "/tx/" + deployTxHash'-->
                                     <!--title="Creator TxHash">-->
                            <!--<span>{{ toShortStr(deployTxHash) }}</span>-->
                            <!--<div class="popover down-arrow-tip">Creator TxHash</div>-->
                        <!--</router-link>-->
                    <!--</td>-->
                <!--</tr>-->
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">AccountName:</td>
                    <td class="font-16 font-color-000000">{{ accountInfo.toObject().accountName.value }}</td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">CreatedTime:
                    </td>
                    <td class="font-16 font-color-000000">{{ timeConversion(Date.now() - createTime) }} ago ({{ new Date(createTime).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ createTime }})</td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">PublicKey:
                    </td>
                    <td class="font-16 font-color-000000">{{accountInfo.hasPublicKey?accountInfo.getPublicKey().toWIF(): ""}}</td>

                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Vest:
                    </td>
                    <!--<td class="font-16 font-color-000000">{{accountInfo.hasVest?accountInfo.getVest().toString():""}}</td>-->
                    <td class="font-16 font-color-000000">{{accountInfo.hasVest()?accountInfo.getVest().toString():""}}</td>

                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Posted:
                    </td>
                    <td class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/user-article/" + $route.params.id'>
                        <span>{{accountInfo.toObject().postCount}}</span>
                        </router-link>
                    </td>
                </tr>
                <!--<tr>-->
                    <!--<td class="base-info-key font-16 font-color-555555 pl-16">Minted:</td>-->
                    <!--<td class="font-16 font-color-000000">{{ obj.mintedBlkCnt }}</td>-->
                <!--</tr>-->
                <!--<tr v-if="obj.tokenName">-->
                    <!--<td class="base-info-key font-16 font-color-555555 pl-16">Token Tracker:-->
                    <!--</td>-->
                    <!--<td class="font-16 font-color-000000">-->
                        <!--<router-link v-bind:to='fragApi + "/token/" + $route.params.id'>-->
                            <!--<span>{{ obj.tokenName }}</span>-->
                        <!--</router-link>-->
                    <!--</td>-->
                <!--</tr>-->
                <!--<tr v-if="!isContract && displayToken">-->
                    <!--<td class="base-info-key font-16 font-color-555555 pl-16">NRC20 Tokens:-->
                    <!--</td>-->
                    <!--<td>-->
                        <!--<div id="dropdown-tokens" data-toggle=dropdown>-->
                            <!--<span class="font-16 font-color-000000">{{ tokenAmount(displayToken.balance, displayToken.decimal) }}</span>-->
                            <!--<router-link v-bind:to='fragApi + "/token/" + displayToken.contract'>-->
                                <!--<span class="font-16 font-bold">{{ displayToken.tokenName }}</span>-->
                            <!--</router-link>-->
                            <!--<img src="../../static/img/icon_arrow_down_black.png" alt="" width="12">-->
                        <!--</div>-->
                        <!--<div v-if="validTokens.length > 1" class="dropdown-menu">-->
                            <!--<div class="dropdown-item text-right" v-for="(token, i) in validTokens" :key=i-->
                            <!--@click='displayToken = token;'>-->
                                <!--{{ tokenAmount(token.balance, token.decimal) }} {{ token.tokenName }}-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</td>-->
                <!--</tr>-->
            </table>

            <div class="mobile-detail d-md-none">
                <div>
                    COS Balance:
                    <div class="detail">{{ accountInfo.getCoin().toString() }} </div>
                </div>
                <!--<div v-if="creator && deployTxHash">-->
                    <!--Contract Creator:-->
                    <!--<div class="detail contract-creator font-color-000000">-->
                        <!--<router-link v-bind:to='fragApi + "/address/" + creator'-->
                                     <!--title="Creator Address">-->
                            <!--<span>{{ toShortStr(creator) }}</span>-->
                            <!--&lt;!&ndash; <div class="popover">Creator Address</div> &ndash;&gt;-->
                        <!--</router-link>-->
                        <!--at txn-->
                        <!--<router-link v-bind:to='fragApi + "/tx/" + deployTxHash'-->
                                     <!--title="Creator TxHash">-->
                            <!--<span>{{ toShortStr(deployTxHash) }}</span>-->
                            <!--&lt;!&ndash; <div class="popover">Creator TxHash</div> &ndash;&gt;-->
                        <!--</router-link>-->
                    <!--</div>-->
                <!--</div>-->
                <div>
                    AccountName:
                    <div class="detail">{{  accountInfo.toObject().accountName.value }}</div>
                </div>
                <div>
                    CreatedTime:
                    <!--<div class="detail">{{ accountInfo.createdTime.utcSeconds }}</div>-->
                    <td class="detail">{{ timeConversion(Date.now() - createTime) }} ago ({{ new Date(createTime).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ createTime }})</td>
                </div>
                <div>
                    <div class="base-info-key font-16 font-color-555555 pl-16">PublicKey:
                    </div>
                    <div class="font-16 font-color-000000">{{accountInfo.hasPublicKey()?accountInfo.getPublicKey().toWIF():""}}</div>
                </div>
                <div>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Vest:
                    </td>
                    <td class="font-16 font-color-000000">{{accountInfo.hasVest()?accountInfo.getVest().toString():""}}</td>
                </div>
                <div>
                    <div class="base-info-key font-16 font-color-555555 pl-16">Posted:
                    </div>
                    <div class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/user-article/" + $route.params.id'>
                            <span>{{accountInfo.toObject().postCount}}</span>
                        </router-link>
                    </div>
                </div>
                <!--<div>-->
                    <!--Minted:-->
                    <!--<div class="detail">{{ obj.mintedBlkCnt }}</div>-->
                <!--</div>-->
                <!--<div v-if="obj.tokenName">-->
                    <!--Token Tracker:-->
                    <!--<div class="detail">-->
                        <!--<router-link v-bind:to='fragApi + "/token/" + $route.params.id'>-->
                            <!--<span>{{ obj.tokenName }}</span>-->
                        <!--</router-link>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div v-if="!isContract && displayToken">-->
                    <!--NRC20 Tokens:-->
                    <!--<div class="detail">-->
                        <!--<div id="dropdown-tokens" data-toggle=dropdown>-->
                            <!--<span class="font-color-000000">{{ tokenAmount(displayToken.balance, displayToken.decimal) }}</span>-->
                            <!--<router-link v-bind:to='fragApi + "/token/" + displayToken.contract'>-->
                                <!--<span class="font-bold">{{ displayToken.tokenName }}</span>-->
                            <!--</router-link>-->
                            <!--<img src="../../static/img/icon_arrow_down_black.png" alt="" width="12">-->
                        <!--</div>-->
                        <!--<div v-if="validTokens.length > 1" class="dropdown-menu">-->
                            <!--<div class="dropdown-item text-right" v-for="(token, i) in validTokens" :key=i-->
                            <!--@click='displayToken = token;'>-->
                                <!--{{ tokenAmount(token.balance, token.decimal) }} {{ token.tokenName }}-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        prism = require("prismjs"),
        jsBeautify = require("js-beautify").js_beautify,
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js"),
        base64 = require("js-base64").Base64;
    const crypto = require('cos-grpc-js').crypto;

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
            "vue-tab-buttons": require("@/components/vue-tab-buttons").default,
            "vue-blockies": require("@/components/vue-blockies").default
        },
        computed: {
            formatCode() {
                var lang = prism.languages.javascript;

                if (this.contractCode) {
                    var code = JSON.parse(this.contractCode);
                    if (code.Source) {
                        return prism.highlight(jsBeautify(code.Source), lang);
                    }
                }
                return "0x0";
            },
            urlChange() {
                this.tab = 1;
                this.contract = null;
                this.isContract = false;
                this.nrc20TxList = [];
                this.nrc20TxCnt = 0;
                this.$root.showModalLoading = true;
                api.fetchAccountInfoByName(this.$route.params.id, info => {
                    this.accountInfo = info;
                    if ( info != null) {
                        this.createTime = info.toObject().createdTime.utcSeconds*1000;
                    }
                    this.$root.showModalLoading = false;
                },(errCode,msg) => {
                    console.log("Get block list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });

            //     api.getAddress(this.$route.params.id, o => {
            //         this.$root.showModalLoading = false;
            //         this.minted = o.mintedBlkList;
            //         this.obj = o;
            //         this.decimal = o.decimal;
            //         this.tokens = o.tokens;
            //         this.txs = o.txList;
            //         this.contractCode = o.contractCode;
            //         this.creator = o.creator;
            //         this.deployTxHash = o.deployTxHash;
            //         this.isContract = o.address.type == 1;
            //         if (o.address.type == 1) {// this is a smart contract address
            //             api.getTransactionByContract({address: o.address.hash}, this.$route.params.api, (data) => {
            //                 var data = JSON.parse(data);
            //                 if (data && data.result && data.result.data) {
            //                     this.contract = data.result;
            //                     this.creator = this.contract.from;
            //                     this.deployTxHash = this.contract.hash;
            //                     this.contractCode = base64.decode(data.result.data);
            //                 }
            //             })
            //         }
            //
            //         var token = this.tokens[0];
            //         for (var index in this.tokens) {
            //             if (this.tokens[index].tokenName === 'ATP') {
            //                 token = this.tokens[index];
            //                 break;
            //             }
            //         }
            //         this.displayToken = token;
            //
            //     }, xhr => {
            //         this.$root.showModalLoading = false;
            //         this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
            //     });
            },
            navTitle() {
                return this.isContract ? "Contract" : "Address";
            },
            validTokens() {
                return this.tokens;//.filter(token => token.balance > 0);
            }
        },
        data() {
            return {
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                minted: [],
                obj: null,
                tab: 0,
                txs: [],
                tokens: null,
                displayToken: null,
                decimal: null,
                isContract: false,
                contract: null,
                creator: null,
                deployTxHash: null,
                contractCode: null,
                nrc20TxList: [],
                nrc20TxCnt: 0,
                isNoNrc20Tx: false,
                accountInfo: null,
                createTime: 0,
            };
        },
        methods: {
            isDark(i) {
                return (i % 2 === 0);
            },
            statusIcon(tx, status) {
                let imgPath = "/static/img/";
                var inOrOut;
                if (tx.from.hash === this.$route.params.id)
                    inOrOut = "out";
                else if (tx.to.hash === this.$route.params.id)
                    inOrOut = "in";
                else
                    inOrOut = "";

                if (status === 1) {
                    if (inOrOut === "out") {
                        return imgPath + "ic_tx_sent.png"
                    } else if (inOrOut === "in") {
                        return imgPath + "ic_tx_received.png"
                    } else {
                        return ""
                    }
                } else if (status === null) {
                    if (inOrOut === "out") {
                        return imgPath + "ic_tx_send_pending.png"
                    } else if (inOrOut === "in") {
                        return imgPath + "ic_tx_receive_pending.png"
                    } else {
                        return ""
                    }
                } else {
                    return imgPath + "ic_tx_failed.png"
                }
            },
            failClass(o) {
                if (o.status == 0)
                    return "!";
                else
                    return " ";
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            timeConversionSec(ms) {
                return utility.timeConversionSec(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            easyNumber(n) {
                return utility.easyNumber(n);
            },
            nasAmount(n) {
                BigNumber.config({ DECIMAL_PLACES: 18 })
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().padDecimal();
            },
            tokenAmount(n, decimals) {
                decimals = decimals || 18;
                BigNumber.config({ DECIMAL_PLACES: decimals })
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+' + decimals);
                return amount.div(decimals).toFormat().shortAmount();
            },
            toShortStr(s) {
                if (s.length > 20) {
                    return s.substring(0, 17) + '...';
                }
                return s;
            },

        },
        watch: {
            tab: function (newTab, oldTaB) {
                if (!this.isContract && newTab == 2 && this.nrc20TxList.length == 0) {
                    this.$root.showModalLoading = true;
                    api.getNrc20Txs(this.$route.params.id, 1, o => {
                        this.$root.showModalLoading = false;
                        this.nrc20TxList = o.txnList || [];
                        this.nrc20TxCnt = o.txnCnt;
                        this.isNoNrc20Tx = this.nrc20TxCnt === 0;
                    }, xhr => {
                        this.$root.showModalLoading = false;
                    });
                }
            }
        }
    };
</script>
