<style>
    .vue-bp {
        background-color: white;
    }

    .vue-bp .bpListHeader {
        display: flex;
        flex-direction: row;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: #e8e8e8;
    }

    .vue-bp .bpListHeaderCol {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 11px;
    }

    .vue-bp .rankHeaderCol {
        width: 10%;
    }

    .vue-bp .bpListHeaderDetailCol {
        width: 20%;
    }

    .vue-bp .voteCountHeaderCol {
        width: 10%;
    }
    .vue-bp .witnessContentCol {
        display:inline-block;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-bp .rankContentCol {
        width: 10%;
    }

    .vue-bp .detailContentCol {
        width: 20%;
    }

    .vue-bp .voteCountContentCol {
        width: 10%;
    }

    .vue-bp .incomeDesc {
        font-size: 18px;
        color: black;
        text-align: left;
        word-wrap: break-word;
        word-break: break-word;
    }

    @media (max-width: 768px) {
        .vue-bp .bpListHeaderCol {
            font-size: 8px;
        }
    }

</style>
<template>
    <div class="vue-bp fullfill">
        <vue-bread title="Block Producers"></vue-bread>
        <div v-if="bpList && bpList.length" class="container mt20">
            <div class="incomeDesc">{{getBpIncomeDesc()}} <a target="_blank" href="mailto:service@contentos.io">service@contentos.io</a></div>

            <div class="maxPageTips">Display the latest {{maxBpPageNum}} pages of data</div>
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="bpListHeader  font-bold font-color-000000">
                        <th class="bpListHeaderCol rankHeaderCol">Rank</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Account</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Time</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Vest</th>
                        <th class="bpListHeaderCol voteCountHeaderCol">Supporter</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Annualized ROI</th>
                    </tr>

                    <tr v-for="(witness, i) in bpList" :key="i" >
                        <td class="witnessContentCol rankContentCol">{{i+1}}</td>
                        <td class="witnessContentCol detailContentCol">
                            <router-link v-if="witness.hasOwner()" v-bind:to='fragApi + "/account/" + witness.getOwner().getValue()' target="_blank">
                                <span>{{ witness.getOwner().getValue()}}</span>
                            </router-link>
                        </td>

                        <td class="witnessContentCol detailContentCol" v-if="witness.hasCreatedTime()">
                            {{ timeConversion(Date.now()-witness.getCreatedTime().getUtcSeconds()*1000) }} ago
                        </td>

                        <td class="witnessContentCol detailContentCol">{{ witness.getBpVest().getVoteVest().toString()}}</td>

                        <td class="witnessContentCol voteCountContentCol">{{ getVoterCountOfWitness(witness)}}</td>

                        <td class="witnessContentCol detailContentCol">{{getYearAnnualizedRate(witness, i+1)}}</td>
                    </tr>
                </table>
            </div>
            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageBpData()">Load More</button>
            </div>
        </div>
        <!--<vue-nothing v-if="bpList && bpList.length === 0" title="0 block producer found"></vue-nothing>-->
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    const bpPageSize = 30;
    const yearReward = 3061425
    const bpNum = 21
    const cosDecimal = 1000000
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-blockies": require("@/components/vue-blockies").default,
            "vue-nothing": require("@/components/vue-nothing").default
        },
        data() {
            return {
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                listStart:null,
                listEnd:null,
                lastWitness:null,
                bpList: [],
                pageInfo:[],
                account: null,
                firstPageStartCount: null,
                firstPageEndCount: null,
                createdPageIndex:0,
                isFetching: false,
                maxBpPageNum: 50,
                isShowLoadMore: true,
                existAcctArray: []

            };
        },
        methods: {
            async nthPage(p) {
                if (p < this.currentPage || p > this.maxBpPageNum) {
                    return;
                }
                this.$root.showModalLoading = true;
                let start = this.listStart;
                let lastWitness = this.lastWitness;

                let result = await api.fetchWitnessListByVoteCount(start, null, bpPageSize, lastWitness);
                if  (result.res) {
                    let bpList = result.res;
                    if (bpList.length > 0) {
                        let list = [];
                        if (this.existAcctArray == null || typeof this.existAcctArray == 'undefined') {
                            this.existAcctArray = [];
                        }
                        if (this.existAcctArray.length) {
                            for (let acct of bpList) {
                                let name = acct.getOwner().getValue();
                                if (this.existAcctArray.indexOf(name) === -1) {
                                    this.existAcctArray.push(name);
                                    list.push(acct);
                                } else {
                                    console.log("Bp %s is already exist in previous page", name);
                                }
                            }
                        } else {
                            list = bpList;
                            for (let acct of bpList) {
                                let name = acct.getOwner().getValue();
                                this.existAcctArray.push(name);
                            }
                        }
                        if (list.length) {
                            this.bpList = this.bpList.concat(list);
                            this.lastWitness = list[list.length-1];
                            this.listStart =  this.lastWitness.getBpVest().getVoteVest();
                            if (this.currentPage === 0) {
                                this.listEnd = null;
                            }else {
                                this.listEnd = list[0].getBpVest().getVoteVest();
                            }
                            let curPageLen = this.pageInfo.length;
                            let info = {start:this.listStart,lastWitness:this.lastWitness};
                            if (curPageLen === 0 ) {
                                info.end = this.firstPageEnd;
                            } else {
                                if (curPageLen >= 1) {
                                    info.end = this.pageInfo[curPageLen - 1].start;
                                }
                            }
                            this.pageInfo.push(info);
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.$root.showModalLoading = false;
                    this.isShowLoadMore = this.currentPage < this.maxBpPageNum;
                    this.isFetching = false;
                }else {
                    console.log("Get bp list fail,error code is %s,msg is %s",result.errCode, result.errMsg);
                    this.isFetching = false;
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                }
            },

            numberAddComma(n) {
                return utility.numberAddComma(n);
            },

            timeConversion(ms) {
                return utility.timeConversion(ms);
            },

            convertOpActionsToStr(actionArray) {
                if (actionArray.length) {
                    return actionArray.join(",");
                }
                return ""
            },
            loadData() {
                this.firstPageStartCount = null;
                this.firstPageEndCount = null;
                this.listStart = this.firstPageStartCount;
            },

            getVoterCountOfWitness(witness) {
                if (witness != null && (typeof witness != "undefined")) {
                    return  witness.getVoterCount();
                }
                return 0;
            },

            onClickLoadNextPageBpData() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.currentPage + 1);
            },

            getBpIncomeDesc() {
                return "If you want to be selected for TOP21, you need to invest at least " + this.getMinBpVest().toLocaleString() +"VEST, you will get "+ yearReward.toLocaleString() +"VEST per year, and the estimated annualized rate of return is " + this.calcInterestRate() + "%." +
                    " If you are willing to become Block Producer, please contact us at"
            },


            calcInterestRate() {
                let minBpVest = this.getMinBpVest()
                return Math.floor(yearReward / minBpVest * 100)
            },

            getYearAnnualizedRate(bp, rank) {
                if (rank >= 22) {
                    return "0%"
                }
                let vest = bp.getBpVest().getVoteVest().getValue()
                let bigVest = BigNumber(vest)
                let bigYearReward = BigNumber(yearReward).multipliedBy(BigNumber(cosDecimal))
                let rate = Math.floor(bigYearReward.dividedBy(bigVest).multipliedBy(BigNumber(100)).toNumber())
                return rate + "%"
            },

            getMinBpVest() {
                if (this.bpList.length > 0) {
                    let num = this.bpList.length
                    let minNum = 0
                    if (num >= bpNum) {
                          minNum = bpNum
                    } else {
                        minNum = num
                    }
                    let minVestBp = this.bpList[minNum-1]
                    let bigVest = BigNumber(minVestBp.getBpVest().getVoteVest().getValue()).dividedBy(BigNumber(cosDecimal))
                    return Math.floor(bigVest.toNumber())
                }
                return 0
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
