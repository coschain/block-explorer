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
        <div v-if="followingList" class="container mt20">

            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table">
                    <tr class=" header font-bold font-color-000000">
                        <th class="headCol">Account</th>
                        <th class="headCol">Balance</th>
                        <th class="headCol">Vest</th>
                    </tr>

                    <tr v-for="(followingInfo, i) in followingList" :key="i">
                        <td  class="font-color-000000 contentCol">
                            <router-link v-bind:to='fragApi + "/account/" + getFollowingAccountName(followingInfo)'>
                                <span class="monospace">{{getFollowingAccountName(followingInfo)}}</span>
                            </router-link>
                        </td>
                        <td class="font-color-000000 contentCol">{{getFollowingBalance(followingInfo)}}</td>
                        <td class="font-color-000000 contentCol ">{{getFollowingVest(followingInfo)}} </td>
                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                            v-on:prev=onPrev v-on:firstPage=onGoFirstPage></vue-pagination>
        </div>
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                totalPage: 1,
                totalCts: 0,
                followingList: null,
                followingPageInfo:[],
                followingListStart: null,
                followingListEnd: null,
                lastOrder: null,
                firstPageStart: null,
                firstPageEnd: null,
                followingCacheKey:this.$route.params.account + this.$route.params.t,
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
                let start = this.followingListStart;
                let end = this.followingListEnd;
                let isNextPage = true;
                let lastOrder = this.lastOrder;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage == 2 ) {
                        start = this.firstPageStart;
                        end = this.firstPageEnd;
                        lastOrder= null;
                    }else {
                        let infoLen = this.followingPageInfo.length;
                        if (infoLen >= 2 && infoLen >= this.currentPage ) {
                            let info = this.followingPageInfo[this.currentPage-2];
                            start = info.start;
                            lastOrder = info.start;
                            end = info.end;
                        }
                    }
                    pReqType = 0;
                    isNextPage = false;
                }else if (this.currentPage == p) {
                    //refresh current page
                    pReqType = 3;
                }
                api.fetchFollowingListByName(start,this.firstPageEnd,30,lastOrder,followingList => {
                    if (followingList.length) {
                        this.followingList = followingList;
                        this.lastOrder = followingList[followingList.length-1].getCreateOrder();
                        this.followingListEnd = this.lastOrder;
                        this.followingListStart =  this.lastOrder;
                        let curPageLen = this.followingPageInfo.length;
                        let info = {end:this.followingListEnd,createOrder:this.lastOrder};
                        if (curPageLen == 0 || (this.currentPage == 1 && pReqType == 3)) {
                            info.start = this.firstPageStart;
                        }else if(this.currentPage <= curPageLen) {
                            info.start = this.followingPageInfo[this.currentPage-1].end;
                        }
                        if (pReqType == 1) {
                            if (this.currentPage + 1 == this.totalPage) {
                                this.totalPage += 1;
                                this.followingPageInfo.push(info);
                            }else {
                                this.updateFollowingPageInfo(this.currentPage,info);
                            }
                            this.currentPage += 1;
                            if (this.createdPageIndex < this.totalPage) {
                                this.createdPageIndex += 1;
                            }
                        }else if (pReqType == 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 1 && this.currentPage <= curPageLen) {
                                info.start = this.followingPageInfo[this.currentPage-1].end;
                            }
                            this.updateFollowingPageInfo(this.currentPage,info);
                        }else if (pReqType == 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.$root.showModalLoading = false;
                    this.savePageInfo();
                },(errCode,msg) => {
                    console.log("Get user's following list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
            },

            updateFollowingPageInfo(index,info) {
                if (info && index >= 0 && index < this.followingPageInfo.length) {
                    this.followingPageInfo.splice(index,1,info);
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
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                cacheData.createdPageIndex =  this.createdPageIndex;
                let listLen = this.followingPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    let self = this;
                    this.followingPageInfo.forEach(function (info) {
                        let start = self.storeOrderInfo(info.start);
                        let end = self.storeOrderInfo(info.end);
                        let lastOrder = self.storeOrderInfo(info.lastOrder);
                        let obj = {};
                        obj.start = start;
                        obj.end = end;
                        obj.lastOrder = lastOrder;
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                }
                sessionStorage.setItem(this.followingCacheKey,JSON.stringify(cacheData));
                utility.addComplexCacheKey(this.followingCacheKey);
            },

            storeOrderInfo(originOrder) {
                let info = {};
                info.account = originOrder?originOrder.getAccount().getValue():null;
                info.following = originOrder?originOrder.getFollowing().getValue():null;
                info.createTime = originOrder?originOrder.getCreatedTime().getUtcSeconds():null;
                return info;
            },

            getPageInfo() {
                let info = sessionStorage.getItem(this.followingCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                utility.removeComplexCacheKey(this.followingCacheKey);
                if (sessionStorage.getItem(this.followingCacheKey) != null) {
                    sessionStorage.removeItem(this.followingCacheKey);
                }
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
            getCacheData() {
                let cacheData = this.getPageInfo();
                let isQueryData = true;
                if (cacheData) {
                    this.currentPage = parseInt(cacheData.currentPage);
                    this.totalPage = parseInt(cacheData.totalPage);
                    cacheData.createdPageIndex =  parseInt(this.createdPageIndex);
                    if (cacheData.pageInfo) {
                        let list = [];
                        for (let data of cacheData.pageInfo) {
                            let info = {};
                            info.start = this.getFollowingCreateOrderObjFromCache(data.start);
                            info.end = this.getFollowingCreateOrderObjFromCache(data.end);
                            info.createOrder = this.getFollowingCreateOrderObjFromCache(data.createOrder);
                            list.push(info);
                        }
                        this.followingPageInfo = list;
                    }
                    this.loadData();
                    if (this.currentPage == 1) {
                        this.lastOrder = null;
                    }else if (this.currentPage >= 2 && this.followingPageInfo.length >= this.currentPage){
                        let lastInfo = this.followingPageInfo[this.currentPage-1];
                        this.followingListStart = lastInfo.start;
                        this.followingListEnd = lastInfo.end;
                        this.lastOrder = lastInfo.start;
                    }
                }else {
                    this.loadData();
                    let p = this.$route.query.p;
                    //now the chain not support page skip request,so in this condition just request from page 1
                    if (p > 1) {
                        let query = JSON.parse(window.JSON.stringify(this.$route.query));
                        query.p = 1;
                        this.currentPage = 0;
                        this.totalPage = 1;
                        this.$router.replace({ path: this.$route.path, query });
                        isQueryData = false;
                    }
                }
                return isQueryData;
            },
            getFollowingCreateOrderObjFromCache(data) {
                if  (data) {
                    let obj = new api.cos_sdk.multi_id.following_created_order();
                    if (data.createTime) {
                        let createTime = new api.cos_sdk.raw_type.time_point_sec();
                        createTime.setUtcSeconds(data.createTime);
                        obj.setCreatedTime(createTime);
                    }
                    if (data.account) {
                        let accountName = new api.cos_sdk.raw_type.account_name();
                        accountName.setValue(data.account);
                        obj.setAccount(accountName);
                    }
                    if(data.following) {
                        let following = new api.cos_sdk.raw_type.account_name();
                        following.setValue(data.following);
                        obj.setFollowing(following);
                    }
                    return obj
                }
                return null;
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

        },

        mounted() {
            let isQuery = this.getCacheData();
            if (isQuery) {
                this.nthPage();
            }
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
