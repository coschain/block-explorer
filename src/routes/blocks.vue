<style>
    .vue-blocks {
        background-color: white;
    }

    .vue-blocks .block {
        margin-right: 8px;
    }

    @media (max-width: 767.98px) {
        .vue-blocks .title {
            font-size: 20px;
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
            <div class="explorer-table-container">
                <table class="mt20 explorer-table list-table">
                    <tr class="list-header font-12 font-bold font-color-000000">
                        <th style="width: 20px;"></th>
                        <th style="width: 130px;">Height</th>
                        <th style="width: 130px;">Age</th>
                        <th style="padding-left: 20px">txn</th>
                        <th style="padding-left: 30px">Minted</th>
                        <th style="width: 20px;"></th>
                    </tr>
                    <tr v-for="(block, i) in blocks" :key="i">
                        <td></td>
                        <td>
                            <router-link v-bind:to='fragApi + "/block/" + block.id().blockNum()'>
                                <span class="font-14">{{ block.id().blockNum() }}</span>
                            </router-link>
                        </td>
                        <td class=time>
                            <div>
                                <div class="font-color-000000 font-14">{{ timeConversion(Date.now()-block.toObject().signedHeader.header.timestamp.utcSeconds*1000) }} ago</div>
                                <div class="down-arrow-tip">{{ new Date(block.toObject().signedHeader.header.timestamp.utcSeconds*1000).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ block.toObject().signedHeader.header.timestamp.utcSeconds*1000 }}</div>
                            </div>
                        </td>
                        <td style="padding-left: 20px">
                            <router-link v-bind:to='fragApi + "/txs?block=" + block.id().blockNum()'>
                                <span class="font-14">{{ numberAddComma(block.toObject().transactionsList.length) }}</span>
                            </router-link>
                        </td>
                        <td style="padding-left: 30px">
                            <router-link v-bind:to='fragApi + "/address/" + block.toObject().signedHeader.header.witness.value'>
                                <vue-blockies class="d-inline" v-bind:address='block.toObject().signedHeader.header.witness.value'></vue-blockies>
                                <span class="font-14 monospace">{{ block.toObject().signedHeader.header.witness.value }}</span>
                            </router-link>
                        </td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext ></vue-pagination>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility");

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
            "vue-blockies": require("@/components/vue-blockies").default
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
            nthPage() {
                var p = this.$route.query.p || 1;
                if (p == this.currentPage)
                    console.log("nthPage - request page", p, "request current page,ignore it");
                else {
                    this.$root.showModalLoading = true;
                    let end = this.blkStart > 1 ?this.blkStart -1:this.blkStart;
                    let start = 0;
                    let isNext = true;
                    if (this.pageSwitchType === 1) {
                        //fetch the pre page
                        let infoLen = this.blkPageInfo.length;
                        if (infoLen >= 2 && infoLen >= this.currentPage ) {
                            let info  = this.blkPageInfo[this.currentPage-2];
                            start = info.start;
                            end = info.end;
                        }
                        isNext = false;
                    }else  if (end >= this.maxPageSizeLimit) {
                        start = end - this.maxPageSizeLimit;
                    }
                    api.fetchBlockList(start,end, blkList => {
                        let cnt = blkList.length;
                        if (cnt > 0) {
                            this.blocks = blkList.reverse();
                            let listLen = blkList.length;
                            this.blkStart = this.blocks[listLen-1].id().blockNum();
                            this.blkEnd = this.blocks[0].id().blockNum();
                            if (isNext) {
                                if (this.currentPage+1 === this.totalPage) {
                                    this.totalPage += 1;
                                    let info = {start:this.blkStart,end:this.blkEnd};
                                    this.blkPageInfo.push(info);
                                }
                                this.currentPage += 1;
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

                }
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                this.pageSwitchType = 1;
                this.$router.push({
                    path: this.$route.path,
                    query: { p: 1 }
                });
            },
            onLast() {
                this.pageSwitchType = 0;
                this.$router.push({
                    path: this.$route.path,
                    query: { p: this.totalPage }
                });
            },
            onNext() {
                this.pageSwitchType = 0;
                this.$router.push({
                    path: this.$route.path,
                    query: { p: this.currentPage + 1 }
                });
            },
            onPrev() {
                this.pageSwitchType = 1;
                this.$router.push({
                    path: this.$route.path,
                    query: { p: this.currentPage - 1 }
                });
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
