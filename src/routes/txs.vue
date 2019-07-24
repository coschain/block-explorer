<style>
    .vue-txs {
        background-color: white;
    }
    .vue-txs .tip a {
        color: rgb(76, 32, 133);
    }

    .vue-txs td,
    .vue-txs th {
        border-top-color: #ddd;
    }

    .vue-txs .fail {
        background: url(../../static/img/warning_icon.png)no-repeat 0 10px;
        padding-left: 28px;
    }

    .vue-txs .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vue-txs .hash-normal {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        color: rgba(0, 87, 255, 1);
        line-height: 20px;
    }

    .vue-txs .hash-failed {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        line-height: 20px;
        color: rgba(240, 68, 52, 1);
    }

    .vue-txs .txs-hash {
        max-width: 185px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    .vue-txs .txs-block {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    .vue-txs .fromTo {
        line-height: 24px;
    }

    .vue-txs .block {
        margin-right: 8px;
    }

    .vue-txs .actions {
          display:inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: 10px;
      }

    .vue-txs .trxListHeader {
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: #e8e8e8;
        font-size: 11px ;
    }
    .vue-txs .trxListHeadCol {
        width: calc(100% / 6);
    }

    .vue-txs .txContentCol {
        display:inline-block;
        width: calc(100% / 6);
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    @media (max-width: 767.98px) {
        .vue-txs .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <!-- https://etherscan.io/txs -->
    <div class="vue-txs fullfill">
        <vue-bread :title='"Transactions" + (($route.query.a || $route.query.block) ? " of" : "")' :subtitle='$route.query.block ? ("Block #" + $route.query.block) : $route.query.a' :subtitlemonospaced='!!$route.query.a' :blockies='$route.query.a'></vue-bread>
        <template v-if="trxList.length">
            <div class="container maxPageTips">Display the latest 50 pages of data</div>
            <div  class="container">
                <div class="explorer-table-container">
                    <table class="mt20 explorer-table">
                        <tr class="trxListHeader  font-bold font-color-000000">
                            <th class="trxListHeadCol">Hash</th>
                            <th class="trxListHeadCol">Block</th>
                            <th class="trxListHeadCol">Time</th>
                            <th class="trxListHeadCol">From</th>
                            <th class="trxListHeadCol">Action</th>
                            <th class="trxListHeadCol">Status</th>
                        </tr>

                        <tr v-for="(trx, i) in trxList" :key="i">
                            <!--<td>-->
                            <!--<img v-if="trx.getTrxWrap().getReceipt().getStatus() === 500" class="icon40" src="../../static/img/ic_tx_failed.png"/>-->
                            <!--</td>-->
                            <td class="txContentCol">
                                <router-link v-bind:to='fragApi + "/tx/" + trx.getTrxId().getHexHash()' target="_blank">
                                    <span v-bind:class="[trx.getTrxWrap().getReceipt().getStatus() === 500 ? 'hash-failed' : 'hash-normal', 'monospace']">{{ trx.getTrxId().getHexHash() }}</span>
                                </router-link>
                            </td>

                            <td class="txContentCol">
                                <router-link class="font-14" v-if='trx.getBlockHeight()' v-bind:to='fragApi + "/block/" + trx.getBlockHeight()' target="_blank">
                                    <span>{{ trx.getBlockHeight() }}</span>
                                </router-link>
                                <!--<i class="font-14 font-color-000000" v-else>pending</i>-->
                            </td>
                            <td class="txContentCol">
                                <!--<div>-->
                                <!--<div>{{ timeConversion(Date.now()-trx.getBlockTime().getUtcSeconds()*1000) }} ago</div>-->
                                <!--<div class="down-arrow-tip">{{ new Date(trx.getBlockTime().getUtcSeconds()*1000 ).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ trx.getBlockTime().getUtcSeconds()*1000  }}</div>-->
                                <!--</div>-->
                                {{ timeConversion(Date.now()-trx.getBlockTime().getUtcSeconds()*1000) }} ago
                            </td>
                            <td class="txContentCol">
                                <router-link v-bind:to='fragApi + "/account/" + trx.getTrxWrap().getSigTrx().getTrx().sender()' target="_blank">
                                    <span class="monospace">{{ trx.getTrxWrap().getSigTrx().getTrx().sender() }}</span>
                                </router-link>
                            </td>
                            <td class="txContentCol">
                                {{convertOpActionsToStr(trx.getTrxWrap().getSigTrx().getTrx().getAllActions())}}
                            </td>

                            <td class="txContentCol" v-if="trx.hasTrxWrap()">
                                {{getTrxReceiptStatus(trx)}}
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-if="isShowLoadMore" class="loadMore-container">
                    <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageTxs()">Load More</button>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    const maxTxsPagesNum = 50;
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-blockies": require("@/components/vue-blockies").default,
            "vue-nothing": require("@/components/vue-nothing").default
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                listStart:null,
                listEnd:null,
                lastInfo:null,
                trxList: [],
                pageInfo:[],
                isShowLoadMore: true,
                isFetching: false,
            };
        },
        methods: {
            async nthPage(p) {
                if (p < this.currentPage || p > maxTxsPagesNum) {
                    this.isFetching = false;
                    return;
                }
                this.$root.showModalLoading = true;
                let start = this.listStart;
                let lastTrx = this.lastInfo;
                try {
                    let trxList = await api.fetchTrxListByTime(null,start, 30, lastTrx);
                    if (trxList.length > 0) {
                        this.trxList = this.trxList.concat(trxList);
                        this.lastInfo = trxList[trxList.length-1];
                        this.listStart = this.lastInfo.getBlockTime();
                        if (this.currentPage === 0) {
                            this.listEnd = null;
                        }else {
                            this.listEnd = trxList[0].getBlockTime();
                        }
                        let curPageLen = this.pageInfo.length;
                        let info = {start:this.listStart,lastPost:this.lastInfo};
                        if (curPageLen === 0 || p === 1) {
                            info.end = null;
                        } else {
                            if (curPageLen >= 1) {
                                info.end = this.pageInfo[curPageLen - 1].start;
                            }
                            this.pageInfo.push(info);
                        }
                        this.currentPage = parseInt(p);
                    }
                }catch (err) {
                    console.log("fetch trx list fail,the error is %s",err);
                }
                this.$root.showModalLoading = false;
                this.isShowLoadMore = this.currentPage < maxTxsPagesNum;
                this.isFetching = false;
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
            easyNumber(n) {
                return utility.easyNumber(n);
            },
            tokenAmount(n) {
                BigNumber.config({ DECIMAL_PLACES: 18 })
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount();
            },

            convertOpActionsToStr(actionArray) {
                if (actionArray.length) {
                    return actionArray.join(",");
                }
                return ""
            },

            getTrxReceiptStatus(trx) {
                return utility.getTrxStatusByTrxInfo(trx)
            },

            onClickLoadNextPageTxs() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.currentPage+1);
            },
        },
        mounted() {
            this.nthPage(1);
        },

        watch: {
            $route() {
                this.nthPage(1);
            }
        },

    };
</script>
