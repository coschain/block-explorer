<style>
    .vue-following {
        background-color: white;
    }

    .vue-following .info-and-pagination .info a {
        color: inherit;
    }

    .vue-following .contentCol {
        display:inline-block;
        width: calc(100% / 3);;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-following td,
    .vue-following th {
        border-top-color: #ddd;
    }

    .vue-following .hash {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        white-space: nowrap;
    }

    .vue-following .hash>* {
        display: inline;
    }

    .vue-following .block {
        margin-right: 8px;
    }

    .vue-following .header {
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

    .vue-following .headCol {
        width: calc(100% / 3);
    }

    .vue-following .content {
        width: 10%;
    }

    @media (max-width: 767.98px) {
        .vue-following .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <div class="vue-following fullfill">
        <vue-bread v-bind:title='"Following List of:"'
                   v-bind:subtitle="$route.params.account"
                   v-bind:subtitlemonospaced="!!$route.params.account">
        </vue-bread>
        <div v-if="followingList.length" class="container mt20">
            <div class="maxPageTips">Display the latest {{maxFollowingPageNum}} pages of data</div>
            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table">
                    <tr class=" header font-bold font-color-000000">
                        <th class="headCol">Account</th>
                        <th class="headCol">Balance</th>
                        <th class="headCol">Vest</th>
                    </tr>

                    <tr v-for="(followingInfo, i) in followingList" :key="i">
                        <td  class="font-color-000000 contentCol">
                            <router-link v-bind:to='fragApi + "/account/" + getFollowingAccountName(followingInfo)' target="_blank">
                                <span class="monospace">{{getFollowingAccountName(followingInfo)}}</span>
                            </router-link>
                        <td class="font-color-000000 contentCol">{{getFollowingBalance(followingInfo)}}</td>
                        <td class="font-color-000000 contentCol ">{{getFollowingVest(followingInfo)}} </td>
                    </tr>
                </table>
            </div>
            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageFollowingData()">Load More</button>
            </div>
        </div>
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");

    const followingPageSize = 30;
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
                followingList: [],
                followingPageInfo:[],
                followingListStart: null,
                followingListEnd: null,
                lastOrder: null,
                firstPageStart: null,
                firstPageEnd: null,
                isFetching: false,
                maxFollowingPageNum: 50,
                isShowLoadMore: true,
            };
        },
        methods: {
            nthPage(p) {
                if (p < this.currentPage || p > this.maxFollowingPageNum) {
                    return;
                }
                this.$root.showModalLoading = true;
                let start = this.followingListStart;
                let end = this.followingListEnd;
                let lastOrder = this.lastOrder;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page

                api.fetchFollowingListByName(start,this.firstPageEnd,followingPageSize,lastOrder,followingList => {
                    if (followingList.length) {
                        this.followingList = this.followingList.concat(followingList);
                        this.lastOrder = followingList[followingList.length - 1].getCreateOrder();
                        this.followingListEnd = this.lastOrder;
                        this.followingListStart = this.lastOrder;
                        let curPageLen = this.followingPageInfo.length;
                        let info = {end: this.followingListEnd, createOrder: this.lastOrder};
                        if (curPageLen === 0) {
                            info.start = this.firstPageStart;
                        } else {
                            if (curPageLen >= 1) {
                                info.start = this.followingPageInfo[curPageLen - 1].end;
                            }
                        }
                        this.currentPage = parseInt(p);
                        this.followingPageInfo.push(info);
                    }
                    this.$root.showModalLoading = false;
                    this.isShowLoadMore = this.currentPage < this.maxFollowingPageNum;
                    this.isFetching = false;
                },(errCode,msg) => {
                    console.log("Get user's following list fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
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
                info.following = originOrder?originOrder.getFollowing().getValue():null;
                info.createTime = originOrder?originOrder.getCreatedTime().getUtcSeconds():null;
                return info;
            },

            loadData() {
                let name = this.$route.params.account;
                let accountName = new api.cos_sdk.raw_type.account_name();
                accountName.setValue(name);
                let startTime = new api.cos_sdk.raw_type.time_point_sec();
                startTime.setUtcSeconds(1);
                let startFollowingAcct = new api.cos_sdk.raw_type.account_name();
                startFollowingAcct.setValue("1");
                let start = new api.cos_sdk.multi_id.following_created_order();
                start.setAccount(accountName);
                start.setCreatedTime(startTime);
                start.setFollowing(startFollowingAcct);

                let endTime = new api.cos_sdk.raw_type.time_point_sec();
                endTime.setUtcSeconds(Math.ceil(Date.now()/1000)+86400);
                let endFollowingAcct = new api.cos_sdk.raw_type.account_name();
                endFollowingAcct.setValue("the max account value");
                let end = new api.cos_sdk.multi_id.following_created_order();
                end.setAccount(accountName);
                end.setCreatedTime(endTime);
                end.setFollowing(endFollowingAcct);
                this.followingListStart = start;
                this.followingListEnd = end;
                this.firstPageStart = start;
                this.firstPageEnd = end;
            },

            getFollowingAccountName(followingInfo) {
                if(followingInfo != null && typeof followingInfo != "undefined") {
                    if(followingInfo.hasAccount() && followingInfo.getAccount().getInfo().hasAccountName()) {
                        return followingInfo.getAccount().getInfo().getAccountName().getValue();
                    }
                }
                return ""
            },

            getFollowingBalance(followingInfo) {
                if(followingInfo != null && typeof followingInfo != "undefined") {
                    if(followingInfo.hasAccount() && followingInfo.getAccount().getInfo().hasCoin()) {
                        return followingInfo.getAccount().getInfo().getCoin().toString();
                    }
                }
                return ""
            },

            getFollowingVest(followingInfo) {
                if(followingInfo != null && typeof followingInfo != "undefined") {
                    if(followingInfo.hasAccount() && followingInfo.getAccount().getInfo().hasVest()) {
                        return followingInfo.getAccount().getInfo().getVest().toString();
                    }
                }
                return ""
            },

            onClickLoadNextPageFollowingData() {
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
