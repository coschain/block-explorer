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

    .vue-accounts .headSort {
        width: 22%;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }

    .vue-accounts .headSort:hover {
        background-color: #e8e8e8;
        opacity: 0.6;
    }

    .vue-accounts .headSort:focus-within {
        background-color: #e8e8e8;
        opacity: 0.6;
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
            <div class="container maxPageTips">Display the latest {{maxAccountsPageNum}} pages of data</div>
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="accountListHeader font-bold font-color-000000">
                        <th class="headRank">Rank</th>
                        <th class="headAccount">Account</th>
                        <th :class='[curSortType === srtType.listSortTypeBalance?"headSort headSelectStatus":"headSort"]' @click="changeListSortType(srtType.listSortTypeBalance)">
                            <div> Balance</div>
                            <div :class='[curSortType === srtType.listSortTypeBalance?"arrow-down selected-arrow-down":"arrow-down"]'></div>
                        </th>
                        <th :class='[curSortType === srtType.listSortTypeVest?"headSort headSelectStatus":"headSort"]' @click="changeListSortType(srtType.listSortTypeVest)">
                            <div>Vest</div>
                            <div :class='[curSortType === srtType.listSortTypeVest?"arrow-down selected-arrow-down":"arrow-down"]' @click="changeListSortType(srtType.listSortTypeVest)"></div>
                        </th>
                        
                        <th :class='[curSortType === srtType.listSortTypeCreTime?"headSort headSelectStatus":"headSort"]' @click="changeListSortType(srtType.listSortTypeCreTime)">
                            <div>Time</div>
                            <div :class='[curSortType === srtType.listSortTypeCreTime?"arrow-down selected-arrow-down":"arrow-down"]' @click="changeListSortType(srtType.listSortTypeCreTime)"></div>
                        </th>
                    </tr>
                    <tr v-for="(account, i) in accountList" :key="i" class="contentFont">
                        <td class="accountListCol rankContentCol">{{i+1}}</td>
                        <td class="accountListCol accountAndTimeContentCol">
                            <!--<vue-blockies v-bind:address='account.getAccountName().getValue()'></vue-blockies>-->
                            <router-link v-bind:to='fragApi + "/account/" + account.getInfo().getAccountName().getValue()' target="_blank">
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
            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageAccounts()">Load More</button>
            </div>
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
        listSortTypeVest    : 3,//account list sort by vest

    };
    const pageSize = 30;
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-blockies": require("@/components/vue-blockies").default
        },
        data() {
            return {
                arr: [],
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                totalAccounts: 0,
                totalBalance: 0,
                accountList: [],
                coinStart: null,
                coinEnd: null,
                accountPageInfo: [],
                lastAccount:null,
                curSortType: listSortType.listSortTypeBalance,
                timeStart: null,
                timeEnd: null,
                vestStart: null,
                vestEnd: null,
                srtType: listSortType,
                isShowLoadMore: true,
                isFetching: false,
                maxAccountsPageNum: 50,
                acctNameArray: []
            };
        },
        methods: {
            nthPage(lastType, p) {
                if (p < this.currentPage || p > this.maxAccountsPageNum) {
                    return;
                }
                this.$root.showModalLoading = true;
                let isChangeSortType = false;
                if (lastType !== this.curSortType) {
                    isChangeSortType = true;
                    if (p !== 1) {
                        p = 1;
                    }
                }
                let start = this.coinStart;
                if (this.curSortType === listSortType.listSortTypeCreTime) {
                    start = this.timeStart;
                } else if (this.curSortType === listSortType.listSortTypeVest) {
                    start = this.vestStart;
                }
                let lastAccount = this.lastAccount;

                if (this.curSortType === listSortType.listSortTypeBalance) {
                    this.fetchActListByBalance(p,start,lastAccount,isChangeSortType);
                }else if (this.curSortType === listSortType.listSortTypeCreTime) {
                    this.fetchActListByCreTime(p,start,lastAccount,isChangeSortType);
                }else if (this.curSortType === listSortType.listSortTypeVest) {
                    this.fetchAccountListByVest(p,start,lastAccount,isChangeSortType);
                } else {
                    this.$root.showModalLoading = false;
                    console.log("Fail to fetch account list,the sort type %d is not right",this.curSortType)
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


            nasAmount(n) {
                BigNumber.config({DECIMAL_PLACES: 8});
                let amount = BigNumber(n);
                let decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount() + ' COS';
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.sortType = this.curSortType;
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

            //Get account list by Balance
            fetchActListByBalance(p,start,lastAccount,isSwitchSortType) {
                api.fetchAccountListByBalance(start,null,pageSize,lastAccount,accountList => {
                    this.handleFetchListSuccessEvent(p,accountList,listSortType.listSortTypeBalance,isSwitchSortType);
                },(errCode,msg) => {
                    console.log("Get Account list by balance fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
                    if (this.curSortType === listSortType.listSortTypeBalance) {
                        if (isSwitchSortType) {
                            this.accountList = [];
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                });
            },

            //Get account list by create time
            fetchActListByCreTime(p,start,lastAccount,isSwitchSortType) {
                api.fetchAccountListByCreateTime(start,null,lastAccount,pageSize,accountList => {
                    this.handleFetchListSuccessEvent(p,accountList,listSortType.listSortTypeCreTime,isSwitchSortType);
                },(errCode,msg) => {
                    console.log("Get Account list by create time fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
                    if (this.curSortType === listSortType.listSortTypeCreTime) {
                        if (isSwitchSortType) {
                            this.accountList = [];
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                });
            },

            //Get account list by vest
            async fetchAccountListByVest(p,start,lastAccount,isSwitchSortType) {
                let response = await api.fetchAccountListByVest(start, null, pageSize, lastAccount);
                if (response.res != null) {
                    this.handleFetchListSuccessEvent(p,response.res,listSortType.listSortTypeVest,isSwitchSortType);
                } else {
                    console.log("Get Account list by vest fail,error code is %s,msg is %s",response.errCode,response.errMsg);
                    this.isFetching = false;
                    if (isSwitchSortType) {
                        this.accountList = [];
                    }
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                }
            },

            handleFetchListSuccessEvent(p,accountList,sortType,isSwitchSortType) {
                if (sortType === this.curSortType) {
                    if (accountList.length > 0) {
                        let list = [];
                        if (this.acctNameArray&&this.acctNameArray.length) {
                            for(let i = 0; i < accountList.length; i++) {
                                let acctRes = accountList[i];
                                let name = acctRes.getInfo().getAccountName().getValue();
                                if (this.acctNameArray.indexOf(name) === -1) {
                                    list.push(acctRes);
                                    this.acctNameArray.push(name);
                                } else {
                                    console.log("Account name %s is already in previous page", name);
                                }
                            }
                        } else {
                            list = accountList;
                            for (let i in list) {
                                let name = list[i].getInfo().getAccountName().getValue();
                                this.acctNameArray.push(name);
                            }
                        }
                        if (list.length) {
                            this.accountList = this.accountList.concat(list);
                            this.lastAccount = list[list.length-1].getInfo();
                            let info = {account:this.lastAccount};
                            if (sortType === listSortType.listSortTypeBalance) {
                                this.coinStart = this.lastAccount.getCoin();
                                if (this.currentPage === 0 ) {
                                    this.coinEnd = null;
                                }else {
                                    this.coinEnd = list[0].getInfo().getCoin();
                                }
                                info.start =  this.coinStart;
                            }else if (sortType === listSortType.listSortTypeCreTime) {
                                this.timeStart = this.lastAccount.getCreatedTime();
                                if (this.currentPage === 0 ) {
                                    this.timeEnd = null;
                                }else {
                                    this.timeEnd = list[0].getInfo().getCreatedTime();
                                }
                                info.start = this.timeStart;
                            } else if (sortType === listSortType.listSortTypeVest) {
                                this.vestStart = this.lastAccount.getVest();
                                if (this.currentPage === 0 ) {
                                    this.vestEnd = null;
                                }else {
                                    this.vestEnd = list[0].getInfo().getVest();
                                }
                                info.start = this.vestStart;
                            }

                            let curPageLen = this.accountPageInfo.length;
                            if (curPageLen === 0 ) {
                                info.end = null;
                            } else {
                                if (curPageLen >= 1) {
                                    info.end = this.accountPageInfo[curPageLen - 1].start;
                                }
                            }
                            this.accountPageInfo.push(info);
                            this.savePageInfo();
                            this.currentPage = parseInt(p);
                        }

                    }else if (isSwitchSortType){
                        //clear account list when switch sortType
                        this.accountList = null;
                    }
                    this.$root.showModalLoading = false;
                    this.isShowLoadMore = this.currentPage < this.maxAccountsPageNum;
                }
                this.isFetching = false;
            },

            changeListSortType(type) {
                if (type !== this.curSortType) {
                    // this.accountList = null;
                    let originType = this.curSortType;
                    this.curSortType = type;
                    this.lastAccount = null;
                    this.coinStart = null;
                    this.coinEnd = null;
                    this.timeStart = null;
                    this.timeEnd = null;
                    this.vestStart = null;
                    this.vestEnd = null;
                    this.currentPage = 1;
                    this.accountList = [];
                    this.acctNameArray = [];
                    this.savePageInfo();
                    this.nthPage(originType,1);
                }
            },

            onClickLoadNextPageAccounts() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.curSortType, this.currentPage + 1);
            },

            getListTitle() {
                if (this.curSortType === listSortType.listSortTypeCreTime) {
                    return "Top Accounts By Create Time";
                } else if (this.curSortType === listSortType.listSortTypeVest) {
                    return "Top Accounts By Vest";
                }
                return  "Top Accounts By COS Balance";
            },

        },
        mounted() {
            let cacheData = this.getPageInfo();
            if (cacheData != null) {
                this.curSortType = parseInt(cacheData.sortType);
            }

            this.nthPage(this.curSortType, 1);

        },
        watch: {
            $route() {
                this.nthPage(this.curSortType, 1);
            }
        },

        destroyed() {
            if (this.currentPage <= 1 && this.curSortType !== listSortType.listSortTypeCreTime && this.curSortType !== listSortType.listSortTypeVest) {
                this.clearCachePageInfo();
            }
        },
    };
</script>
