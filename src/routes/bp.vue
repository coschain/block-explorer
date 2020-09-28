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
    const bpNum = 21;
    const cosDecimal = 1000000;

    //
    // TODO: yearReward & singleBlkReward & blockHistory MUST be updated every year.
    //
    const yearReward = 3681860; // year #2: (26880000 + 32100000 + 18339076) / 21
    const singleBlkReward = 2.451772; // year #2: (26880000 + 32100000 + 18339076) / (86400 * 365)

    // list of all {producer: [blocks, rewards]} of past years
    // currently year #1, i.e. from block #1 to #31,535,999 inclusive.
    const blockHistory = {
        "alogan": [930502, 1896940.917742],
        "astonmartin": [120655, 245969.816755],
        "bangrullezz": [430564, 877756.812244],
        "bentley": [73575, 149991.540075],
        "bidingtou": [16935, 34524.046635],
        "bigdaddy": [120398, 245445.891158],
        "bitruebp": [1181347, 2408318.802487],
        "blockcapitalbp": [63812, 130088.483252],
        "brazilbp": [781672, 1593532.954312],
        "brazilbp2": [423206, 862756.638926],
        "chainclubbp": [57180, 116568.348780],
        "cheezbp": [734028, 1496404.895388],
        "chickenwings": [829928, 1691908.649288],
        "confluxbp": [14158, 28862.796118],
        "contentosbp1": [932652, 1901323.952892],
        "contentosbp2": [703436, 1434039.401756],
        "contentosbp3": [343493, 700252.043153],
        "contentosbp4": [320687, 653759.252627],
        "contentosbrazil": [400702, 816879.511942],
        "contentoskorean": [435465, 887748.093765],
        "contentosrussia": [320407, 653188.438747],
        "cosbusbp": [79613, 162300.733673],
        "cosfinex": [262063, 534247.135123],
        "cosjiedian": [541605, 1104127.326705],
        "cosofficialbp1": [1174887, 2395149.310827],
        "cosofficialbp2": [1502197, 3062410.350337],
        "cosofficialbp3": [1501516, 3061022.049436],
        "cosofficialbp4": [1494568, 3046857.710728],
        "cosofficialbp5": [1502063, 3062137.175123],
        "cosofficialbp6": [1497461, 3052755.441281],
        "cosofficialbp7": [1502041, 3062092.325461],
        "costvbp": [1333812, 2719137.153252],
        "ferrari": [120375, 245399.002875],
        "gwz390": [152898, 311701.073658],
        "hamburger": [622308, 1268650.157268],
        "harmonybp": [885, 1804.179585],
        "helloworld": [228780, 466395.712380],
        "helloworld1": [18170, 37041.743570],
        "imbest": [576450, 1175163.075450],
        "indiancoser": [119038, 242673.366598],
        "initminer": [30, 61.158630],
        "jaguar": [86365, 176065.502665],
        "jessehellicon": [218340, 445112.509140],
        "jesuschrist": [12830, 26155.507430],
        "lambdabp": [1750, 3567.586750],
        "livemebp": [1463151, 2982810.354771],
        "mamonasbp": [21181, 43180.031401],
        "onesgamebp": [47488, 96810.034048],
        "photogridbp": [1501502, 3060993.508742],
        "raiblocks": [927345, 1890504.991245],
        "raiseprice": [283151, 577237.574771],
        "shanshuibp": [1905, 3883.573005],
        "sharktankviet": [561895, 1145490.946795],
        "spanishcoser": [205427, 418787.796167],
        "thinksmallgroup": [11899, 24257.551279],
        "thomashoang": [485479, 989707.684459],
        "valongo": [625, 1274.138125],
        "vickybp": [1388188, 2829989.208748],
        "vietnamcoser": [802556, 1636107.515276],
        "wuweishequbp": [49360, 100626.332560],
    };

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
                    let bpName = bp.getOwner().getValue();
                    let oldBlocks = 0;
                    let oldRewards = 0;
                    if (bpName in blockHistory) {
                        oldBlocks = blockHistory[bpName][0];
                        oldRewards = blockHistory[bpName][1];
                    }
                    let genBlkCnt = bp.getGenBlockCount() - oldBlocks;
                    let bigVal = BigNumber(genBlkCnt*singleBlkReward + oldRewards);
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
                        let bp = this.bpList[i];
                        let bpName = bp.getOwner().getValue();
                        let oldBlocks = 0;
                        let oldRewards = 0;
                        if (bpName in blockHistory) {
                            oldBlocks = blockHistory[bpName][0];
                            oldRewards = blockHistory[bpName][1];
                        }
                        let genBlkNum = bp.getGenBlockCount() - oldBlocks;
                        let reward = BigNumber(singleBlkReward * genBlkNum + oldRewards);
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
