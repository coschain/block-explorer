<style>

    .vue-account td.out {
        width: 50px;
    }

    .vue-account td.in::before,
    .vue-account td.out::before {
        border-radius: 4px;
        color: white;
        padding: 3px 5px;
    }

    .vue-account td.in::before {
        background-color: var(--green);
        content: "in";
    }

    .vue-account td.out::before {
        background-color: var(--orange);
        content: "out";
    }

    .vue-account {
        background-color: white;
    }

    .vue-account .container .table th {
        border-top: 0;
    }

    .vue-account .container .title {
        overflow: auto;
    }

    .vue-account .txfee {
        font-size: 14px;
        /* font-family: OpenSans; */
        color: rgba(85, 85, 85, 1);
        line-height: 20px;
    }

    .vue-account .fail {
        background: url(../../static/img/warning_icon.png) no-repeat 0 10px;
        padding-left: 28px;
    }

    .vue-account .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vue-account .tdxxxwddd {
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

    .vue-account .dropdown-menu {
        min-width: initial;
    }

    .vue-account .block {
        margin-right: 8px;
    }

    .vue-account .pl-16 {
        padding-left: 16px;
    }

    .vue-account .voterListHeader {
        margin-top: 20px;
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: rgba(247, 247, 247, 1);
        font-size: 14px ;
    }

    .vue-account .voterListHeader .headerCol {
        width: 50%;
        padding-left: 15px;
    }

    .vue-account .listBg {
        background-color: white;
    }

    .vue-account .voterListContent {
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 50px;
        font-size: 14px ;
    }

    .vue-account .voterListContent .voterListContentCol {
        width: 50%;
        padding-left: 15px;
        color: rgba(85, 85, 85, 1);
    }

    .vue-account .listBg:nth-of-type(odd) {
        background: rgba(247, 247, 247, 1);
    }

    .vue-account .listBg:nth-of-type(event) {
        background: rgba(255, 255, 255, 1);
    }

</style>
<template>
    <!-- https://etherscan.io/account/0xea674fdde714fd979de3edf0f56aa9716b898ec8 -->
    <div class="vue-account fullfill" v-bind:triggerComputed=urlChange>
        <vue-bread v-bind:title='navTitle'
                   v-bind:subtitle="$route.params.id"
                   v-bind:subtitlemonospaced="!!$route.params.id">
        </vue-bread>
        <div class="container explorer-table-container" v-if=accountInfo>
            <div class="font-24 font-bold font-color-000000 table-title">
                Overview
                <!--<span class=c777 v-show=obj.account.alias> | {{ obj.account.alias }}</span>-->
            </div>
            <table class="explorer-table d-none d-md-table" style="table-layout: auto">
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">COS Balance:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ accountInfo.getCoin().toString() }}
                    </td>
                </tr>
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
                    <td class="base-info-key font-16 font-color-555555 pl-16">Reputation:</td>
                    <td class="font-16 font-color-000000">{{getReputationFromAccountInfo(accountInfo)}}</td>
                </tr>
                <tr v-if="judgeAccountIsFrozen(accountInfo)">
                    <td class="base-info-key font-16 font-color-555555 pl-16">Frozen:</td>
                    <td class="font-16 font-color-000000">{{getFreezeDesc(accountInfo)}}</td>
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
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Charged Ticket:
                    </td>
                    <td class="font-16 font-color-000000">{{ accountInfo.getChargedTicket() }} </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Free Ticket:
                    </td>
                    <td class="font-16 font-color-000000">{{ accountInfo.getFreeTicket() }} </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Follower Count:
                    </td>
                    <td class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/follower/" + $route.params.id'>
                            <span>{{accountInfo.toObject().followerCount}}</span>
                        </router-link>
                    </td>
                </tr>

                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Following Count:
                    </td>
                    <td class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/following/" + $route.params.id'>
                        <span>{{accountInfo.toObject().followingCount}}</span>
                        </router-link>
                    </td>
                </tr>

                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Account transactions:</td>
                    <td class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/user-trxs/" + $route.params.id'>
                            <span>view</span>
                        </router-link>
                    </td>
                </tr>

                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Max Stamina:</td>
                    <td class="font-16 font-color-000000">{{accountInfo.toObject().staminaMax}}</td>
                </tr>

                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Free Stamina:</td>
                    <td class="font-16 font-color-000000">{{accountInfo.toObject().staminaFreeRemain}}</td>
                </tr>

                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Pledge Stamina:</td>
                    <td class="font-16 font-color-000000">{{accountInfo.toObject().staminaStakeRemain}}</td>
                </tr>
            </table>

            <div class="d-none d-md-block" v-if="voterList.length > 0">
                <div class="font-18 font-color-000000 table-title">
                    Voters to BP {{ accountInfo.toObject().accountName.value }}
                </div>
                <div class="voterListHeader font-bold font-color-000000">
                    <div class="headerCol">Account</div>
                    <div class="headerCol">Vest</div>
                </div>
                <!--content-->
                <div v-for="voter in voterList" class="listBg">
                    <div class="voterListContent">
                        <div class="voterListContentCol">
                            <router-link v-bind:to='fragApi + "/account/" + voter.getAccountName().getValue()'>
                                <span class="monospace">{{voter.getAccountName().getValue()}}</span>
                            </router-link>
                        </div>
                        <div class="voterListContentCol">{{voter.getVest().toString()}}</div>
                    </div>
                </div>
                <div class="text-center">
                    <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageBpVoterData">Load More</button>
                </div>
            </div>


            <div class="mobile-detail d-md-none">
                <div class="mobileCell">
                    <div class="font-color-555555">COS Balance:</div>
                    <div class="detail">{{ accountInfo.getCoin().toString() }} </div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">AccountName:</div>
                    <div class="detail">{{  accountInfo.toObject().accountName.value }}</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">CreatedTime:</div>
                    <!--<div class="detail">{{ accountInfo.createdTime.utcSeconds }}</div>-->
                    <div class="font-16 font-color-000000">{{ timeConversion(Date.now() - createTime) }} ago ({{ new Date(createTime).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ createTime }})</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">PublicKey:</div>
                    <div class="font-16 font-color-000000">{{accountInfo.hasPublicKey()?accountInfo.getPublicKey().toWIF():""}}</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Vest:</div>
                    <div class="font-16 font-color-000000">{{accountInfo.hasVest()?accountInfo.getVest().toString():""}}</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Reputation:</div>
                    <div class="font-16 font-color-000000">{{getReputationFromAccountInfo(accountInfo)}}</div>
                </div>
                <div v-if="judgeAccountIsFrozen(accountInfo)" class="mobileCell">
                    <div class="font-color-555555">Frozen:</div>
                    <div class="font-16 font-color-000000">{{getFreezeDesc(accountInfo)}}</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Posted:
                    </div>
                    <div class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/user-article/" + $route.params.id+"?t="+Date.now()'>
                            <span>{{accountInfo.toObject().postCount}}</span>
                        </router-link>
                    </div>
                </div>

                <div class="mobileCell">
                    <div class="font-color-555555">Follower Count:
                    </div>
                    <div class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/follower/" + $route.params.id'>
                        <span>{{accountInfo.toObject().followerCount}}</span>
                        </router-link>
                    </div>
                </div>

                <div class="mobileCell">
                    <div class="font-color-555555">Following Count:
                    </div>
                    <div class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/following/" + $route.params.id'>
                        <span>{{accountInfo.toObject().followingCount}}</span>
                        </router-link>
                    </div>
                </div>

                <div class="mobileCell">
                    <div class="font-color-555555">Account transactions:</div>
                    <div class="font-16 font-color-000000">
                        <router-link v-bind:to='fragApi + "/user-trxs/" + $route.params.id '>
                        <span>view</span>
                        </router-link>
                    </div>
                </div>

                <div class="mobileCell">
                    <div class="font-color-555555">Max Stamina:</div>
                    <div class="font-16 font-color-000000">{{accountInfo.toObject().staminaMax}}</div>
                </div>

                <div class="mobileCell">
                    <div class="font-color-555555">Free Stamina:</div>
                    <div class="font-16 font-color-000000">{{accountInfo.toObject().staminaFreeRemain}}</div>
                </div>

                <div>
                    <div class="font-color-555555">Pledge Stamina:</div>
                    <div class="font-16 font-color-000000">{{accountInfo.toObject().staminaStakeRemain}}</div>
                </div>

                <div class="mobileCell" v-if="voterList.length > 0">
                    <div class="font-18 font-color-000000 table-title">
                        Voters to BP {{ accountInfo.toObject().accountName.value }}
                    </div>
                    <div class="voterListHeader font-bold font-color-000000">
                        <div class="headerCol">Account</div>
                        <div class="headerCol">Vest</div>
                    </div>
                    <!--content-->
                    <div v-for="voter in voterList" class="listBg">
                        <div class="voterListContent">
                            <div class="voterListContentCol">
                                <router-link v-bind:to='fragApi + "/account/" + voter.getAccountName().getValue()'>
                                    <span class="monospace">{{voter.getAccountName().getValue()}}</span>
                                </router-link>
                            </div>
                            <div class="voterListContentCol">{{voter.getVest().toString()}}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageBpVoterData">Load More</button>
                    </div>
                </div>
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
                    this.accountInfo = info.getInfo();
                    if (this.accountInfo.hasCreatedTime()) {
                        this.createTime = this.accountInfo.getCreatedTime().getUtcSeconds()*1000;
                    }
                    this.$root.showModalLoading = false;
                },(errCode,msg) => {
                    console.log("Get account list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
                api.fetchAccountBpVoterList(this.$route.params.id, 30, null).then(res => {
                    this.voterList = res.getVoterList();
                }).catch(({ errCode, msg }) => {
                    console.log(errCode, msg);
                })

            //     api.getaccount(this.$route.params.id, o => {
            //         this.$root.showModalLoading = false;
            //         this.minted = o.mintedBlkList;
            //         this.obj = o;
            //         this.decimal = o.decimal;
            //         this.tokens = o.tokens;
            //         this.txs = o.txList;
            //         this.contractCode = o.contractCode;
            //         this.creator = o.creator;
            //         this.deployTxHash = o.deployTxHash;
            //         this.isContract = o.account.type == 1;
            //         if (o.account.type == 1) {// this is a smart contract account
            //             api.getTransactionByContract({account: o.account.hash}, this.$route.params.api, (data) => {
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
                // return this.isContract ? "Contract" : "account";
                return "Account";
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
                voterList: []
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

            getReputationFromAccountInfo(accountInfo) {
                //Judge whether contain func getReputation
                if (accountInfo != null && typeof accountInfo != "undefined" && accountInfo.getReputation) {
                    return accountInfo.getReputation();
                }
                return 0;
            },

            //Judge whether current Account is Frozen
            judgeAccountIsFrozen(accountInfo) {
                if (accountInfo != null && typeof accountInfo != "undefined" && accountInfo.getFreeze) {
                    //1:freeze 0:Unfrozen
                    let status = accountInfo.getFreeze();
                    if (status !== 0) {
                        return true
                    }
                }
                return false;
            },

            getFreezeDesc(accountInfo) {
                if (this.judgeAccountIsFrozen(accountInfo)) {
                    let desc = accountInfo.getFreezeMemo();
                    if (desc.length < 1) {
                        desc = "Account is frozen";
                    }
                    return desc;
                }
                return ""
            },

            onClickLoadNextPageBpVoterData() {
                let lastVoter = this.voterList[this.voterList.length - 1].getAccountName();
                api.fetchAccountBpVoterList(this.$route.params.id, 30, lastVoter).then(res => {
                    let voterList = res.getVoterList();
                    this.voterList = this.voterList.concat(voterList);
                }).catch(({ errCode, msg }) => {
                    console.log(errCode, msg)
                })
            }

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
        },
    };
</script>
