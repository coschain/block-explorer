<style>
    .vue-relevant-trx {
        background-color: white;
    }

    .vue-relevant-trx .tip a {
        color: rgb(76, 32, 133);
    }

    .vue-relevant-trx td,
    .vue-relevant-trx th {
        border-top-color: #ddd;
    }

    .vue-relevant-trx .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vue-relevant-trx .trxListHeader {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: #e8e8e8;
        font-size: 11px;
    }

    .vue-relevant-trx .trxListHeadCol {
        width: calc(100% / 7);
    }

    .vue-relevant-trx .active {
        font-weight: bold;
    }

    .vue-relevant-trx .txContentCol {
        display: inline-block;
        width: calc(100% / 7);
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-relevant-trx .txContentCol .wrap{
        overflow-wrap: break-word;
        white-space: normal;
    }

    .vue-relevant-trx .nav-item-text {
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
    }

    .vue-relevant-trx .nav-item-text:hover {
        cursor: pointer;
    }

    .vue-relevant-trx nav > div + div {
        border-left: 1px solid #000000;
    }

    .vue-relevant-trx nav > div:first-child {
        padding-left: 0 !important;
    }


</style>
<template>
    <div class="vue-relevant-trx fullfill">
        <vue-bread v-bind:title='"Transactions of:"'
                   v-bind:subtitle="$route.params.account"
                   v-bind:subtitlemonospaced="!!$route.params.account">
        </vue-bread>

        <div class="container mt20">
            <div class="nav-scroller">
                <nav class="nav d-flex justify-content-start">
                    <div class="px-2 nav-item-text" :class="{active: currentTab === 'trxs'}"
                         @click="currentTab ='trxs'">Sent Txs
                    </div>
                    <div class="px-2 nav-item-text" :class="{active: currentTab === 'fund'}"
                         @click="currentTab ='fund'">Fund History
                    </div>
                    <div class="px-2 nav-item-text" :class="{active: currentTab === 'eco'}" @click="currentTab ='eco'">
                        System Reward
                    </div>
                </nav>
            </div>
            <template v-if="trxList.length === 0">
                <div class="maxPageTips">
                    No Transactions
                </div>
                <div class="explorer-table-container">
                    <table class="mt20 explorer-table">
                        <tr class="trxListHeader  font-bold font-color-000000">
                            <th class="trxListHeadCol">Hash</th>
                            <th class="trxListHeadCol">Block</th>
                            <th class="trxListHeadCol">Time</th>
                            <th class="trxListHeadCol">From</th>
                            <th class="trxListHeadCol">To</th>
                            <th class="trxListHeadCol">Action</th>
                            <th class="trxListHeadCol">Amount</th>
                        </tr>
                    </table>
                </div>
            </template>
            <div v-if="trxList && trxList.length">
                <div class="maxPageTips">Display the latest {{maxUsrTxsPageNum}} pages of data, total {{ totalTxs }}
                    records
                </div>
                <div class="explorer-table-container">
                    <table class="mt20 explorer-table">
                        <tr class="trxListHeader  font-bold font-color-000000">
                            <th class="trxListHeadCol">Hash</th>
                            <th class="trxListHeadCol">Block</th>
                            <th class="trxListHeadCol">Time</th>
                            <th class="trxListHeadCol">From</th>
                            <th class="trxListHeadCol">To</th>
                            <th class="trxListHeadCol">Action</th>
                            <th class="trxListHeadCol">Amount</th>
                        </tr>

                        <tr v-for="(trx, i) in trxList" :key="i">
                            <td class="txContentCol">
                                <template v-if="isTransactionHash(trx.trx_hash)">
                                    <router-link v-bind:to='fragApi + "/tx/" + trx.trx_hash' target="_blank">
                                        <span class="monospace">{{ trx.trx_hash }}</span>
                                    </router-link>
                                </template>
                                <template v-if="!isTransactionHash(trx.trx_hash)">
                                    <span class="monospace">{{ trx.trx_hash }}</span>
                                </template>
                            </td>

                            <td class="txContentCol">
                                <router-link class="font-14" v-bind:to='fragApi + "/block/" + trx.block_height'
                                             target="_blank">
                                    <span>{{ trx.block_height }}</span>
                                </router-link>
                                <!--<i class="font-14 font-color-000000" v-else>pending</i>-->
                            </td>
                            <td class="txContentCol">
                                {{ timeConversion(Date.now()-Date.parse(trx.block_time)) }} ago
                            </td>
                            <td class="txContentCol">
                                <template v-if="isUserName(trx.from)">
                                    <router-link v-bind:to='fragApi + "/account/" + trx.from' target="_blank">
                                        <span class="monospace" :class="{active: itself(trx.from)}">{{ trx.from }}</span>
                                    </router-link>
                                </template>
                                <template v-if="!isUserName(trx.from)">
                                    <span class="monospace" :class="{active: itself(trx.from)}">{{ trx.from }}</span>
                                </template>
                            </td>
                            <td class="txContentCol">
                                <template v-if="isUserName(trx.to)">
                                    <router-link v-bind:to='fragApi + "/account/" + trx.to' target="_blank">
                                        <span class="monospace" :class="{active: itself(trx.to)}">{{ trx.to }}</span>
                                    </router-link>
                                </template>
                                <template v-if="!isUserName(trx.to)">
                                    <span class="monospace" :class="{active: itself(trx.to)}">{{ trx.to }}</span>
                                </template>
                            </td>
                            <td class="txContentCol">
                                <span class="wrap">
                                {{ rename_action(trx.action) }}
                                </span>
                            </td>
                            <td class="txContentCol">
                                {{ trx.amount / 1000000 }} COS
                            </td>
                        </tr>
                    </table>
                </div>

                <div v-if="isShowLoadMore" class="loadMore-container">
                    <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageUsrTxs()">Load More</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    // let api = require("@/assets/api");
    let elkApi = require("../assets/elkapi");
    let utility = require("../assets/utility");
    let BigNumber = require("bignumber.js");

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
                currentTab: 'trxs',
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                totalPage: 1,
                totalTxs: 0,
                listStart: null,
                listEnd: null,
                lastInfo: null,
                trxList: [],
                pageInfo: [],
                account: null,
                firstPageStartTime: null,
                firstPageEndTime: null,
                isFetching: false,
                maxUsrTxsPageNum: 50,
                isShowLoadMore: true,
            };
        },
        methods: {
            async nthPage(p) {
                // if (p < this.currentPage || p > this.maxUsrTxsPageNum) {
                //     return;
                // }
                // this.$root.showModalLoading = true;
                // let start = this.listStart;
                // let lastTrx = this.lastInfo;
                //
                // api.fetchUserTrxListByTime(this.account,start,this.firstPageEndTime,30,lastTrx,trxList => {
                //     if (trxList.length > 0) {
                //         this.trxList = this.trxList.concat(trxList);
                //         this.lastInfo = trxList[trxList.length - 1];
                //         this.listStart = this.lastInfo.getBlockTime();
                //         if (this.currentPage === 0) {
                //             this.listEnd = null;
                //         } else {
                //             this.listEnd = trxList[0].getBlockTime();
                //         }
                //         let curPageLen = this.pageInfo.length;
                //         let info = {start: this.listStart, lastTrx: this.lastInfo};
                //         if (curPageLen === 0) {
                //             info.end = this.firstPageEnd;
                //         } else {
                //             if (curPageLen >= 1) {
                //                 info.end = this.pageInfo[curPageLen - 1].start;
                //             }
                //         }
                //         this.pageInfo.push(info);
                //         this.currentPage = parseInt(p);
                //
                //     }
                //     this.isShowLoadMore = this.currentPage < this.maxUsrTxsPageNum;
                //     this.$root.showModalLoading = false;
                //     this.isFetching = false;
                // },(errCode,msg) => {
                //     console.log("Get user's trx list fail,error code is %s,msg is %s",errCode,msg);
                //     this.isFetching = false;
                //     this.$root.showModalLoading = false;
                //     this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                // });
                let page = parseInt(p);
                let trxs = await this.loadData(page);
                if (trxs.length > 0) {
                    this.currentPage = page;
                    this.trxList = this.trxList.concat(trxs);
                }
                if (trxs.length < this.maxUsrTxsPageNum) {
                    this.isShowLoadMore = false
                }
            },

            updateTxsListPage(index, info) {
                if (info && index >= 0 && index < this.pageInfo.length) {
                    this.pageInfo.splice(index, 1, info);
                }
            },
            isUserName(name) {
                return name.length >= 6 && name.length <= 16 && name.match(/^[0-9a-z]+$/)
            },
            isTransactionHash(trx_hash) {
                return !trx_hash.includes('_');
            },
            itself(name) {
                return name === this.$route.params.account;
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
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
            async loadData(page) {
                this.$root.showModalLoading = true;
                let name = this.$route.params.account;
                let trxs = [];
                switch (this.currentTab) {
                    case "trxs":
                        trxs = await elkApi.fetchAccountSendTrxsByPage(name, page, this.maxUsrTxsPageNum);
                        break;
                    case "fund":
                        trxs = await elkApi.fetchAccountFundHistoryByPage(name, page, this.maxUsrTxsPageNum);
                        break;
                    case "eco":
                        trxs = await elkApi.fetchAccountEcoRewardByPage(name, page, this.maxUsrTxsPageNum);
                        break;
                }
                this.$root.showModalLoading = false;
                this.isFetching = false;
                return trxs;
            },
            async totalTxsCount() {
                let count = 0;
                let name = this.$route.params.account;
                switch (this.currentTab) {
                    case "trxs":
                        count = await elkApi.fetchAccountSendTrxCount(name);
                        break;
                    case "fund":
                        count = await elkApi.fetchAccountFundHistoryCount(name);
                        break;
                    case "eco":
                        count = await elkApi.fetchAccountEcoRewardCount(name);
                        break;
                }
                return count
            },
            getTrxStatus(trx) {
                return utility.getTrxStatusByTrxInfo(trx);
            },

            async onClickLoadNextPageUsrTxs() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                await this.nthPage(this.currentPage + 1);
            },

            rename_action(action) {
                switch (action) {
                    case "user_transfer_to_contract":
                        return "transfer_to_contract";
                    case "contract_transfer_to_user":
                        return "transfer_from_contract";
                    case "contract_transfer_vest_to_user":
                        return "vest_from_contract";
                    case "esys.reward.post_author":
                        return "reward.post_author";
                    case "esys.reward.reply_author":
                        return "reward.reply_author";
                    case "esys.reward.voter":
                        return "reward.voter";
                    case "esys.reward.dapp":
                        return "reward.dapp";
                    default:
                        return action;
                }
            }
        },
        async mounted() {
            this.totalTxs = await this.totalTxsCount();
            await this.nthPage(0);
        },
        watch: {
            $route: async function () {
                this.totalTxs = await this.totalTxsCount();
                await this.nthPage(0);
            },
            currentTab: async function () {
                this.trxList = [];
                this.isShowLoadMore = true;
                this.totalTxs = await this.totalTxsCount();
                await this.nthPage(0);
            }
        },

    };
</script>
