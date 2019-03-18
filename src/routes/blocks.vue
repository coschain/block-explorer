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

    .vue-blocks .blkListHeadCol {
        width: 25%;
    }

    .vue-blocks .contentCol {
        display:inline-block;
        width: 25%;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
        font-size: 14px;
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
            font-size: 2px;
        }

        .vue-blocks .contentCol {
            font-size: 2px;
        }

        .vue-blocks .blkNumCol {
            font-size: 2px;
        }

        .vue-blocks .blkNumCol .blkStatus {
            font-size: 1px;
            flex-shrink: 1;
        }

        .vue-blocks .blkStatusTitle {
            font-size: 1px;
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

        <div v-if="blocks" class="container mt20">
            <!--<div class="align-items-center info-and-pagination mt20 row">-->
                <!--<div class="col info font-color-000000 font-24 font-bold title">-->
                    <!--{{ numberAddComma(totalBlocks) }} blocks found-->
                    <!--&lt;!&ndash; <span v-if="totalTxs > 500" class="font-color-555555 font-16" style="vertical-align: text-bottom;">(showing the last 500 records)</span> &ndash;&gt;-->
                <!--</div>-->
            <!--</div>-->
            <div class="explorer-table-container ">
                <table class="mt20 explorer-table ">
                    <tr class=" blkListHeader font-12 font-bold font-color-000000">
                        <th class="blkListHeadCol">Height</th>
                        <th class="blkListHeadCol">Age</th>
                        <th class="blkListHeadCol">txn</th>
                        <th class="blkListHeadCol">Minted</th>
                    </tr>
                    <tr v-for="(block, i) in blocks" :key="i">
                        <td class="contentCol">
                            <div class="blkNumCol">
                                <router-link v-bind:to='fragApi + "/block/" + block.getBlockHeight()' class="blkNum">
                                    {{block.getBlockHeight()}}
                                </router-link>
                                <div v-if=judgeIsIrreverBlk(block.getBlockHeight()) class="blkStatus">
                                    <img class="icon" src="../../static/img/ic_tx_status_success.png" />
                                    <span class="blkStatusTitle" style="margin-left: 5px;">Success</span>
                                </div>
                            </div>
                        </td>
                        <td class="contentCol">
                            <!--<div>-->
                                <!--<div class="font-color-000000 font-14">{{ timeConversion(Date.now()-block.toObject().timestamp.utcSeconds*1000) }} ago</div>-->
                                <!--<div class="down-arrow-tip">{{ new Date(block.toObject().timestamp.utcSeconds*1000).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ block.toObject().timestamp.utcSeconds*1000 }}</div>-->
                            <!--</div>-->
                            {{ timeConversion(Date.now()-block.toObject().timestamp.utcSeconds*1000) }} ago
                        </td>
                        <td class="contentCol">
                            <router-link v-bind:to='fragApi + "/block-trxs/" + block.getBlockHeight()'>
                                <span >{{ numberAddComma(block.toObject().trxCount) }}</span>
                            </router-link>
                        </td>
                        <td class="contentCol">
                            <router-link v-bind:to='fragApi + "/account/" + block.toObject().witness.value'>
                                <span class="monospace">{{ block.toObject().witness.value }}</span>
                            </router-link>
                        </td>
                    </tr>
                </table>
            </div>
            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext  v-on:prev=onPrev v-on:homePage=onGoHome></vue-pagination>
        </div>
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    const blksPageCacheKey = utility.getPageCacheKey(utility.pageCacheType.blocksList);
    let irreversibleBlkNum = 0;
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                heightFrom: 0,
                heightTo: 0,
                totalBlocks: 0,
                totalPage: 1,
                blocks: null,
                blkStart:0,
                blkEnd:0,
                pageSwitchType:0,//0 fetch the next page ,1:fetch the pre page
                blkPageInfo:[],
                maxPageSizeLimit:30,
            };
        },
        methods: {
            async nthPage() {
                let p = this.$route.query.p || 1;

                this.$root.showModalLoading = true;
                let end = this.blkStart > 1 ?this.blkStart -1:this.blkStart;
                let start = 0;
                let isNext = true;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    let infoLen = this.blkPageInfo.length;

                    //fetch the pre page
                    if (this.currentPage === 2) {
                        start = 0;
                        end = 0;
                    }else {
                        if (infoLen >= 2 && infoLen >= this.currentPage ) {
                            let info  = this.blkPageInfo[this.currentPage-2];
                            start = info.start;
                            end = info.end;
                        }
                    }
                    pReqType = 0;
                    isNext = false;
                }else  if (p === this.currentPage) {
                    pReqType = 3;
                    start = this.blkStart;
                    end = this.blkEnd;
                }else  if (end >= this.maxPageSizeLimit) {
                    start = end - this.maxPageSizeLimit;
                }

                let blkList = await api.fetchBlockList(start,end, 30);
                let cnt = blkList.length;
                if (cnt > 0) {
                    this.blocks = blkList.reverse();
                    let listLen = blkList.length;
                    this.blkStart = this.blocks[listLen-1].getBlockHeight();
                    this.blkEnd = this.blocks[0].getBlockHeight();
                    if (pReqType === 1) {
                        if (this.currentPage+1 === this.totalPage) {
                            this.totalPage += 1;
                            let info = {start:this.blkStart,end:this.blkEnd};
                            this.blkPageInfo.push(info);
                        }
                        this.currentPage += 1;
                    }else if (pReqType === 0){
                        this.currentPage -= 1;
                    }else if (pReqType === 3) {
                        this.currentPage = parseInt(p);
                    }
                }
                this.$root.showModalLoading = false;
                this.savePageInfo();
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
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
            onGoHome() {
                this.$router.replace(utility.getTestNetName());
            },
            // onTo(n) {
            //     this.$router.push({
            //         path: this.$route.path,
            //         query: { p: n }
            //     });
            // },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                let listLen = this.blkPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.blkPageInfo.forEach(function (info) {
                        let obj = {};
                        obj.start = info.start;
                        obj.end = info.end;
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastInfo = null;
                }
                sessionStorage.setItem(blksPageCacheKey,JSON.stringify(cacheData));

            },
            getPageInfo() {
                let info = sessionStorage.getItem(blksPageCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                if (sessionStorage.getItem(blksPageCacheKey) != null) {
                    sessionStorage.removeItem(blksPageCacheKey);
                }
            },
            judgeIsIrreverBlk(blkNum) {
                if ( (this.irreversibleBlkNum) == -1 || (BigNumber(blkNum).comparedTo(BigNumber(this.irreversibleBlkNum)) <= 0) ) {
                    return true
                }else {
                    return false;
                }
            }
        },
        async mounted() {
            this.irreversibleBlkNum = this.$route.params.irreversibleBlkNum;
            let cacheData = this.getPageInfo();
            if (cacheData != null) {
                this.currentPage =  parseInt(cacheData.currentPage);
                this.totalPage = parseInt(cacheData.totalPage);
                if (cacheData.pageInfo != null) {
                    let list = [];
                    cacheData.pageInfo.forEach(function (obj) {
                        let info = {};
                        info.start = obj.start;
                        info.end = obj.end;
                        list.push(info);
                    });
                    this.blkPageInfo = list;
                }
                if (this.currentPage === 1) {
                    this.blkStart = 0;
                    this.blkEnd = 0;
                }else if (this.currentPage >= 2 && this.blkPageInfo.length >= this.currentPage){
                    let lastInfo = this.blkPageInfo[this.currentPage-1];
                    this.blkStart = lastInfo.start;
                    this.blkEnd = lastInfo.end;
                }

            }
            await this.nthPage();
        },
        watch: {
            async $route() {
                await this.nthPage();
            }
        },
        destroyed() {
            if (this.currentPage <= 1) {
                this.clearCachePageInfo();
            }
        }
    };
</script>
