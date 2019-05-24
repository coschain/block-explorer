<style>
    .vue-user-trx {
        background-color: white;
    }
    .vue-user-trx .tip a {
        color: rgb(76, 32, 133);
    }

    .vue-user-trx td,
    .vue-user-trx th {
        border-top-color: #ddd;
    }

    .vue-user-trx .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vue-user-trx .trxListHeader {
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
    .vue-user-trx .trxListHeadCol {
        width: 20%;
    }

    .vue-user-trx .txContentCol {
        display:inline-block;
        width: 20%;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }


</style>
<template>
    <div class="vue-user-trx fullfill">
        <vue-bread v-bind:title='"Transactions of:"'
                   v-bind:subtitle="$route.params.account"
                   v-bind:subtitlemonospaced="!!$route.params.account">
        </vue-bread>        <div v-if="trxList && trxList.length" class="container mt20">
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="trxListHeader  font-bold font-color-000000">
                        <th class="trxListHeadCol">Hash</th>
                        <th class="trxListHeadCol">Block</th>
                        <th class="trxListHeadCol">Time</th>
                        <th class="trxListHeadCol">From</th>
                        <th class="trxListHeadCol">Action</th>
                    </tr>

                    <tr v-for="(trx, i) in trxList" :key="i">
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
                account: null,
                firstPageStartTime: null,
                firstPageEndTime: null,
                usrTxCacheKey: this.$route.params.account + this.$route.params.t,
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
            nthPage() {
                this.$root.showModalLoading = true;
                let p = this.$route.query.p || 1;
                let start = this.listStart;
                let isNext = true;
                let lastTrx = this.lastInfo;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage === 2 ) {
                        start = this.firstPageStart;
                        lastTrx= null;
                    }else {
                        let infoLen = this.pageInfo.length;
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.pageInfo[this.currentPage-3];
                            start = info.start;
                            lastTrx = info.lastTrx;
                        }
                    }
                    pReqType = 0;
                    isNext = false;
                }else if (this.currentPage === parseInt(p)) {
                    //refresh current page
                    pReqType = 3;
                }

                api.fetchUserTrxListByTime(this.account,start,this.firstPageEndTime,30,lastTrx,trxList => {
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
                        let info = {start:this.listStart,lastTrx:this.lastInfo};
                        if (curPageLen === 0 || (this.currentPage == 1 && pReqType == 3)) {
                            info.end = this.firstPageEnd;
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
                    this.$root.showModalLoading = false;
                    this.savePageInfo();
                },(errCode,msg) => {
                    console.log("Get user's trx list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
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

            timeConversion(ms) {
                return utility.timeConversion(ms);
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
                        if (info.lastTrx) {
                            let lastInfo = {blkTime:info.lastTrx.getBlockTime().getUtcSeconds()};
                            lastInfo.tId = info.lastTrx.getTrxId().getHexHash();
                            obj.lastTrx = lastInfo;
                        }else {
                            obj.lastTrx = null;
                        }
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastInfo = null;
                }
                sessionStorage.setItem(this.usrTxCacheKey,JSON.stringify(cacheData));
            },

            getPageInfo() {
                let info = sessionStorage.getItem(this.usrTxCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                utility.removeComplexCacheKey(this.usrTxCacheKey);
                if (sessionStorage.getItem(this.usrTxCacheKey) != null) {
                    sessionStorage.removeItem(this.usrTxCacheKey);
                }
            },
            convertOpActionsToStr(actionArray) {
                if (actionArray.length) {
                    return actionArray.join(",");
                }
                return ""
            },
            loadData() {
                let name = this.$route.params.account;
                let accountName = new api.cos_sdk.raw_type.account_name();
                accountName.setValue(name);
                this.account = accountName;
                let startTime = new api.cos_sdk.raw_type.time_point_sec();
                startTime.setUtcSeconds(Math.ceil(Date.now()/1000)+2*86400);
                this.firstPageStartTime = startTime;
                let endTime = new api.cos_sdk.raw_type.time_point_sec();
                endTime.setUtcSeconds(1);
                this.firstPageEndTime = endTime;
            },
            getUsrTxCacheData() {
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
                            if (obj.lastTrx != null) {
                                let lastInfo = new api.cos_sdk.grpc.TrxInfo();
                                let time = new api.cos_sdk.raw_type.time_point_sec();
                                time.setUtcSeconds(obj.lastTrx.blkTime);
                                lastInfo.setBlockTime(time);
                                let trxId = new api.cos_sdk.raw_type.sha256();
                                trxId.setHexHash(obj.lastTrx.tId);
                                lastInfo.setTrxId(trxId);
                                info.lastTrx = lastInfo;
                            }
                            list.push(info);
                        });
                        this.pageInfo = list;
                    }
                    this.loadData();
                    if (this.currentPage === 1) {
                        this.postListStart = null;
                        this.lastInfo = null;
                    }else if (this.currentPage >= 2 && this.pageInfo.length >= this.currentPage){
                        let lastInfo = this.pageInfo [this.currentPage-2];
                        this.listStart = lastInfo.start;
                        this.lastInfo = lastInfo.lastTrx;
                    }
                }else {
                    this.loadData()
                }
            }
        },
        mounted() {
            this.getUsrTxCacheData();
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
