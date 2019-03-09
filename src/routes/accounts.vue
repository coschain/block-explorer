<style>
    .vue-accounts {
        background-color: white;
    }

    .vue-accounts .block {
        margin-right: 8px;
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

</style>
<template>
    <!-- https://etherscan.io/accounts  -->
    <div class="vue-accounts fullfill">
        <vue-bread title="Top Accounts By COS Balance"></vue-bread>
        <div v-if="accountList && accountList.length" class="mt20 container">
            <div class="d-block d-md-flex flex-row align-items-center mt20">
                <!--<div class="col-auto pl-0 pr-2 info font-color-000000 font-24 font-bold title">-->
                    <!--{{ numberAddComma(totalAccounts) }} accounts found-->
                <!--</div>-->
                <!--<span v-if="totalAccounts > 10000" class="col-auto pl-0 font-color-555555 font-16 align-text-bottom subtitle">(showing the last 10,000 top accounts)</span>-->
            </div>
            <div class="explorer-table-container">
                <table class="mt20 explorer-table list-table">
                    <tr class="list-header font-12 font-bold font-color-000000">
                        <th style="padding-left: 24px;">Rank</th>
                        <th>Account</th>
                        <th class=text-right>Balance</th>
                        <!--<th class=text-right>Percentage</th>-->
                    </tr>
                    <tr v-for="(account, i) in accountList" :key="i" class="font-14">
                        <td style="padding-left: 24px;" class="font-color-000000">{{(currentPage-1)*accountList.length+i+1}}</td>
                        <td class="tdxxxwddd">
                            <vue-blockies v-bind:address='account.getAccountName().getValue()'></vue-blockies>
                            <router-link v-bind:to='fragApi + "/address/" + account.getAccountName().getValue()'>
                                <span class="monospace">{{account.getAccountName().getValue()}}</span>
                            </router-link>
                            <!--<span v-show=o.alias> | {{ o.alias }}</span>-->
                        </td>
                        <td class="text-right font-color-555555">{{ account.getCoin().getValue() }}</td>
                        <!--<td class="text-right font-color-555555">{{ new Number(o.percentage).toFixed(4) }}%</td>-->
                    </tr>
                </table>
            </div>
            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext v-on:prev=onPrev ></vue-pagination>
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
            };
        },
        methods: {
            nthPage() {
                let p = this.$route.query.p || 1;
                if (p == this.currentPage)
                    console.log("nthPage -requesting the page ", p, "is current page,ignore");
                else {
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
                    }

                    api.fetchAccountListByBalance(start,null,lastAccount,accountList => {
                        if (accountList.length > 0) {
                            this.accountList = accountList;
                            this.lastAccount = accountList[accountList.length-1];
                            this.coinStart = this.lastAccount.getCoin();
                            if (this.currentPage === 0 && isNextPage) {
                                this.coinEnd = null;
                            }else {
                                this.coinEnd = accountList[0].getCoin();
                            }
                            if (pReqType == 1) {
                                if (this.currentPage + 1 == this.totalPage) {
                                    this.totalPage += 1;
                                    let curPageLen = this.accountPageInfo.length;
                                    let info = {start:this.coinStart,account:this.lastAccount};
                                    if (curPageLen === 0) {
                                        info.end = this.coinEnd;
                                    }else if (curPageLen >= 1) {
                                        info.end = this.accountPageInfo[curPageLen - 1].start;
                                    }
                                    this.accountPageInfo.push(info);
                                }
                                this.currentPage += 1;

                            }else if (pReqType == 0) {
                                this.currentPage -= 1;
                            }
                        }
                        this.$root.showModalLoading = false;
                    },(errCode,msg) => {
                        console.log("Get Account list fail,error code is %s,msg is %s",errCode,msg);
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    });
                    // api.getAccount(p, o => {
                    //     this.$root.showModalLoading = false;
                    //     this.arr = o.addressList;
                    //     this.currentPage = o.page;
                    //     this.totalAccounts = o.totalAccountsCnt;
                    //     this.totalBalance = o.totalBalance;
                    //     this.totalPage = o.totalPage;
                    //
                    //     if (this.arr.length) {
                    //         this.heightFrom = this.arr[0].height;
                    //         this.heightTo = this.arr[this.arr.length - 1].height;
                    //     } else {
                    //         this.heightFrom = 0;
                    //         this.heightTo = 0;
                    //     }
                    // }, xhr => {
                    //     this.$root.showModalLoading = false;
                    //     this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    // });
                }
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            toWei(n) {
                return utility.toWei(n);
            },
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
            }
        },
        mounted() {
            this.nthPage();
        },
        watch: {
            $route() {
                this.nthPage();
            }
        }
    };
</script>
