<style>
    .vue-follower {
        background-color: white;
    }

    .vue-follower .info-and-pagination .info a {
        color: inherit;
    }

    .vue-follower .contentCol {
        display:inline-block;
        width: calc(100% / 3);;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-follower td,
    .vue-follower th {
        border-top-color: #ddd;
    }

    .vue-follower .hash {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        white-space: nowrap;
    }

    .vue-follower .hash>* {
        display: inline;
    }

    .vue-follower .block {
        margin-right: 8px;
    }

    .vue-follower .header {
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

    .vue-follower .headCol {
        width: calc(100% / 3);
    }

    .vue-follower .content {
        width: 10%;
    }

    @media (max-width: 767.98px) {
        .vue-follower .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <div class="vue-follower fullfill">
        <vue-bread v-bind:title='"Follower List of:"'
                   v-bind:subtitle="$route.params.account"
                   v-bind:subtitlemonospaced="!!$route.params.account">
        </vue-bread>
        <div v-if="followerList.length" class="container mt20">
            <div class="maxPageTips">Display the latest {{maxFollowPageNum}} pages of data</div>
            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table">
                    <tr class=" header font-bold font-color-000000">
                        <th class="headCol">Account</th>
                        <th class="headCol">Balance</th>
                        <th class="headCol">Vest</th>
                    </tr>

                    <tr v-for="(followInfo, i) in followerList" :key="i">
                        <td  class="font-color-000000 contentCol">
                            <router-link v-bind:to='fragApi + "/account/" + getFollowerAccountName(followInfo)' target="_blank">
                                <span class="monospace">{{getFollowerAccountName(followInfo)}}</span>
                            </router-link>
                        </td>
                        <td class="font-color-000000 contentCol">{{getFollowerBalance(followInfo)}}</td>
                        <td class="font-color-000000 contentCol ">{{getFollowerVest(followInfo)}} </td>
                    </tr>
                </table>
            </div>
            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageFollowData()">Load More</button>
            </div>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");

    // const this.followerCacheKey = utility.getPageCacheKey(utility.pageCacheType.usrArticleList);
    const followPageSize = 30;
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                totalPage: 1,
                totalCts: 0,
                followerList: [],
                followerPageInfo:[],
                followerListStart: null,
                followerListEnd: null,
                lastOrder: null,
                firstPageStart: null,
                firstPageEnd: null,
                createdPageIndex:0,
                isFetching: false,
                maxFollowPageNum: 50,
                isShowLoadMore: true,
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
            nthPage(p) {
                if (p < this.currentPage || p > this.maxFollowingPageNum) {
                    return;
                }
                this.$root.showModalLoading = true;
                let start = this.followerListStart;
                let end = this.followerListEnd;
                let lastOrder = this.lastOrder;

                api.fetchFollowerListByName(start,this.firstPageEnd,followPageSize,lastOrder,followerList => {
                    if (followerList.length) {
                        this.followerList = this.followerList.concat(followerList);
                        this.lastOrder = followerList[followerList.length-1].getCreateOrder();
                        this.followerListEnd = this.lastOrder;
                        this.followerListStart =  this.lastOrder;
                        let curPageLen = this.followerPageInfo.length;
                        let info = {end:this.followerListEnd,createOrder:this.lastOrder};
                        if (curPageLen === 0) {
                            info.start = this.firstPageStart;
                        }else {
                            if (curPageLen.length >= 1) {
                                info.start = this.followerPageInfo[curPageLen-1].end;
                            }
                        }
                        this.followerPageInfo.push(info);
                        this.currentPage = parseInt(p);
                    }
                    this.$root.showModalLoading = false;
                    this.isShowLoadMore = this.currentPage < this.maxFollowPageNum;
                    this.isFetching = false;
                },(errCode,msg) => {
                    console.log("Get user's follower list fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
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
                BigNumber.config({ DECIMAL_PLACES: 18 });
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount();
            },
            fetchArticleTag(tagsArray) {
                let tag = "";
                if (tagsArray.length > 0) {
                    tag = tagsArray.join(",");
                }

                return tag;
            },


            storeOrderInfo(originOrder) {
                let info = {};
                info.account = originOrder?originOrder.getAccount().getValue():null;
                info.follower = originOrder?originOrder.getFollower().getValue():null;
                info.createTime = originOrder?originOrder.getCreatedTime().getUtcSeconds():null;
                return info;
            },

            loadData() {
                let name = this.$route.params.account;
                let accountName = new api.cos_sdk.raw_type.account_name();
                accountName.setValue(name);
                let startTime = new api.cos_sdk.raw_type.time_point_sec();
                startTime.setUtcSeconds(1);
                let startFollowAcct = new api.cos_sdk.raw_type.account_name();
                startFollowAcct.setValue("1");
                let start = new api.cos_sdk.multi_id.follower_created_order();
                start.setAccount(accountName);
                start.setCreatedTime(startTime);
                start.setFollower(startFollowAcct);

                let endTime = new api.cos_sdk.raw_type.time_point_sec();
                endTime.setUtcSeconds(Math.ceil(Date.now()/1000)+86400);
                let endFollowAcct = new api.cos_sdk.raw_type.account_name();
                endFollowAcct.setValue("the max account value");
                let end = new api.cos_sdk.multi_id.follower_created_order();
                end.setAccount(accountName);
                end.setCreatedTime(endTime);
                end.setFollower(endFollowAcct);
                this.followerListStart = start;
                this.followerListEnd = end;
                this.firstPageStart = start;
                this.firstPageEnd = end;
            },

            getFollowerAccountName(followInfo) {
                if(followInfo != null && typeof followInfo != "undefined") {
                    if(followInfo.hasAccount() && followInfo.getAccount().getInfo().hasAccountName()) {
                        return followInfo.getAccount().getInfo().getAccountName().getValue();
                    }
                }
                return ""
            },

            getFollowerBalance(followInfo) {
                if(followInfo != null && typeof followInfo != "undefined") {
                    if(followInfo.hasAccount() && followInfo.getAccount().getInfo().hasCoin()) {
                        return followInfo.getAccount().getInfo().getCoin().toString();
                    }
                }
                return ""
            },

            getFollowerVest(followInfo) {
                if(followInfo != null && typeof followInfo != "undefined") {
                    if(followInfo.hasAccount() && followInfo.getAccount().getInfo().hasVest()) {
                        return followInfo.getAccount().getInfo().getVest().toString();
                    }
                }
                return ""
            },

            onClickLoadNextPageFollowData() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.currentPage + 1);
            }

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
