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
        <div v-if="followerList" class="container mt20">

            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table">
                    <tr class=" header font-bold font-color-000000">
                        <th class="headCol">Account</th>
                        <th class="headCol">Balance</th>
                        <th class="headCol">Vest</th>
                    </tr>

                    <tr v-for="(followInfo, i) in followerList" :key="i">
                        <td  class="font-color-000000 contentCol">
                            <router-link v-bind:to='fragApi + "/account/" + getFollowerAccountName(followInfo)'>
                                <span class="monospace">{{getFollowerAccountName(followInfo)}}</span>
                            </router-link>
                        </td>
                        <td class="font-color-000000 contentCol">{{getFollowerBalance(followInfo)}}</td>
                        <td class="font-color-000000 contentCol ">{{getFollowerVest(followInfo)}} </td>
                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                            v-on:prev=onPrev v-on:firstPage=onGoFirstPage></vue-pagination>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");

    // const this.followerCacheKey = utility.getPageCacheKey(utility.pageCacheType.usrArticleList);

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
                followerList: null,
                followerPageInfo:[],
                followerListStart: null,
                followerListEnd: null,
                lastOrder: null,
                firstPageStart: null,
                firstPageEnd: null,
                followerCacheKey: this.$route.params.account + this.$route.params.t
            };
        },
        methods: {
            nav(n) {
                if (n < this.totalPage) {
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
                let start = this.followerListStart;
                let end = this.followerListEnd;
                let isNextPage = true;
                let lastOrder = this.lastOrder;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage == 2 ) {
                        start = this.firstPageStart;
                        end = this.firstPageEnd;
                        lastOrder= null;
                    }else {
                        let infoLen = this.followerPageInfo.length;
                        if (infoLen >= 2 && infoLen >= this.currentPage ) {
                            let info = this.followerPageInfo[this.currentPage-2];
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
                api.fetchFollowerListByName(start,this.firstPageEnd,30,lastOrder,followerList => {
                    if (followerList.length) {
                        this.followerList = followerList;
                        this.lastOrder = followerList[followerList.length-1].getCreateOrder();
                        this.followerListEnd = this.lastOrder;
                        this.followerListStart =  this.lastOrder;
                        let curPageLen = this.followerPageInfo.length;
                        let info = {end:this.followerListEnd,createOrder:this.lastOrder};
                        if (curPageLen == 0 || (this.currentPage == 1 && pReqType == 3)) {
                            info.start = this.firstPageStart;
                        }else if(this.currentPage <= curPageLen) {
                            info.start = this.followerPageInfo[this.currentPage-1].end;
                        }
                        if (pReqType == 1) {
                            if (this.currentPage + 1 == this.totalPage) {
                                this.totalPage += 1;
                                this.followerPageInfo.push(info);
                            }else {
                                this.updateFollowerPageInfo(this.currentPage,info);
                            }
                            this.currentPage += 1;
                        }else if (pReqType == 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 1 && this.currentPage <= curPageLen) {
                                info.start = this.followerPageInfo[this.currentPage-1].end;
                            }
                            this.updateFollowerPageInfo(this.currentPage,info);
                        }else if (pReqType == 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.$root.showModalLoading = false;
                    this.savePageInfo();
                },(errCode,msg) => {
                    console.log("Get user's follower list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
            },

            updateFollowerPageInfo(index,info) {
                if (info && index >= 0 && index < this.followerPageInfo.length) {
                    this.followerPageInfo.splice(index,1,info);
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
                let listLen = this.followerPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    let self = this;
                    this.followerPageInfo.forEach(function (info) {
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
                sessionStorage.setItem(this.followerCacheKey,JSON.stringify(cacheData));
                utility.addComplexCacheKey(this.followerCacheKey);
            },

            storeOrderInfo(originOrder) {
                let info = {};
                info.account = originOrder?originOrder.getAccount().getValue():null;
                info.follower = originOrder?originOrder.getFollower().getValue():null;
                info.createTime = originOrder?originOrder.getCreatedTime().getUtcSeconds():null;
                return info;
            },

            getPageInfo() {
                let info = sessionStorage.getItem(this.followerCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                utility.removeComplexCacheKey(this.followerCacheKey);
                if (sessionStorage.getItem(this.followerCacheKey) != null) {
                    sessionStorage.removeItem(this.followerCacheKey);
                }
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
            getCacheData() {
                let cacheData = this.getPageInfo();
                if (cacheData) {
                    this.currentPage = parseInt(cacheData.currentPage);
                    this.totalPage = parseInt(cacheData.totalPage);
                    if (cacheData.pageInfo) {
                        let list = [];
                        for (let data of cacheData.pageInfo) {
                            let info = {};
                            info.start = this.getFollowerCreateOrderObjFromCache(data.start);
                            info.end = this.getFollowerCreateOrderObjFromCache(data.end);
                            info.createOrder = this.getFollowerCreateOrderObjFromCache(data.createOrder);
                            list.push(info);
                        }
                        this.followerPageInfo = list;
                    }
                    this.loadData();
                    if (this.currentPage == 1) {
                        this.lastOrder = null;
                    }else if (this.currentPage >= 2 && this.followerPageInfo.length >= this.currentPage){
                        let lastInfo = this.followerPageInfo[this.currentPage-1];
                        this.followerListStart = lastInfo.start;
                        this.followerListEnd = lastInfo.end;
                        this.lastOrder = lastInfo.start;
                    }
                }else {
                    this.loadData()
                }
            },
            getFollowerCreateOrderObjFromCache(data) {
                if  (data) {
                    let obj = new api.cos_sdk.multi_id.follower_created_order();
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
                    if(data.follower) {
                        let follower = new api.cos_sdk.raw_type.account_name();
                        follower.setValue(data.follower);
                        obj.setFollower(follower);
                    }
                    return obj
                }
                return null;
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
            }
            
            

        },

        mounted() {
            this.getCacheData();
            this.nthPage();
        },
        watch: {
            $route() {
                this.nthPage();
            }
        },
        destroyed() {
            if (this.currentPage <= 1) {
                this.clearCachePageInfo();
            }
        }
    };
</script>
