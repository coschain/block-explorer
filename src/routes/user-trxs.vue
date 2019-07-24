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
        width: calc(100% / 6);
    }

    .vue-user-trx .txContentCol {
        display:inline-block;
        width: calc(100% / 6);
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
        </vue-bread>
        <div v-if="trxList && trxList.length" class="container mt20">
            <div class="container maxPageTips">Display the latest {{maxUsrTxsPageNum}} pages of data</div>
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

                        <td class="txContentCol">{{getTrxStatus(trx)}}</td>
                    </tr>
                </table>
            </div>

            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageUsrTxs()">Load More</button>
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
                maxDisplayCnt: 0,
                totalPage: 1,
                totalTxs: 0,
                listStart:null,
                listEnd:null,
                lastInfo:null,
                trxList: [],
                pageInfo:[],
                account: null,
                firstPageStartTime: null,
                firstPageEndTime: null,
                isFetching: false,
                maxUsrTxsPageNum: 50,
                isShowLoadMore: true,
            };
        },
        methods: {
            nthPage(p) {
                if (p < this.currentPage || p > this.maxUsrTxsPageNum) {
                    return;
                }
                this.$root.showModalLoading = true;
                let start = this.listStart;
                let lastTrx = this.lastInfo;

                api.fetchUserTrxListByTime(this.account,start,this.firstPageEndTime,30,lastTrx,trxList => {
                    if (trxList.length > 0) {
                        this.trxList = this.trxList.concat(trxList);
                        this.lastInfo = trxList[trxList.length - 1];
                        this.listStart = this.lastInfo.getBlockTime();
                        if (this.currentPage === 0) {
                            this.listEnd = null;
                        } else {
                            this.listEnd = trxList[0].getBlockTime();
                        }
                        let curPageLen = this.pageInfo.length;
                        let info = {start: this.listStart, lastTrx: this.lastInfo};
                        if (curPageLen === 0) {
                            info.end = this.firstPageEnd;
                        } else {
                            if (curPageLen >= 1) {
                                info.end = this.pageInfo[curPageLen - 1].start;
                            }
                        }
                        this.pageInfo.push(info);
                        this.currentPage = parseInt(p);

                    }
                    this.isShowLoadMore = this.currentPage < this.maxUsrTxsPageNum;
                    this.$root.showModalLoading = false;
                    this.isFetching = false;
                },(errCode,msg) => {
                    console.log("Get user's trx list fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
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

            getTrxStatus(trx) {
                return utility.getTrxStatusByTrxInfo(trx);
            },

            onClickLoadNextPageUsrTxs() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.currentPage + 1);
            },
        },
        mounted() {
            this.loadData();
            this.nthPage(1);
        },

        watch: {
            $route() {
                this.nthPage(1);
            }
        },

    };
</script>
