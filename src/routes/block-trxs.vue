<style>
    .vue-block-trxs {
        background-color: white;
    }
    .vue-block-trxs .tip a {
        color: rgb(76, 32, 133);
    }

    .vue-block-trxs td,
    .vue-block-trxs th {
        border-top-color: #ddd;
    }

    .vue-block-trxs .fail {
        background: url(../../static/img/warning_icon.png)no-repeat 0 10px;
        padding-left: 28px;
    }

    .vue-block-trxs .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vue-block-trxs .hash-normal {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        color: rgba(0, 87, 255, 1);
        line-height: 20px;
    }

    .vue-block-trxs .hash-failed {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        line-height: 20px;
        color: rgba(240, 68, 52, 1);
    }

    .vue-block-trxs .txs-hash {
        max-width: 185px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    .vue-block-trxs .txs-block {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    .vue-block-trxs .fromTo {
        line-height: 24px;
    }

    .vue-block-trxs .block {
        margin-right: 8px;
    }

    .vue-block-trxs .actions {
        display:inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 10px;
    }

    @media (max-width: 767.98px) {
        .vue-block-trxs .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <div class="vue-block-trxs fullfill">
        <vue-bread :title='"Transactions of" ' :subtitle='$route.params.blockNumber ? ("Block #" + $route.params.blockNumber) : $route.query.a' :subtitlemonospaced='!!$route.query.a' :blockies='$route.query.a'></vue-bread>

        <div v-if="curPageList && curPageList.length" class="container mt20">
            <div class="explorer-table-container">
                <table class="mt20 explorer-table list-table">
                    <tr class="list-header font-12 font-bold font-color-000000">
                        <th></th>
                        <th>TxHash</th>
                        <th>Block</th>
                        <th>Time</th>
                        <th>From</th>
                        <th>Action</th>
                        <th></th>
                        <!--<th class=text-right>Value</th>-->
                    </tr>

                    <tr v-for="(trx, i) in curPageList" :key="i">
                        <td>
                            <img v-if="trx.getInvoice().getStatus() === 500" class="icon40" src="../../static/img/ic_tx_failed.png"/>
                        </td>
                        <td class="txs-hash">
                            <router-link v-bind:to='fragApi + "/tx/" + trx.getSigTrx().id().getHexHash()'>
                                <span v-bind:class="[trx.getInvoice().getStatus() === 500 ? 'hash-failed' : 'hash-normal', 'monospace']">{{ trx.getSigTrx().id().getHexHash() }}</span>
                            </router-link>
                        </td>

                        <td class="txs-block">
                            <router-link class="font-14" v-if='blockHeight' v-bind:to='fragApi + "/block/" + blockHeight'>
                                <span>{{ blockHeight }}</span>
                            </router-link>
                            <i class="font-14 font-color-000000" v-else>pending</i>
                        </td>
                        <td class="time font-14 font-color-555555">
                            <div>
                                <div>{{ timeConversion(Date.now()- blkTime) }} ago</div>
                                <div class="down-arrow-tip">{{ new Date(blkTime).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ blkTime }}</div>
                            </div>
                        </td>
                        <td class="tdxxxwddd txs-from-to">
                            <vue-blockies v-bind:address='trx.getSigTrx().getTrx().sender()'></vue-blockies>
                            <router-link v-bind:to='fragApi + "/account/" + trx.getSigTrx().getTrx().sender()'>
                                <span class="fromTo font-14  monospace">{{ trx.getSigTrx().getTrx().sender() }}</span>
                            </router-link>
                        </td>
                        <td class="tdxxxwddd txs-from-to actions">
                            <div>{{convertOpActionsToStr(trx.getSigTrx().getTrx().getAllActions())}}</div>
                        </td>
                        <td class="tdxxxwddd txs-from-to">
                            <!--<div v-if="o.type==='call'" class="container-tip">-->
                            <!--<span class="tip down-arrow-tip font-15 shadow">Smart Contract</span>-->
                            <!--<img class="icon24" src="../../static/img/icon_tx_type_contract.png" />-->
                            <!--</div>-->
                            <!--<vue-blockies v-bind:address='o.to.alias || o.to.hash'></vue-blockies>-->
                            <!--&lt;!&ndash; <span class="fromTo font-color-000000 font-14" v-if="o.to.hash === $route.query.a">{{ o.to.alias || o.to.hash }}</span> &ndash;&gt;-->
                            <!--<router-link v-bind:to='fragApi + "/address/" + o.to.hash'>-->
                            <!--<span class="fromTo font-14  monospace">{{ o.to.hash }}</span>-->
                            <!--</router-link>-->
                        </td>
                        <!--<td class="text-right font-color-000000 font-14">{{ tokenAmount(o.value) }} NAS</td>-->
                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                            v-on:prev=onPrev ></vue-pagination>
        </div>
        <vue-nothing v-if="curPageList && curPageList.length === 0" title="0 transaction found"></vue-nothing>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
            "vue-blockies": require("@/components/vue-blockies").default,
            "vue-nothing": require("@/components/vue-nothing").default
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                totalPage: 1,
                totalTxs: 0,
                trxList: null,//all trx in block
                blockHeight: 0,
                curPageList: null,//trx in current page
                blkTime:0,
                loadedPageIndex: 0,
            };
        },
        methods: {
            nav(n) {
                // var query = JSON.parse(window.JSON.stringify(this.$route.query));
                //
                // query.p = n;
                // this.$router.push({ path: this.$route.path, query });

                if (n <= this.loadedPageIndex) {
                    if (n < this.currentPage) {
                        this.$router.back();
                    }else {
                        this.$router.forward();
                    }
                } else {
                    let query = JSON.parse(window.JSON.stringify(this.$route.query));
                    query.p = n;
                    this.$router.push({ path: this.$route.path, query });
                }
            },
            nthPage() {

                let p = this.$route.query.p || 1;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                let isNeedRequest = false;
                if (!this.trxList ||  this.trxList.length < 1 || p == this.currentPage) {
                    isNeedRequest = true;
                }
                if (p < this.currentPage) {
                    pReqType = 0;
                }else if (p == this.currentPage) {
                    //need reload data from chain
                    pReqType = 3;
                }
                if (isNeedRequest) {
                    //there is no data ,request and fetch data from chain
                    this.$root.showModalLoading = true;
                    api.fetchBlockList(this.blockHeight,this.$route.params.id, blkInfo => {
                        if (blkInfo.length > 0 ) {
                            this.trxList = blkInfo[0].getTransactionsList();
                            this.blkTime = blkInfo[0].toObject().signedHeader.header.timestamp.utcSeconds*1000;
                            let listLen = this.trxList.length;
                            this.totalPage = Math.ceil(listLen.toFixed(1)/30);
                            let end = listLen <= 30 ? listLen : 30;
                            this.curPageList = this.trxList.slice(0,end);
                            if (pReqType == 3) {
                                this.currentPage = parseInt(p);
                                if (this.currentPage > 1) {
                                    this.curPageList = this.trxList.slice((this.currentPage-1)*30,this.currentPage*30);
                                }
                            }else {
                                this.currentPage = 1;
                            }
                            this.savePageInfo();
                        }
                        this.$root.showModalLoading = false;
                        this.loadedPageIndex += 1;
                    },(errCode,msg) => {
                        console.log("Get block list fail,error code is %s,msg is %s",errCode,msg);
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    });
                }else {
                    //update curPageList use current page data in trxList
                    let isNextPage = true;
                    if (pReqType == 0) {
                        isNextPage = false
                    }
                    if (!isNextPage && this.currentPage > 1) {
                        this.curPageList = this.trxList.slice((this.currentPage-2)*30,(this.currentPage-1)*30);
                        this.currentPage -= 1;
                        this.savePageInfo();
                    }else if (isNextPage && this.currentPage < this.totalPage) {
                        this.curPageList = this.trxList.slice(this.currentPage*30,(this.currentPage+1)*30);
                        if (this.loadedPageIndex < this.totalPage) {
                            this.loadedPageIndex += 1;
                        }
                        this.currentPage += 1;
                        this.savePageInfo();
                    }
                }

            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                this.nav(this.currentPage - 1);
            },
            onLast() {
                this.nav(this.currentPage + 1);
            },
            onNext() {
                this.nav(this.currentPage + 1);
            },
            onPrev() {
                this.nav(this.currentPage - 1);
            },

            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            easyNumber(n) {
                return utility.easyNumber(n);
            },
            tokenAmount(n) {
                BigNumber.config({ DECIMAL_PLACES: 18 });
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount();
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                cacheData.loadedPage = this.loadedPageIndex;
                localStorage.setItem("blockTxsCache",JSON.stringify(cacheData));
            },
            getPageInfo() {
                let info = localStorage.getItem("blockTxsCache");
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                if (localStorage.getItem("blockTxsCache") != null) {
                    localStorage.removeItem("blockTxsCache");
                }
            },
            convertOpActionsToStr(actionArray) {
                if (actionArray.length) {
                    return actionArray.join(",");
                }
                return ""
            }
        },
        mounted() {
            let cacheData = this.getPageInfo();
            if (cacheData != null) {
                this.currentPage =  parseInt(cacheData.currentPage);
                this.totalPage = parseInt(cacheData.totalPage);
                this.loadedPageIndex = parseInt(cacheData.loadedPage);
            }
            this.blockHeight = this.$route.params.blockNumber;
            this.nthPage();
        },
        watch: {
            $route() {
                this.nthPage();
            }
        },
        destroyed() {
            this.clearCachePageInfo();
        }
    };
</script>
