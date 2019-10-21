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
        width: 8%;
    }

    .vue-bp .bpListHeaderDetailCol {
        width: 18%;
    }

    .vue-bp .statusHeaderCol {
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
        width: 8%;
    }

    .vue-bp .detailContentCol {
        width: 18%;
    }

    .vue-bp .statusContentCol {
        width: 10%;
    }


    .vue-bp .incomeTitle {
        font-size: 18px;
    }

    .vue-bp .incomeBase {
        color: black;
        text-align: left;
        word-wrap: break-word;
        word-break: break-word;
    }

    .vue-bp .incomeDesc {
        font-size: 14px;
    }

    .vue-bp .contactBtn {
        margin-top: 5px;
        padding: 3px 6px;
        outline-style: none;
        border-radius: 5px;
        background-color: #0057FF;
        color: white;
        text-decoration: none;
        box-sizing: border-box;
        border-style: none;
    }

    .vue-bp .contactLink {
        width: 100%;
        color: white;
        text-decoration: none;
        outline-style: none;
        border-style: none;
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
            <div class="alert alert-primary">
                <div class="incomeTitle incomeBase">Call for Block Producers</div>
                <div class="incomeBase incomeDesc">Minimum votes to be elected: {{getMinBpVest().toLocaleString()}} VEST</div>
                <div class="incomeBase incomeDesc">Highest Accumulated Reward：{{getMaxAccumulatedReward()}} VEST</div>
                <div class="incomeBase incomeDesc">Highest Annualized ROI: {{getMaxAnnualizedRate()}}({{getMaxAnnualizedAccountName()}})</div>
                <button class="contactBtn">
                    <a class="contactLink" target="_blank" href="mailto:bp@contentos.io">CONTACT</a>
                </button>
            </div>
            <div class="maxPageTips">Display the latest {{maxBpPageNum}} pages of data</div>
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="bpListHeader  font-bold font-color-000000">
                        <th class="bpListHeaderCol rankHeaderCol">Rank</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Block Producer</th>
                        <th class="bpListHeaderCol statusHeaderCol">Voters</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Votes</th>
                        <th class="bpListHeaderCol statusHeaderCol">Status</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Accumulated Reward</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Annualized ROI</th>
                    </tr>

                    <tr v-for="(witness, i) in bpList" :key="i" >
                        <td class="witnessContentCol rankContentCol">{{i+1}}</td>
                        <td class="witnessContentCol detailContentCol">
                            <router-link v-if="witness.hasOwner()" v-bind:to='fragApi + "/account/" + witness.getOwner().getValue()' target="_blank">
                                <span>{{ witness.getOwner().getValue()}}</span>
                            </router-link>
                        </td>

                        <td class="witnessContentCol statusContentCol">{{ getVoterCountOfWitness(witness)}}</td>

                        <td class="witnessContentCol detailContentCol">{{ getBpVoteVest(witness)}}</td>
                        <td class="witnessContentCol statusContentCol">
                            {{getBpDesc(witness, i+1)}}
                        </td>

                        <td class="witnessContentCol detailContentCol">{{getBpAccumulatedReward(witness)}} VEST</td>
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
    const singleBlkReward = 2.038621
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
                    let minVestBp = this.getTop21MinVestBp()
                    let bigVest = BigNumber(minVestBp.getBpVest().getVoteVest().getValue()).dividedBy(BigNumber(cosDecimal))
                    return Math.floor(bigVest.toNumber())
                }
                return 0
            },

            getTop21BpNumber() {
                if (this.bpList.length > 0) {
                    let num = this.bpList.length
                    let minNum = 0
                    if (num >= bpNum) {
                        minNum = bpNum
                    } else {
                        minNum = num
                    }
                    return minNum
                }
                return 0
            },

            getTop21MinVestBp() {
                if (this.bpList.length > 0) {
                    let minNum = this.getTop21BpNumber()
                    let minVestBp = this.bpList[minNum-1]
                    return minVestBp
                }
                return null
            },

            getBpAccumulatedReward(bp) {
                //get accumulative reward(singleBlockReward * generatedBlock)
                if (this.checkBpInfoValid(bp)) {
                    let genBlkCnt = bp.getGenBlockCount()
                    let bigVal = BigNumber(genBlkCnt*singleBlkReward)
                    bigVal.decimalPlaces(6)
                    return bigVal.decimalPlaces(6).toNumber()
                }
                return 0
            },

            getMaxAccumulatedReward() {
                if (this.bpList.length > 0) {
                    let finalReward = BigNumber(0)
                    let top21Num = this.getTop21BpNumber()
                    for (let i = 0; i < top21Num; i++) {
                        let bp = this.bpList[i]
                        let genBlkNum = bp.getGenBlockCount()
                        let reward = BigNumber(singleBlkReward * genBlkNum)
                        if (finalReward.comparedTo(reward) < 0) {
                            finalReward = reward
                        }
                    }
                    return utility.numberAddComma(finalReward.decimalPlaces(6).toNumber())

                }
                return 0
            },

            getMaxAnnualizedRate() {
                if (this.bpList.length > 0) {
                    let minBpVest = this.getMinBpVest()
                    if (minBpVest > 0) {
                        let bigVest = BigNumber(minBpVest)
                        let bigYearReward = BigNumber(yearReward)
                        let rate = Math.floor(bigYearReward.dividedBy(bigVest).multipliedBy(BigNumber(100)).toNumber())
                        return rate + "%"
                    }
                }
                return "0%"
            },

            getMaxAnnualizedAccountName() {
                if (this.bpList.length > 0) {
                    let bp = this.getTop21MinVestBp()
                    return bp.getOwner().getValue()
                }
                return ""
            },

            getBpDesc(bp, rank) {
                if (this.checkBpInfoValid(bp)) {
                    let vestId = bp.getBpVest()
                    if (rank <= bpNum) {
                        return "Top-21"
                    } else {
                        if (vestId.getActive()) {
                            return "Standby"
                        }
                        return "Unregistered"
                    }

                }
                return ""
            },

            checkBpInfoValid(bp) {
                if (bp === null || typeof bp === "undefined") {
                    return false
                }
                return true
            },

            getBpVoteVest(bp) {
                if (utility.judgeIsNotEmpty) {
                    let oriVest = bp.getBpVest().getVoteVest()
                    console.log("origin vest is:", oriVest)
                    console.log("origin vest object is:", oriVest.toObject())
                    let strVest = oriVest.toString()
                    console.log("strVest is:", strVest)
                   return bp.getBpVest().getVoteVest().toString()
                }
                return ""
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
