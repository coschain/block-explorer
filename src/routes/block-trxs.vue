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

    .vue-block-trxs .blkTxsListHeader {
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

    .vue-block-trxs .blkTxsListHeadCol {
        width: calc(100% / 6);
    }

    .vue-block-trxs .blkTxsListContentCol {
        display:inline-block;
        width: calc(100% / 6);
        height: 50px;
        vertical-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
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
            <div class="maxPageTips">Display the latest {{maxBlkTxsPageNum}} pages of data</div>
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="blkTxsListHeader font-bold font-color-000000">
                        <th class="blkTxsListHeadCol">Hash</th>
                        <th class="blkTxsListHeadCol">Block</th>
                        <th class="blkTxsListHeadCol">Time</th>
                        <th class="blkTxsListHeadCol">From</th>
                        <th class="blkTxsListHeadCol">Action</th>
                        <th class="blkTxsListHeadCol">Status</th>
                    </tr>

                    <tr v-for="(trx, i) in curPageList" :key="i">
                        <!--<td>-->
                            <!--<img v-if="trx.getReceipt().getStatus() === 500" class="icon40" src="../../static/img/ic_tx_failed.png"/>-->
                        <!--</td>-->
                        <td class="blkTxsListContentCol">
                            <router-link v-bind:to='fragApi + "/tx/" + trx.getSigTrx().id().getHexHash()' target="_blank">
                                <span v-bind:class="[trx.getReceipt().getStatus() === 500 ? 'hash-failed' : 'hash-normal', 'monospace']">{{ trx.getSigTrx().id().getHexHash() }}</span>
                            </router-link>
                        </td>

                        <td class="blkTxsListContentCol">
                            <router-link class="font-14" v-if='blockHeight' v-bind:to='fragApi + "/block/" + blockHeight' target="_blank">
                                <span>{{ blockHeight }}</span>
                            </router-link>
                            <!--<i class="font-14 font-color-000000" v-else>pending</i>-->
                        </td>
                        <td class="blkTxsListContentCol">{{ timeConversion(Date.now()- blkTime) }} ago </td>
                            <!--<div>-->
                                <!--<div>{{ timeConversion(Date.now()- blkTime) }} ago</div>-->
                                <!--<div class="down-arrow-tip">{{ new Date(blkTime).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ blkTime }}</div>-->
                            <!--</div>-->
                        <!--</td>-->
                        <td class="blkTxsListContentCol">
                            <!--<vue-blockies v-bind:address='trx.getSigTrx().getTrx().sender()'></vue-blockies>-->
                            <router-link v-bind:to='fragApi + "/account/" + trx.getSigTrx().getTrx().sender()' target="_blank">
                                <span class="monospace">{{ trx.getSigTrx().getTrx().sender() }}</span>
                            </router-link>
                        </td>
                        <td class="blkTxsListContentCol">
                            {{convertOpActionsToStr(trx.getSigTrx().getTrx().getAllActions())}}
                        </td>

                        <td class="blkTxsListContentCol">
                            {{getTrxStatus(trx)}}
                        </td>
                    </tr>
                </table>
            </div>

            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageBlkTxs()">Load More</button>
            </div>
        </div>

    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
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
                totalPage: 1,
                totalTxs: 0,
                trxList: null,//all trx in block
                blockHeight: 0,
                curPageList: null,//trx in current page
                blkTime:0,
                loadedPageIndex: 0,
                isShowLoadMore: true,
                maxBlkTxsPageNum: 50,
            };
        },
        methods: {
            nav(n) {
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
            nthPage(p) {
                let isNeedRequest = false;
                if (!this.trxList ||  this.trxList.length < 1) {
                    isNeedRequest = true;
                }

                if (isNeedRequest) {
                    //there is no data ,request and fetch data from chain
                    this.$root.showModalLoading = true;
                    api.fetchSignedBlock(this.blockHeight, blkInfo => {
                        if (blkInfo) {
                            this.trxList = blkInfo.getTransactionsList();
                            this.blkTime = blkInfo.toObject().signedHeader.header.timestamp.utcSeconds*1000;
                            let listLen = this.trxList.length;
                            this.totalPage = Math.ceil(listLen.toFixed(1)/30);
                            let end = listLen <= 30 ? listLen : 30;
                            this.curPageList = this.trxList.slice(0,end);
                            this.currentPage = 1;
                            this.loadedPageIndex += 1;

                            if (this.maxBlkTxsPageNum > this.totalPage) {
                                this.isShowLoadMore = this.currentPage < this.totalPage;
                            } else {
                                this.isShowLoadMore = this.currentPage < this.maxBlkTxsPageNum;
                            }
                        }
                        this.$root.showModalLoading = false;

                    },(errCode,msg) => {
                        console.log("Get block list fail,error code is %s,msg is %s",errCode,msg);
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    });
                }else {
                    if (p < this.currentPage || p > this.maxBlkTxsPageNum || p > this.totalPage) {
                        return;
                    }
                    this.curPageList = this.trxList.slice(0,(this.currentPage+1)*30);
                    this.currentPage = parseInt(p);
                    this.loadedPageIndex += 1;
                    if (this.maxBlkTxsPageNum > this.totalPage) {
                        this.isShowLoadMore = this.currentPage < this.totalPage;
                    } else {
                        this.isShowLoadMore = this.currentPage < this.maxBlkTxsPageNum;
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
            onGoFirstPage() {
                if (this.currentPage > 1) {
                    let page = this.currentPage;
                    let p = this.$route.query.p;
                    if (parseInt(p) > page) {
                        page = parseInt(p);
                    }
                    this.currentPage = 2;
                    this.$router.go(1-page);
                }
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

            convertOpActionsToStr(actionArray) {
                if (actionArray.length) {
                    return actionArray.join(",");
                }
                return ""
            },

            getTrxStatus(trx) {
                return utility.getTrxStatusByTrxWrap(trx);
            },


            addTimeParam() {
                let t = this.$route.query.t;
                if (t == null || typeof t == "undefined") {
                    t = Date.now();
                    let query = JSON.parse(window.JSON.stringify(this.$route.query));
                    query.t = t;
                    this.$router.replace({ path: this.$route.path, query });
                }
            },

            onClickLoadNextPageBlkTxs() {
                this.nthPage(this.currentPage + 1);
            }
        },
        mounted() {
            this.blockHeight = this.$route.params.blockNumber;
            this.nthPage(1);

        },
        watch: {
            $route() {
                this.nthPage(1);
            }
        },

    };
</script>
