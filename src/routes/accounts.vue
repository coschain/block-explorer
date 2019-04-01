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
        background-color: #e8e8e8;
        font-size: 11px ;
    }

    .vue-accounts .headRank {
        width: 15%;
    }

    .vue-accounts .headAccount {
        width: 25%;
    }

    .vue-accounts .headOther {
        width: 30%;
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
        width: 15%;
    }

    .vue-accounts .contentFont {
        font-size: 14px;
    }

    .vue-accounts .accountNameContentCol {
        width: 25%;
    }

    .vue-accounts .coinAndVestContentCol {
        width: 30%;
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
        <vue-bread title="Top Accounts By COS Balance"></vue-bread>
        <div v-if="accountList && accountList.length" class="mt20 container">
            <!--<div class="d-block d-md-flex flex-row align-items-center mt20">-->
                <!--<div class="col-auto pl-0 pr-2 info font-color-000000 font-24 font-bold title">-->
                    <!--{{ numberAddComma(totalAccounts) }} accounts found-->
                <!--</div>-->
                <!--<span v-if="totalAccounts > 10000" class="col-auto pl-0 font-color-555555 font-16 align-text-bottom subtitle">(showing the last 10,000 top accounts)</span>-->
            <!--</div>-->
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="accountListHeader font-bold font-color-000000">
                        <th class="headRank">Rank</th>
                        <th class="headAccount">Account</th>
                        <th class="headOther">Balance</th>
                        <th class="headOther">Vest</th>
                    </tr>
                    <tr v-for="(account, i) in accountList" :key="i" class="contentFont">
                        <td class="accountListCol rankContentCol">{{(currentPage-1)*accountList.length+i+1}}</td>
                        <td class="accountListCol accountNameContentCol">
                            <!--<vue-blockies v-bind:address='account.getAccountName().getValue()'></vue-blockies>-->
                            <router-link v-bind:to='fragApi + "/account/" + account.getInfo().getAccountName().getValue()'>
                                <span class="monospace">{{account.getInfo().getAccountName().getValue()}}</span>
                            </router-link>
                            <!--<span v-show=o.alias> | {{ o.alias }}</span>-->
                        </td>
                        <td class="accountListCol coinAndVestContentCol">{{ account.getInfo().getCoin().toString() }}</td>
                        <!--<td class="text-right font-color-555555">{{ new Number(o.Vest).toFixed(4) }}%</td>-->
                       <td class="accountListCol coinAndVestContentCol">{{account.getInfo().hasVest()?account.getInfo().getVest().toString():""}}</td>
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
            };
        },
        methods: {
            nthPage() {
                this.$root.showModalLoading = true;
                let p = this.$route.query.p || 1;
                let start = this.coinStart;
                let isNextPage = true;
                let lastAccount = this.lastAccount;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage == 2 ) {
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
                }else if (p == this.currentPage) {
                    pReqType = 3;
                }

                api.fetchAccountListByBalance(start,null,30,lastAccount,accountList => {
                    if (accountList.length > 0) {
                        this.accountList = accountList;
                        this.lastAccount = accountList[accountList.length-1].getInfo();
                        this.coinStart = this.lastAccount.getCoin();
                        if (this.currentPage === 0 && isNextPage) {
                            this.coinEnd = null;
                        }else {
                            this.coinEnd = accountList[0].getInfo().getCoin();
                        }
                        let curPageLen = this.accountPageInfo.length;
                        let info = {start:this.coinStart,account:this.lastAccount};
                        if (curPageLen === 0 || (this.currentPage == 1 && pReqType == 3)) {
                            info.end = null;
                        }
                        if (pReqType == 1) {
                            if (this.currentPage + 1 == this.totalPage) {
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
                        }else if (pReqType == 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 2 && this.currentPage <= curPageLen) {
                                info.end = this.accountPageInfo[this.currentPage-2].start;
                            }
                            this.updateAccountsPageInfo(this.currentPage-1,info);
                        }else if (pReqType == 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.$root.showModalLoading = false;
                    this.savePageInfo();
                },(errCode,msg) => {
                    console.log("Get Account list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });

            },

            updateAccountsPageInfo(index,info) {
                if(info && index < this.accountPageInfo.length) {
                    this.accountPageInfo.splice(index,1,info)
                }
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
                BigNumber.config({DECIMAL_PLACES: 8})
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount() + ' COS';
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                cacheData.createdPageIndex =  this.createdPageIndex;
                let listLen = this.accountPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.accountPageInfo.forEach(function (info) {
                        let obj = {};
                        obj.start = info.start?info.start.getValue():null;
                        obj.end = info.end?info.end.getValue():null;
                        obj.account = info.account?info.account.toObject():null;
                        pageList.push(obj);
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
                            let start = new api.cos_sdk.raw_type.coin();
                            start.setValue(obj.start);
                            info.start = start;
                        }
                        if (obj.end != null ) {
                            let end = new api.cos_sdk.raw_type.coin();
                            end.setValue(obj.end);
                            info.end = end;
                        }
                        if (obj.account != null) {
                            let lastInfo = new api.cos_sdk.grpc.AccountInfo();
                            let name = new api.cos_sdk.raw_type.account_name();
                            name.setValue(obj.account.accountName.value);
                            lastInfo.setAccountName(name);
                            let coin = new api.cos_sdk.raw_type.coin();
                            coin.setValue(obj.account.coin.value);
                            lastInfo.setCoin(coin);
                            info.account = lastInfo;
                        }
                        list.push(info);
                    });
                    this.accountPageInfo = list;
                }
                if (this.currentPage == 1) {
                    this.coinStart = null;
                    this.lastAccount = null;
                }else if (this.currentPage >= 2 && this.accountPageInfo.length >= this.currentPage){
                    let lastInfo = this.accountPageInfo [this.currentPage-2];
                    this.coinStart = lastInfo.start;
                    this.lastAccount = lastInfo.account;
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
