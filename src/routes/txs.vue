<style>
    .vue-txs {
        background-color: white;
    }
    .vue-txs .tip a {
        color: rgb(76, 32, 133);
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

    .vue-txs .fromTo {
        line-height: 24px;
    }

    .vue-txs .block {
        margin-right: 8px;
    }

    @media (max-width: 767.98px) {
        .vue-txs .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <!-- https://etherscan.io/txs -->
    <div class="vue-txs fullfill">
        <vue-bread :title='"Transactions" + (($route.query.a || $route.query.block) ? " of" : "")' :subtitle='$route.query.block ? ("Block #" + $route.query.block) : $route.query.a' :subtitlemonospaced='!!$route.query.a' :blockies='$route.query.a'></vue-bread>

        <div v-if="trxList && trxList.length" class="container mt20">
            <!--<div class="d-block d-md-flex flex-row align-items-center mt20">-->
                <!--<span class="col-auto pl-0 pr-2 info font-color-000000 font-24 font-bold title">-->
                    <!--{{ (totalTxs > 0 && !$route.query.a && !$route.query.block) ? 'More than' : '' }} {{ totalTxs > 1000000  ? (Math.floor(totalTxs / 1000000) +  (Math.floor(totalTxs / 1000000) > 2 ? ' millions' : ' million')) : numberAddComma(totalTxs) }} transactions found-->
                <!--</span>-->
                <!--<span v-if="totalTxs > 500" class="col-auto pl-0 font-color-555555 font-16 align-text-bottom subtitle">(showing the last 500 records)</span>-->
            <!--</div>-->

            <div class="explorer-table-container">
                <table class="mt20 explorer-table list-table">
                    <tr class="list-header font-12 font-bold font-color-000000">
                        <th></th>
                        <th>TxHash</th>
                        <th>Block</th>
                        <th>Time</th>
                        <th>From</th>
                        <th></th>
                        <th>To</th>
                        <!--<th class=text-right>Value</th>-->
                    </tr>

                    <tr v-for="(trx, i) in trxList" :key="i">
                        <td>
                            <img v-if="trx.getTrxWrap().getInvoice().getStatus() === 500" class="icon40" src="../../static/img/ic_tx_failed.png"/>
                        </td>
                        <td class="txs-hash">
                            <router-link v-bind:to='fragApi + "/tx/" + trx.getTrxId().toObject().hash'>
                                <span v-bind:class="[trx.getTrxWrap().getInvoice().getStatus() === 500 ? 'hash-failed' : 'hash-normal', 'monospace']">{{ trx.getTrxId().toObject().hash }}</span>
                            </router-link>
                        </td>

                        <td class="txs-block">
                            <router-link class="font-14" v-if='trx.getBlockHeight()' v-bind:to='fragApi + "/block/" + trx.getBlockHeight()'>
                                <span>{{ trx.getBlockHeight() }}</span>
                            </router-link>
                            <i class="font-14 font-color-000000" v-else>pending</i>
                        </td>
                        <td class="time font-14 font-color-555555">
                            <div>
                                <div>{{ timeConversion(Date.now()-trx.getBlockTime().getUtcSeconds()*1000) }} ago</div>
                                <div class="down-arrow-tip">{{ new Date(trx.getBlockTime().getUtcSeconds()*1000 ).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ trx.getBlockTime().getUtcSeconds()*1000  }}</div>
                            </div>
                        </td>
                        <td class="tdxxxwddd txs-from-to">
                            <!--<vue-blockies v-bind:address='o.from.alias || o.from.hash'></vue-blockies>-->
                            <!--&lt;!&ndash; <span class="fromTo font-color-000000 font-14" v-if="o.from.hash === $route.query.a">{{ o.from.alias || o.from.hash }}</span> &ndash;&gt;-->
                            <!--<router-link v-bind:to='fragApi + "/address/" + o.from.hash'>-->
                            <!--<span class="fromTo font-14  monospace">{{ o.from.hash }}</span>-->
                        <!--</router-link>-->
                        </td>
                        <td style="padding: 10px;">
                            <img class="icon16" src="../../static/img/ic_arrow_right.png"/>
                            <div style="width: 10px;"></div>
                        </td>
                        <td class="tdxxxwddd txs-from-to">
                            <!--<div v-if="o.type==='call'" class="container-tip">-->
                                <!--<span class="tip down-arrow-tip font-15 shadow">Smart Contract</span>-->
                                <!--<img class="icon24" src="../../static/img/icon_tx_type_contract.png" />-->
                            <!--</div>-->
                            <!--<vue-blockies v-bind:address='o.to.alias || o.to.hash'></vue-blockies>-->
                            <!--&lt;!&ndash; <span class="fromTo font-color-000000 font-14" v-if="o.to.hash === $route.query.a">{{ o.to.alias || o.to.hash }}</span> &ndash;&gt;-->
                            <!--<router-link v-bind:to='fragApi + "/address/" + o.to.hash'>-->
                                <!--<span class="fromTo font-14  monospace">{{ o.to.hash }}</span>-->
                            <!--</router-link>-->
                        </td>
                        <!--<td class="text-right font-color-000000 font-14">{{ tokenAmount(o.value) }} NAS</td>-->
                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                v-on:prev=onPrev v-on:to=onTo></vue-pagination>
        </div>
        <vue-nothing v-if="trxList && trxList.length === 0" title="0 transaction found"></vue-nothing>
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
            "vue-blockies": require("@/components/vue-blockies").default,
            "vue-nothing": require("@/components/vue-nothing").default
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                totalPage: 1,
                totalTxs: 0,
                listStart:null,
                listEnd:null,
                lastInfo:null,
                trxList: null,
                pageType:0,//0 fetch the next page ,1:fetch the pre page
                pageInfo:[],
            };
        },
        methods: {
            nav(n) {
                var query = JSON.parse(window.JSON.stringify(this.$route.query));

                query.p = n;
                this.$router.push({ path: this.$route.path, query });
            },
            nthPage() {
                this.$root.showModalLoading = true;

                let start = this.listStart;
                let isNext = true;
                if (this.pageType === 1) {
                    let infoLen = this.pageInfo.length;
                    if (infoLen >= 2 && infoLen >= this.currentPage ) {
                        start = this.pageInfo[this.currentPage-2].end;
                    }
                    isNext = false;
                }
                api.fetchTrxListByTime(start,null,this.lastInfo,trxList => {
                    if (trxList.length > 0) {
                        this.trxList = trxList;
                        this.lastInfo = trxList[trxList.length-1];
                        this.listStart = this.lastInfo.getBlockTime();
                        this.listEnd = trxList[0].getBlockTime();
                        if (isNext) {
                            if (this.currentPage + 1 === this.totalPage) {
                                this.totalPage += 1;
                            }
                            this.currentPage += 1;
                            let curPageLen = this.pageInfo.length;
                            let info = {start:this.listStart};
                            if (curPageLen === 0) {
                                info.end = this.listEnd;
                            }else if (curPageLen >= 1) {
                                info.end = this.pageInfo[curPageLen - 1].start;
                            }
                            this.pageInfo.push(info);
                        }else {
                            this.currentPage -= 1;
                        }
                    }
                    this.$root.showModalLoading = false;
                },(errCode,msg) => {
                    console.log("Get block list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });

                // api.getTx({
                //     a: this.$route.query.a,
                //     block: this.$route.query.block,
                //     p: this.$route.query.p || 1,
                //     isPending: this.$route.query.isPending
                // }, o => {
                //     this.$root.showModalLoading = false;
                //     this.arr = o.txnList;
                //     this.currentPage = o.currentPage;
                //     this.maxDisplayCnt = o.maxDisplayCnt;
                //     this.totalPage = o.totalPage;
                //     this.totalTxs = o.txnCnt;
                // }, xhr => {
                //     this.$root.showModalLoading = false;
                //     this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                // });
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                // this.nav(1);
                this.pageType = 1;
                this.nav(this.currentPage - 1);
            },
            onLast() {
                this.pageType = 0;
                // this.nav(this.totalPage);
                this.nav(this.currentPage + 1);
            },
            onNext() {
                this.pageType = 0;
                this.nav(this.currentPage + 1);
            },
            onPrev() {
                this.pageType = 1;
                this.nav(this.currentPage - 1);
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
