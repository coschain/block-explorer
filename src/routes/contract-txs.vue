<style>
    .vue-txs {
        background-color: white;
    }
    .vue-txs .tip a {
        color: rgb(76, 32, 133);
    }

    .vue-txs .info-and-pagination .info a {
        color: inherit;
    }

    .vue-txs td,
    .vue-txs th {
        border-top-color: #ddd;
    }

    .vue-txs .fail {
        background: url(../../static/img/warning_icon.png)no-repeat 0 10px;
        padding-left: 28px;
    }

    .vue-txs .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vue-txs .hash-normal {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        color: rgba(0, 87, 255, 1);
        line-height: 20px;
    }

    .vue-txs .hash-failed {
        height: 20px;
        font-size: 14px;
        /* font-family: OpenSans; */
        line-height: 20px;
        color: rgba(240, 68, 52, 1);
    }

    .vue-txs .txs-hash {
        max-width: 185px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    .vue-txs .txs-block {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        padding: 0;
    }

    /*.txs-from-to {*/
        /*max-width: 168px;*/
    /*}*/

    /* .txs-from-to a {
        max-width: 158px;
    } */

    .vue-txs .fromTo {
        /*max-width: 158px;*/
        height: 20px;
        line-height: 20px;
    }

    .vue-txs .block {
        margin-right: 8px;
    }
</style>
<template>
    <!-- https://etherscan.io/txs -->
    <div class="vue-txs fullfill">
        <vue-bread v-bind:title=transactionsTitle></vue-bread>

        <div class="container mt20">
            <div class="align-items-center info-and-pagination mt20 row">
                <div class="col info font-color-000000 font-24 font-bold">{{ numberAddComma(totalTxs) }} transactions found</div>
            </div>

            <div class="explorer-table-container">
                <table v-if="arr.length" class="mt20 explorer-table list-table">
                    <tr class="list-header font-12 font-bold font-color-000000">
                        <th class="pl-2"></th>
                        <th>TxHash</th>
                        <th>Block</th>
                        <th>Age</th>
                        <th>From</th>
                        <th></th>
                        <th>To</th>
                        <th class=text-right>Value</th>
                        <th class="text-right pr-3">TxFee</th>
                    </tr>

                    <tr v-for="(o, i) in arr" :key="i">
                        <td class="pl-2">
                            <img v-if="o.status===0" class="icon40" src="../../static/img/ic_tx_failed.png"/>
                        </td>
                        <td class="txs-hash">
                            <router-link v-bind:to='fragApi + "/tx/" + o.hash'>
                                <span v-bind:class="[o.status===0 ? 'hash-failed' : 'hash-normal', 'monospace']">{{ o.hash }}</span>
                            </router-link>
                        </td>

                        <td class="txs-block">
                            <router-link class="font-14" v-if=o.blockHeight v-bind:to='fragApi + "/block/" + o.blockHeight'>
                                <span>{{ o.blockHeight }}</span>
                            </router-link>
                            <i class="font-14 font-color-000000" v-else>pending</i>
                        </td>
                        <td class="time font-14 font-color-555555">
                            <div>
                                <div>{{ timeConversion(o.timeDiff) }} ago</div>
                                <div class="down-arrow-tip">{{ new Date(o.timestamp).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ o.timestamp }}</div>
                            </div>
                        </td>
                        <td class="tdxxxwddd txs-from-to">
                            <vue-blockies v-bind:account='o.from'></vue-blockies>
                            <router-link v-bind:to='fragApi + "/account/" + o.from'>
                                <span class="fromTo font-14  monospace">{{ o.from }}</span>
                            </router-link>
                        </td>
                        <td>
                            <img class="icon16" src="../../static/img/ic_arrow_right.png"/>
                        </td>
                        <td class="tdxxxwddd txs-from-to">
                            <vue-blockies v-bind:address='o.to'></vue-blockies>
                            <router-link v-bind:to='fragApi + "/account/" + o.to'>
                                <span class="fromTo font-14  monospace">{{ o.to }}</span>
                            </router-link>
                        </td>
                        <td class="text-right font-color-000000 font-14">{{ tokenAmount(o.contractValue) }} {{ o.tokenName }}</td>
                        <td class="text-right font-14 font-color-555555 pr-3">{{ toWei(o.txFee) }}</td>
                    </tr>
                </table>
            </div>

            <vue-pagination v-if="arr.length" v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                v-on:prev=onPrev v-on:to=onTo></vue-pagination>
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
            "vue-pagination": require("@/components/vue-pagination").default
        },
        data() {
            return {
                arr: [],
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                totalPage: 0,
                totalTxs: 0,
                tokenName: null
            };
        },
        computed: {
            transactionsTitle: function () {
                return (this.tokenName ? this.tokenName + ' ' : '') + "Transactions";
            }
        },
        methods: {
            nav(n) {
                var query = JSON.parse(window.JSON.stringify(this.$route.query));

                query.p = n;
                this.$router.push({ path: this.$route.path, query });
            },
            nthPage() {
                this.$root.showModalLoading = true;

                api.getContractTx({
                    contract: this.$route.query.contract,
                    p: this.$route.query.p || 1,
                    isPending: this.$route.query.isPending
                }, o => {
                    this.$root.showModalLoading = false;
                    this.arr = o.txnList;
                    this.currentPage = o.currentPage;
                    this.maxDisplayCnt = o.maxDisplayCnt;
                    this.totalPage = o.totalPage;
                    this.totalTxs = o.txnCnt;
                    this.tokenName = o.tokenName;
                }, xhr => {
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                this.nav(1);
            },
            onLast() {
                this.nav(this.totalPage);
            },
            onNext() {
                this.nav(this.currentPage + 1);
            },
            onPrev() {
                this.nav(this.currentPage - 1);
            },
            onTo(n) {
                this.nav(n);
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            tokenAmount(n) {
                BigNumber.config({ DECIMAL_PLACES: 18 })
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount();
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
