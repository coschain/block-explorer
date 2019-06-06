<style>
    .vue-accounts {
        background-color: white;
    }

    .vue-accounts .block {
        margin-right: 8px;
    }

    .vue-accounts .accountListHeader {
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: rgba(247, 247, 247, 1);
        font-size: 11px ;
    }

    .vue-accounts .headRank {
        width: 12%;
    }

    .vue-accounts .headAccount {
        width: 22%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .vue-accounts .headOther {
        width: 22%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .vue-accounts .headBalanceAndTime {
        width: 22%;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }

    .vue-accounts .headBalanceAndTime:hover {
        background-color: #e8e8e8;
    }

    .vue-accounts .headBalanceAndTime:focus-within {
        background-color: #e8e8e8;
    }


    .vue-accounts .headSelectStatus {
        background-color: #e8e8e8;
    }

    .vue-accounts .accountListCol {
        display:inline-block;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-accounts .rankContentCol {
        width: 12%;
    }

    .vue-accounts .contentFont {
        font-size: 14px;
    }

    .vue-accounts .accountAndTimeContentCol {
        width: 22%;
    }

    .vue-accounts .coinAndVestContentCol {
        width: 22%;
    }

    @media (min-width: 576px) {
        .vue-accounts .tdxxxwddd>* {
            max-width: initial;
        }
    }

    @media (max-width: 767.98px) {
        .vue-accounts .title {
            font-size: 20px;
        }
    }

    @media (max-width: 575.98px) {
        .vue-accounts .contentFont {
            font-size: 12px;
        }

        .vue-accounts .accountListHeader {
            font-size: 10px;
        }
    }

</style>
<template>
    <!-- https://etherscan.io/accounts  -->
    <div class="vue-accounts fullfill">
        <vue-bread :title='getListTitle()'></vue-bread>
        <div v-if="accountList && accountList.length" class="mt20 container">
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="accountListHeader font-bold font-color-000000">
                        <th class="headRank">Rank</th>
                        <th class="headAccount">Account</th>
                        <th :class='[sortType === 1?"headBalanceAndTime headSelectStatus":"headBalanceAndTime"]' @click="changeListSortType(1)">
                            <div> Balance</div>
                            <div :class='[sortType === 1?"arrow-down selected-arrow-down":"arrow-down"]'></div>
                        </th>
                        <th class="headOther">Vest</th>
                        <th :class='[sortType === 2?"headBalanceAndTime headSelectStatus":"headBalanceAndTime"]' @click="changeListSortType(2)">
                            <div>Time</div>
                            <div :class='[sortType === 2?"arrow-down selected-arrow-down":"arrow-down"]' @click="changeListSortType(2)"></div>
                        </th>
                    </tr>
                    <tr v-for="(account, i) in accountList" :key="i" class="contentFont">
                        <td class="accountListCol rankContentCol">{{(currentPage-1)*accountList.length+i+1}}</td>
                        <td class="accountListCol accountAndTimeContentCol">
                            <!--<vue-blockies v-bind:address='account.getAccountName().getValue()'></vue-blockies>-->
                            <router-link v-bind:to='fragApi + "/account/" + account.getInfo().getAccountName().getValue()'>
                                <span class="monospace">{{account.getInfo().getAccountName().getValue()}}</span>
                            </router-link>
                            <!--<span v-show=o.alias> | {{ o.alias }}</span>-->
                        </td>
                        <td class="accountListCol coinAndVestContentCol">{{ account.getInfo().getCoin().toString() }}</td>
                        <!--<td class="text-right font-color-555555">{{ new Number(o.Vest).toFixed(4) }}%</td>-->
                       <td class="accountListCol coinAndVestContentCol">{{account.getInfo().hasVest()?account.getInfo().getVest().toString():""}}</td>
                       <td class="accountListCol accountAndTimeContentCol">{{account.getInfo().hasCreatedTime()?timeConversion(Date.now()-account.getInfo().getCreatedTime().getUtcSeconds()*1000):""}} ago</td>
                    </tr>
                </table>
            </div>
            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext v-on:prev=onPrev v-on:firstPage=onGoFirstPage></vue-pagination>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    const accountsCacheKey = utility.getPageCacheKey(utility.pageCacheType.accountsList);
    const listSortType = {
        listSortTypeUnknown : 0,//unknown type
        listSortTypeBalance : 1,//account list sort by balance
        listSortTypeCreTime : 2,//account list sort by create time
    };
    const pageSize = 30;
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
            "vue-blockies": require("@/components/vue-blockies").default
        },
        data() {
            return {
                arr: [],
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                totalAccounts: 0,
                totalBalance: 0,
                totalPage: 1,
                accountList: [],
                coinStart: null,
                coinEnd: null,
                accountPageInfo: [],
                lastAccount:null,
                createdPageIndex:0,
                sortType: listSortType.listSortTypeBalance,
                timeStart: null,
                timeEnd: null,
            };
        },
        methods: {
            nthPage(lastType) {
                this.$root.showModalLoading = true;
                let isChangeSortType = false;
                if (lastType !== this.sortType) {
                    isChangeSortType = true
                }
                let p = this.$route.query.p || 1;
                let start = this.coinStart;
                if (this.sortType === listSortType.listSortTypeCreTime) {
                    start = this.timeStart;
                }
                let isNextPage = true;
                let lastAccount = this.lastAccount;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage === 2 ) {
                        start = null;
                        lastAccount= null;
                    }else {
                        let infoLen = this.accountPageInfo.length;
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.accountPageInfo[this.currentPage-3];
                            start = info.start;
                            lastAccount = info.account;
                        }
                    }
                    pReqType = 0;
                    isNextPage = false;
                }else if (parseInt(p) === this.currentPage) {
                    pReqType = 3;
                }

                if (this.sortType === 1) {
                    this.fetchActListByBalance(p,start,pReqType,lastAccount,isChangeSortType);
                }else if (this.sortType === 2) {
                    this.fetchActListByCreTime(p,start,pReqType,lastAccount,isChangeSortType);
                }else {
                    this.$root.showModalLoading = false;
                    console.log("Fail to fetch account list,the sort type %d is not right",this.sortType)
                }

            },

            updateAccountsPageInfo(index,info) {
                if(info /*&& index < this.accountPageInfo.length*/) {
                    this.accountPageInfo.splice(index,1,info)
                }
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            toWei(n) {
                return utility.toWei(n);
            },
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
            // onTo(n) {
            //     this.$router.push({
            //         path: this.$route.path,
            //         query: { p: n }
            //     });
            // },
            nasAmount(n) {
                BigNumber.config({DECIMAL_PLACES: 8});
                let amount = BigNumber(n);
                let decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount() + ' COS';
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                cacheData.createdPageIndex =  this.createdPageIndex;
                cacheData.sortType = this.sortType;
                let listLen = this.accountPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.accountPageInfo.forEach(function (info) {
                        let obj = {};
                        if (cacheData.sortType === listSortType.listSortTypeBalance && (info.start instanceof api.cos_sdk.raw_type.coin)){
                            obj.start = info.start?info.start.getValue():null;
                            // obj.end = info.end?info.end.getValue():null;
                            obj.account = info.account?info.account.toObject():null;
                            pageList.push(obj);
                        }else if (cacheData.sortType === listSortType.listSortTypeCreTime && (info.start instanceof api.cos_sdk.raw_type.time_point_sec)){
                            obj.start = info.start?info.start.getUtcSeconds():null;
                            // obj.end = info.end?info.end.getUtcSeconds():null;
                            obj.account = info.account?info.account.toObject():null;
                            pageList.push(obj);
                        }
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastInfo = null;
                }
                sessionStorage.setItem(accountsCacheKey,JSON.stringify(cacheData));

            },
            getPageInfo() {
                let info = sessionStorage.getItem(accountsCacheKey);
                if (info != null) {
                   return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                if (sessionStorage.getItem(accountsCacheKey) != null) {
                    sessionStorage.removeItem(accountsCacheKey);
                }
            },

            fetchActListByBalance(p,start,pReqType,lastAccount,isSwitchSortType) {
                api.fetchAccountListByBalance(start,null,pageSize,lastAccount,accountList => {
                    this.handleFetchListSuccessEvent(p,accountList,pReqType,listSortType.listSortTypeBalance,isSwitchSortType);
                },(errCode,msg) => {
                    console.log("Get Account list by balance fail,error code is %s,msg is %s",errCode,msg);
                    if (this.sortType === listSortType.listSortTypeBalance) {
                        if (isSwitchSortType) {
                            this.accountList = null;
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                });
            },

            fetchActListByCreTime(p,start,pReqType,lastAccount,isSwitchSortType) {
                api.fetchAccountListByCreateTime(start,null,lastAccount,pageSize,accountList => {
                    this.handleFetchListSuccessEvent(p,accountList,pReqType,listSortType.listSortTypeCreTime,isSwitchSortType);
                },(errCode,msg) => {
                    console.log("Get Account list by create time fail,error code is %s,msg is %s",errCode,msg);
                    if (this.sortType === listSortType.listSortTypeCreTime) {
                        if (isSwitchSortType) {
                            this.accountList = null;
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                });
            },

            handleFetchListSuccessEvent(p,accountList,pReqType,sortType,isSwitchSortType) {
                if (sortType === this.sortType) {
                    if (accountList.length > 0) {
                        this.accountList = accountList;
                        this.lastAccount = accountList[accountList.length-1].getInfo();
                        let info = {account:this.lastAccount};
                        if (sortType === listSortType.listSortTypeBalance) {
                            this.coinStart = this.lastAccount.getCoin();
                            if (this.currentPage === 0 && pReqType === 1) {
                                this.coinEnd = null;
                            }else {
                                this.coinEnd = accountList[0].getInfo().getCoin();
                            }
                            info.start =  this.coinStart;
                        }else if (sortType === listSortType.listSortTypeCreTime) {
                            this.timeStart = this.lastAccount.getCreatedTime();
                            if (this.currentPage === 0 && pReqType === 1) {
                                this.timeEnd = null;
                            }else {
                                this.timeEnd = accountList[0].getInfo().getCreatedTime();
                            }
                            info.start = this.timeStart;
                        }

                        let curPageLen = this.accountPageInfo.length;
                        if (curPageLen === 0 || (this.currentPage === 1 && pReqType === 3)) {
                            info.end = null;
                        }
                        if (pReqType === 1) {
                            if (this.currentPage + 1 === this.totalPage) {
                                this.totalPage += 1;
                                if (curPageLen >= 1) {
                                    info.end = this.accountPageInfo[curPageLen - 1].start;
                                }
                                this.accountPageInfo.push(info);
                            }else {
                                if (curPageLen >= 1 && this.currentPage <= curPageLen) {
                                    info.end = this.accountPageInfo[this.currentPage-1].start;
                                }
                                this.updateAccountsPageInfo(this.currentPage,info);
                            }
                            this.currentPage += 1;
                            if (this.createdPageIndex < this.totalPage) {
                                this.createdPageIndex += 1;
                            }
                        }else if (pReqType === 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 2 && this.currentPage <= curPageLen) {
                                info.end = this.accountPageInfo[this.currentPage-2].start;
                            }
                            this.updateAccountsPageInfo(this.currentPage-1,info);
                        }else if (pReqType === 3) {
                            this.currentPage = parseInt(p);
                            // if (isSwitchSortType) {
                                this.updateAccountsPageInfo(this.currentPage-1,info);
                            // }
                        }
                        this.savePageInfo();
                    }else if (isSwitchSortType){
                        //clear account list when switch sortType
                        this.accountList = null;
                    }
                    this.$root.showModalLoading = false;
                }
            },

            changeListSortType(type) {
                if (type !== this.sortType) {
                    // this.accountList = null;
                    let originType = this.sortType;
                    this.sortType = type;
                    this.lastAccount = null;
                    this.coinStart = null;
                    this.coinEnd = null;
                    this.timeStart = null;
                    this.timeEnd = null;
                    // this.clearCachePageInfo();
                    this.savePageInfo();
                    let p = parseInt(this.$route.query.p || 1);
                    if (this.currentPage > 1) {
                        this.onGoFirstPage();
                    } else if (p > 1) {
                        this.currentPage = 2;
                        this.$router.go(1-p);
                    } else {
                        this.nthPage(originType);
                    }

                }
            },

            getListTitle() {
                if (this.sortType === listSortType.listSortTypeCreTime) {
                    return "Top Accounts By Create Time";
                }
                return  "Top Accounts By COS Balance";
            },

        },
        mounted() {
            let cacheData = this.getPageInfo();
            let isQuery = true;
            if (cacheData != null) {
                this.currentPage = parseInt(cacheData.currentPage);
                this.totalPage = parseInt(cacheData.totalPage);
                this.createdPageIndex = parseInt(cacheData.createdPageIndex);
                this.sortType = parseInt(cacheData.sortType);
                if (cacheData.pageInfo != null) {
                    let list = [];
                    let sortType = this.sortType;
                    cacheData.pageInfo.forEach(function (obj) {
                        let info = {};
                        if (obj.start != null) {
                            if (sortType === listSortType.listSortTypeBalance) {
                                let start = new api.cos_sdk.raw_type.coin();
                                start.setValue(obj.start);
                                info.start = start;
                            }else if (sortType === listSortType.listSortTypeCreTime){
                                let start = new api.cos_sdk.raw_type.time_point_sec();
                                start.setUtcSeconds(obj.start);
                                info.start = start;
                            }
                        }
                        // if (obj.end != null ) {
                        //     if (sortType === listSortType.listSortTypeBalance) {
                        //         let end = new api.cos_sdk.raw_type.coin();
                        //         end.setValue(obj.end);
                        //         info.end = end;
                        //     }else if (sortType === listSortType.listSortTypeCreTime){
                        //         let end = new api.cos_sdk.raw_type.time_point_sec();
                        //         end.setUtcSeconds(obj.end);
                        //         info.end = end;
                        //     }
                        // }
                        if (obj.account != null) {
                            let lastInfo = new api.cos_sdk.grpc.AccountInfo();
                            let name = new api.cos_sdk.raw_type.account_name();
                            name.setValue(obj.account.accountName.value);
                            lastInfo.setAccountName(name);
                            if (sortType === listSortType.listSortTypeBalance) {
                                let coin = new api.cos_sdk.raw_type.coin();
                                coin.setValue(obj.account.coin.value);
                                lastInfo.setCoin(coin);
                            }else if (sortType === listSortType.listSortTypeCreTime) {
                                let creTime = new api.cos_sdk.raw_type.time_point_sec();
                                creTime.setUtcSeconds(obj.account.createdTime.utcSeconds);
                                lastInfo.setCreatedTime(creTime);
                            }

                            info.account = lastInfo;
                        }
                        list.push(info);
                    });
                    this.accountPageInfo = list;
                }
                if (this.currentPage === 1) {
                    this.coinStart = null;
                    this.timeStart = null;
                    this.lastAccount = null;
                }else if (this.currentPage >= 2 && this.accountPageInfo.length >= this.currentPage){
                    let lastInfo = this.accountPageInfo [this.currentPage-2];
                    if (this.sortType === listSortType.listSortTypeBalance) {
                        this.coinStart = lastInfo.start;
                    }else {
                        this.timeStart = lastInfo.start;
                    }
                    this.lastAccount = lastInfo.account;
                }

            } else {
                let p = this.$route.query.p;
                //now the chain not support page skip request,so in this condition just request from page 1
                if (p > 1) {
                    let query = JSON.parse(window.JSON.stringify(this.$route.query));
                    query.p = 1;
                    this.currentPage = 0;
                    this.totalPage = 1;
                    this.$router.replace({ path: this.$route.path, query });
                    isQuery = false;
                }
            }
            if (isQuery) {
                this.nthPage(this.sortType);
            }
        },
        watch: {
            $route() {
                this.nthPage(this.sortType);
            }
        },

        beforeDestroy() {
            this.createdPageIndex = this.currentPage;
            this.totalPage = this.currentPage+1;
            this.savePageInfo();
        },

        destroyed() {
            if (this.currentPage <= 1 && this.sortType !== listSortType.listSortTypeCreTime) {
                this.clearCachePageInfo();
            }
        },
    };
</script>
