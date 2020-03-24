<style>
    .vue-user-vest-delegation {
        background-color: white;
    }

    .vue-user-vest-delegation .info-and-pagination .info a {
        color: inherit;
    }

    .vue-user-vest-delegation .contentCol {
        display:inline-block;
        width: calc(100% / 7);
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-user-vest-delegation td,
    .vue-user-vest-delegation th {
        border-top-color: #ddd;
    }

    .vue-user-vest-delegation .hash>* {
        display: inline;
    }

    .vue-user-vest-delegation .header {
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

    .vue-user-vest-delegation .headCol {
        width: calc(100%/7);
    }


    @media (max-width: 767.98px) {
        .vue-user-vest-delegation .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <div class="vue-user-vest-delegation fullfill">
        <vue-bread v-bind:title='"Vest " + ($route.params.ordertype === "lend"? "Lent From" : "Borrowed By") + ":"'
                   v-bind:subtitle="$route.params.account"
                   v-bind:subtitlemonospaced="!!$route.params.account">
        </vue-bread>
        <div v-if="orderList.length===0" class="container mt20">
            <div class="maxPageTips font-bold">No Orders Found.</div>
        </div>
        <div v-if="orderList.length" class="container mt20">
            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table">
                    <tr class=" header font-bold font-color-000000">
                        <th class="headCol">Order ID</th>
                        <th class="headCol">From</th>
                        <th class="headCol">To</th>
                        <th class="headCol">Amount</th>
                        <th class="headCol">Maturation</th>
                        <th class="headCol">Created</th>
                        <th class="headCol">Status</th>
                    </tr>

                    <tr v-for="(order,i) in orderList" :key="i">
                        <td  class="contentCol">{{order.getId()}}</td>
                        <td class="contentCol">
                            <router-link v-bind:to='fragApi + "/account/" + order.getFromAccount().getValue()' target="_blank">
                                <span class="monospace">{{order.getFromAccount().getValue()}}</span>
                            </router-link>
                        </td>
                        <td class="contentCol">
                            <router-link v-bind:to='fragApi + "/account/" + order.getToAccount().getValue()' target="_blank">
                                <span class="monospace">{{order.getToAccount().getValue()}}</span>
                            </router-link>
                        </td>
                        <td class="contentCol">{{tokenAmount(order.getAmount().getValue())}}</td>
                        <td class="contentCol">{{timeConversion((order.getMaturityBlock() - order.getCreatedBlock())*1000)}}</td>
                        <td class="contentCol">
                            <router-link v-bind:to='fragApi + "/block/" + order.getCreatedBlock()' target="_blank">
                                <span class="monospace">{{estBlockTime(order.getCreatedBlock())}}</span>
                            </router-link>
                        </td>
                        <td class="contentCol">{{getOrderStatus(order)}}</td>
                    </tr>
                </table>
            </div>

            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextUsrOrders()">Load More</button>
            </div>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    import {cos_sdk} from "../../src/assets/api"

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-blockies": require("@/components/vue-blockies").default
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                orderList: [],
                orderPageInfo:[],
                userAccount: null,
                lastOrder: 0,
                isLender: false,
                isShowLoadMore: true,
                isFetching: false,
                maxUsrOrdersPageNum: 50,
                chainState: null,
            };
        },
        methods: {
            async nthPage(p) {
                if (p < this.currentPage || p > this.maxUsrOrdersPageNum) {
                    return;
                }
                await this.updateChainInfo();

                this.$root.showModalLoading = true;
                let lastOrder = this.lastOrder;

                await api.fetchUserVestDelegationOrders(this.userAccount, this.isLender, 50, lastOrder, orderList => {
                    if (orderList.length) {
                        this.orderList = this.orderList.concat(orderList);
                        this.lastOrder = orderList[orderList.length-1].getId();
                        this.orderPageInfo.push(this.lastOrder);
                        this.currentPage = p;
                    }
                    this.$root.showModalLoading = false;
                    this.isFetching = false;
                    this.isShowLoadMore = this.currentPage < this.maxUsrOrdersPageNum;
                },(errCode,msg) => {
                    console.log("Get user's delegation order list fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
            },

            updateUserArticleInfo(index,info) {
                if (info && index >= 0 && index < this.postPageInfo.length) {
                    this.postPageInfo.splice(index,1,info);
                }
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
                BigNumber.config({ DECIMAL_PLACES: 6 });
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+6');
                return amount.div(decimals).toFormat();
            },

            estBlockTime(n) {
                let t = Date.now() - (this.chainState.lastIrreversibleBlockTime + n - this.chainState.lastIrreversibleBlockNumber) * 1000;
                return t > 0? this.timeConversion(t) + " Ago" : this.timeConversion(-t) + " Later";
            },

            async updateChainInfo() {
                await api.fetchStateInfo(info => {
                    if (info != null && typeof info.state.dgpo != "undefined" ) {
                        this.chainState = info.state;
                    }else {
                        console.log("return empty props");
                    }
                },(errCode,msg) => {
                    console.log("Get state info fail,error code is %s,msg is %s",errCode,msg);
                });
            },

            getOrderStatus(order) {
                return order.getDelivering()? "Delivering" : (
                    order.getMaturityBlock() - this.chainState.dgpo.headBlockNumber <= 0?
                        "Matured" : "Not Matured"
                );
            },

            loadData() {
                this.userAccount = this.$route.params.account;
                this.lastOrder = 0;
                this.isLender = this.$route.params.ordertype === "lend";
            },

            onClickLoadNextUsrOrders() {
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
                this.nthPage();
            }
        },
    };
</script>
