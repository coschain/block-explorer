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

        <div v-if="trxList && trxList.length" class="container mt20">
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
                            <router-link v-bind:to='fragApi + "/tx/" + trx.getTrxId().getHexHash()'>
                                <span v-bind:class="[trx.getTrxWrap().getReceipt().getStatus() === 500 ? 'hash-failed' : 'hash-normal', 'monospace']">{{ trx.getTrxId().getHexHash() }}</span>
                            </router-link>
                        </td>

                        <td class="txContentCol">
                            <router-link class="font-14" v-if='trx.getBlockHeight()' v-bind:to='fragApi + "/block/" + trx.getBlockHeight()'>
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
                            <router-link v-bind:to='fragApi + "/account/" + trx.getTrxWrap().getSigTrx().getTrx().sender()'>
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

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                v-on:prev=onPrev v-on:firstPage=onGoFirstPagePage></vue-pagination>
        </div>
        <vue-nothing v-if="trxList && trxList.length === 0" title="0 transaction found"></vue-nothing>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    const txsPageCacheKey = utility.getPageCacheKey(utility.pageCacheType.txsList);
    
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
                maxDisplayCnt: 0,
                totalPage: 1,
                totalTxs: 0,
                listStart:null,
                listEnd:null,
                lastInfo:null,
                trxList: null,
                pageInfo:[],
                createdPageIndex:0,
            };
        },
        methods: {
            nav(n) {
                if (n < this.createdPageIndex && this.createdPageIndex >= this.currentPage) {
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
            async nthPage() {
                this.$root.showModalLoading = true;
                let p = this.$route.query.p || 1;
                let start = this.listStart;
                let isNext = true;
                let lastTrx = this.lastInfo;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage === 2 ) {
                        start = null;
                        lastTrx= null;
                    }else {
                        let infoLen = this.pageInfo.length;
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.pageInfo[this.currentPage-3];
                            start = info.start;
                            lastTrx = info.lastPost;
                        }
                    }
                    pReqType = 0;
                    isNext = false;
                }else if (this.currentPage === parseInt(p)) {
                    //refresh current page
                    pReqType = 3;
                }
                try {
                    let trxList = await api.fetchTrxListByTime(null,start, 30, lastTrx);
                    if (trxList.length > 0) {
                        this.trxList = trxList;
                        this.lastInfo = trxList[trxList.length-1];
                        this.listStart = this.lastInfo.getBlockTime();
                        if (this.currentPage === 0 && isNext) {
                            this.listEnd = null;
                        }else {
                            this.listEnd = trxList[0].getBlockTime();
                        }
                        let curPageLen = this.pageInfo.length;
                        let info = {start:this.listStart,lastPost:this.lastInfo};
                        if (curPageLen === 0 || (this.currentPage == 1 && pReqType == 3)) {
                            info.end = null;
                        }
                        if (pReqType === 1) {
                            if (this.currentPage + 1 === this.totalPage) {
                                this.totalPage += 1;
                                if (curPageLen >= 1) {
                                    info.end = this.pageInfo[curPageLen - 1].start;
                                }
                                this.pageInfo.push(info);
                            }else {
                                if (curPageLen >= 1 && this.currentPage <= curPageLen) {
                                    info.end = this.pageInfo[this.currentPage-1].start;
                                }
                                this.updateTxsListPage(this.currentPage,info);
                            }
                            this.currentPage += 1;
                            if (this.createdPageIndex < this.totalPage) {
                                this.createdPageIndex += 1;
                            }
                        }else if (pReqType === 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 2 && this.currentPage <= curPageLen) {
                                info.end = this.pageInfo[this.currentPage-2].start;
                            }
                            this.updateTxsListPage(this.currentPage-1,info);
                        }else if (pReqType === 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.savePageInfo();
                }catch (err) {
                    console.log("fetch trx list fail,the error is %s",err);
                }
                this.$root.showModalLoading = false;
            },

            updateTxsListPage(index,info) {
                if (info && index >= 0 && index < this.pageInfo.length) {
                    this.pageInfo.splice(index,1,info);
                }
            },

            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                // this.nav(1);
                this.nav(this.currentPage - 1);
            },
            onLast() {
                // this.nav(this.totalPage);
                this.nav(this.currentPage + 1);
            },
            onNext() {
                this.nav(this.currentPage + 1);
            },
            onPrev() {
                this.nav(this.currentPage - 1);
            },
            onGoFirstPagePage() {
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
            // onTo(n) {
            //     this.nav(n);
            // },
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
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                cacheData.createdPageIndex = this.createdPageIndex;
                let listLen = this.pageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.pageInfo.forEach(function (info) {
                        let obj = {};
                        obj.start = info.start?info.start.getUtcSeconds():null;
                        obj.end = info.end?info.end.getUtcSeconds():null;
                        if (info.lastPost) {
                            let lastInfo = {blkTime:info.lastPost.getBlockTime().getUtcSeconds()};
                            lastInfo.trxId = info.lastPost.getTrxId().getHexHash();
                            obj.lastPost = lastInfo;
                        }else {
                            obj.lastPost = null;
                        }

                        // obj.lastPost = info.lastPost?info.lastPost.toObject():null;
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastInfo = null;
                }
                sessionStorage.setItem(txsPageCacheKey,JSON.stringify(cacheData));

            },

            getPageInfo() {
                let info = sessionStorage.getItem(txsPageCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                if (sessionStorage.getItem(txsPageCacheKey) != null) {
                    sessionStorage.removeItem(txsPageCacheKey);
                }
            },
            convertOpActionsToStr(actionArray) {
                if (actionArray.length) {
                    return actionArray.join(",");
                }
                return ""
            },

            getTrxReceiptStatus(trx) {
                return utility.getTrxStatusByTrxInfo(trx)
            }
        },
        mounted() {
            let cacheData = this.getPageInfo();
            if (cacheData != null) {
                this.currentPage = parseInt(cacheData.currentPage);
                this.totalPage = parseInt(cacheData.totalPage);
                this.createdPageIndex = parseInt(cacheData.createdPageIndex);
                if (cacheData.pageInfo != null) {
                    let list = [];
                    cacheData.pageInfo.forEach(function (obj) {
                        let info = {};
                        if (obj.start != null) {
                            let start = new api.cos_sdk.raw_type.time_point_sec();
                            start.setUtcSeconds(obj.start);
                            info.start = start;
                        }
                        if (obj.end != null ) {
                            let end = new api.cos_sdk.raw_type.time_point_sec();
                            end.setUtcSeconds(obj.end);
                            info.end = end;
                        }
                        if (obj.lastPost != null) {
                            let lastInfo = new api.cos_sdk.grpc.TrxInfo();
                            let time = new api.cos_sdk.raw_type.time_point_sec();
                            time.setUtcSeconds(obj.lastPost.blkTime);
                            lastInfo.setBlockTime(time);
                            let trxId = new api.cos_sdk.raw_type.sha256();
                            trxId.setHexHash(obj.lastPost.trxId);
                            lastInfo.setTrxId(trxId);
                            info.lastPost = lastInfo;
                        }
                        list.push(info);
                    });
                    this.pageInfo = list;
                }
                if (this.currentPage == 1) {
                    this.postListStart = null;
                    this.lastPost = null;
                }else if (this.currentPage >= 2 && this.pageInfo.length >= this.currentPage){
                    let lastInfo = this.pageInfo [this.currentPage-2];
                    this.listStart = lastInfo.start;
                    this.lastInfo = lastInfo.lastPost;
                }
            }
            this.nthPage();
        },

        watch: {
            $route() {
                this.nthPage();
            }
        },
        beforeDestroy() {
            if (this.currentPage > 1) {
                this.createdPageIndex = this.currentPage;
                this.savePageInfo();
            }
        },

        destroyed() {
            if (this.currentPage <= 1) {
                this.clearCachePageInfo();
            }
        }
    };
</script>
