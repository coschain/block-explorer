<style>
    .vue-blocks {
        background-color: white;
    }

    .vue-blocks .block {
        margin-right: 8px;
    }

    .vue-blocks .blkListHeader {
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

    .vue-blocks .blkListHeadBlockHeight {
        width: 40%;
    }

    .vue-blocks .blkListHeadTxCount {
        width: 10%;
    }

    .vue-blocks .blkListHeadOtherCol {
        width: 25%;
    }

    .vue-blocks .contentCol {
        display:inline-block;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
        font-size: 14px;
    }

    .vue-blocks .txContentCol {
        width: 10%;
    }

    .vue-blocks .blockHeightCol {
        width: 40%;
    }

    .vue-blocks .otherConCol {
        width: 25%;
    }

    .vue-blocks .blkNumCol {
        display:flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .vue-blocks .blkNumCol .blkNum {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex-shrink: 2;
    }

    .vue-blocks .blkNumCol .blkStatus {
        margin-left: 4px;
        flex-shrink: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .vue-blocks .icon {
        width: 18px;
        height: 18px;
    }

    .vue-blocks .blkStatusTitle {
        color: rgba(7, 166, 86, 1);
        font-size: 14px;
    }


    @media (max-width: 575.98px) {
        .vue-blocks .blkListHeader {
            font-size: 13px;
        }

        .vue-blocks .contentCol {
            font-size: 13px;
        }

        .vue-blocks .blkNumCol {
            font-size: 13px;
        }

        .vue-blocks .blkNumCol .blkStatus {
            font-size: 13px;
            flex-shrink: 1;
        }

        .vue-blocks .blkStatusTitle {
            font-size: 13px;
        }

        .vue-blocks .icon {
            width: 8px;
            height: 8px;
        }
    }
</style>

<template>
    <!-- https://etherscan.io/blocks -->
    <div class="vue-blocks fullfill">
        <vue-bread title="Blocks"></vue-bread>
        <template v-if="blocks.length">
            <div class="container maxPageTips">Display the latest 50 pages of data</div>
            <div  class="container">
                <!--<div class="align-items-center info-and-pagination mt20 row">-->
                <!--<div class="col info font-color-000000 font-24 font-bold title">-->
                <!--{{ numberAddComma(totalBlocks) }} blocks found-->
                <!--&lt;!&ndash; <span v-if="totalTxs > 500" class="font-color-555555 font-16" style="vertical-align: text-bottom;">(showing the last 500 records)</span> &ndash;&gt;-->
                <!--</div>-->
                <!--</div>-->

                <div class="explorer-table-container ">
                    <table class="mt20 explorer-table ">
                        <tr class=" blkListHeader font-12 font-bold font-color-000000">
                            <th class="blkListHeadBlockHeight">Height</th>
                            <th class="blkListHeadOtherCol">Time</th>
                            <th class="blkListHeadTxCount">txn</th>
                            <th class="blkListHeadOtherCol">Minted</th>
                        </tr>
                        <tr v-for="(block, i) in blocks" :key="i">
                            <td class="contentCol blockHeightCol">
                                <div class="blkNumCol">
                                    <router-link v-bind:to='fragApi + "/block/" + block.getBlockHeight()' class="blkNum" target="_blank">
                                        {{block.getBlockHeight()}}
                                    </router-link>
                                    <div v-if=judgeIsIrreversibleBlk(block.getBlockHeight()) class="blkStatus">
                                        <img class="icon" src="../../static/img/ic_tx_status_success.png" />
                                        <span class="blkStatusTitle" style="margin-left: 5px;">Confirmed</span>
                                    </div>
                                </div>
                            </td>
                            <td class="contentCol otherConCol">
                                <!--<div>-->
                                <!--<div class="font-color-000000 font-14">{{ timeConversion(Date.now()-block.toObject().timestamp.utcSeconds*1000) }} ago</div>-->
                                <!--<div class="down-arrow-tip">{{ new Date(block.toObject().timestamp.utcSeconds*1000).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ block.toObject().timestamp.utcSeconds*1000 }}</div>-->
                                <!--</div>-->
                                {{ timeConversion(Date.now()-block.toObject().timestamp.utcSeconds*1000) }} ago
                            </td>
                            <td class="contentCol txContentCol">
                                <router-link v-bind:to='fragApi + "/block-trxs/" + block.getBlockHeight()' target="_blank">
                                    <span >{{ numberAddComma(block.toObject().trxCount) }}</span>
                                </router-link>
                            </td>
                            <td class="contentCol otherConCol">
                                <router-link v-bind:to='fragApi + "/account/" + block.toObject().blockProducer.value' target="_blank">
                                    <span class="monospace">{{ block.toObject().blockProducer.value }}</span>
                                </router-link>
                            </td>
                        </tr>
                    </table>

                    <div v-if="isShowLoadMore" class="loadMore-container">
                        <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageData()">Load More</button>
                    </div>

                </div>
            </div>
        </template>
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                heightFrom: 0,
                heightTo: 0,
                totalBlocks: 0,
                blocks: [],
                blkStart:0,
                blkEnd:0,
                maxPageSizeLimit:30,
                isShowLoadMore: true,
                isFetching: false,//whether is fetching data from chain
                maxPageCount: 50,
            };
        },
        methods: {
            async nthPage(p) {
                this.$root.showModalLoading = true;
                if (parseInt(p) === 1) {
                    api.fetchStateInfo(info => {
                        if (info != null && typeof info.state.dgpo != "undefined" ) {
                            let irreversibleBlkNum = info.state.lastIrreversibleBlockNumber;
                            if (irreversibleBlkNum != null && typeof irreversibleBlkNum != "undefined" && irreversibleBlkNum > 0) {
                                this.irreversibleBlkNum = irreversibleBlkNum;
                                utility.updateIrreversibleBlkNum(info.state.lastIrreversibleBlockNumber);
                            }
                        }else {
                            console.log("blocks page:return empty props");
                        }
                    },(errCode,msg) => {
                        console.log("Get state info fail,error code is %s,msg is %s",errCode,msg);
                    });
                }

                if (p <= this.currentPage || p > this.maxPageCount) {
                    this.isFetching = false;
                    return;
                }
                let end = this.blkStart >= 1 ?this.blkStart -1:this.blkStart;
                let start = 0;
                let blkList = await api.fetchBlockList(start,end, this.maxPageSizeLimit);
                let cnt = blkList.length;
                if (cnt > 0) {
                    this.blocks = this.blocks.concat(blkList.reverse());
                    let listLen = blkList.length;
                    this.blkStart = blkList[listLen-1].getBlockHeight();
                    this.blkEnd = blkList[0].getBlockHeight();
                    this.currentPage = parseInt(p);
                }
                this.$root.showModalLoading = false;
                this.isShowLoadMore = this.currentPage < this.maxPageCount;
                this.isFetching = false;
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

            judgeIsIrreversibleBlk(blkNum) {
                return (BigNumber(blkNum).comparedTo(BigNumber(this.irreversibleBlkNum)) <= 0);
            },

            onClickLoadNextPageData() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.currentPage + 1);
            },
        },
        async mounted() {
            if (this.currentPage <= 1) {
                this.irreversibleBlkNum = this.$route.params.irreversibleBlkNum;
            }
            this.nthPage(1);
        },
        watch: {
            async $route() {
                await this.nthPage(1);
            }
        },

        destroyed() {
        }
    };
</script>
