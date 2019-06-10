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

    .vue-bp .bpListHeaderDetailCol {
        width: 28%;

    }

    .vue-bp .voteCountHeaderCol {
        width: 16%;
    }
    .vue-bp .witnessContentCol {
        display:inline-block;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-bp .detailContentCol {
        width: 28%;
    }

    .vue-bp .voteCountContentCol {
        width: 16%;
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
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="bpListHeader  font-bold font-color-000000">
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Account</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Time</th>
                        <th class="bpListHeaderCol bpListHeaderDetailCol">Vest</th>
                        <th class="bpListHeaderCol voteCountHeaderCol">Voted times</th>
                    </tr>

                    <tr v-for="(witness, i) in bpList" :key="i" >
                        <td class="witnessContentCol detailContentCol">
                            <router-link v-if="witness.hasOwner()" v-bind:to='fragApi + "/account/" + witness.getOwner().getValue()'>
                                <span>{{ witness.getOwner().getValue()}}</span>
                            </router-link>
                        </td>

                        <td class="witnessContentCol detailContentCol" v-if="witness.hasCreatedTime()">
                            {{ timeConversion(Date.now()-witness.getCreatedTime().getUtcSeconds()*1000) }} ago
                        </td>

                        <td class="witnessContentCol detailContentCol">{{ witness.getVoteCount().toString()}}</td>

                        <td class="witnessContentCol voteCountContentCol">{{ getVoterCountOfWitness(witness)}}</td>

                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                            v-on:prev=onPrev v-on:firstPage=onGoFirstPagePage></vue-pagination>
        </div>
        <vue-nothing v-if="bpList && bpList.length === 0" title="0 block producer found"></vue-nothing>
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility");
    const bpsCacheKey = utility.getPageCacheKey(utility.pageCacheType.bpList);
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
            "vue-blockies": require("@/components/vue-blockies").default,
            "vue-nothing": require("@/components/vue-nothing").default
        },
        data() {
            return {
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                totalPage: 1,
                listStart:null,
                listEnd:null,
                lastWitness:null,
                bpList: null,
                pageInfo:[],
                account: null,
                firstPageStartCount: null,
                firstPageEndCount: null,
                createdPageIndex:0,
            };
        },
        methods: {
            nav(n) {
                if (n < this.createdPageIndex && this.createdPageIndex >= this.currentPage) {
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
            async nthPage() {
                this.$root.showModalLoading = true;
                let p = this.$route.query.p || 1;
                let start = this.listStart;
                let isNext = true;
                let lastWitness = this.lastWitness;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage === 2 ) {
                        start = this.firstPageStartCount;
                        lastWitness= null;
                    }else {
                        let infoLen = this.pageInfo.length;
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.pageInfo[this.currentPage-3];
                            start = info.start;
                            lastWitness = info.lastWitness;
                        }
                    }
                    pReqType = 0;
                    isNext = false;
                }else if (this.currentPage === parseInt(p)) {
                    //refresh current page
                    pReqType = 3;
                }

                let result = await api.fetchWitnessListByVoteCount(start, null, 30, lastWitness);
                if  (result.res) {
                    let bpList = result.res;
                    if (bpList.length > 0) {
                        this.bpList = bpList;
                        this.lastWitness = bpList[bpList.length-1];
                        this.listStart = this.lastWitness.getVoteCount();
                        if (this.currentPage === 0 && isNext) {
                            this.listEnd = null;
                        }else {
                            this.listEnd = bpList[0].getVoteCount();
                        }
                        let curPageLen = this.pageInfo.length;
                        let info = {start:this.listStart,lastWitness:this.lastWitness};
                        if (curPageLen === 0 || (this.currentPage === 1 && pReqType === 3)) {
                            info.end = this.firstPageEnd;
                        }
                        if (pReqType === 1) {
                            if (this.currentPage + 1 === this.totalPage) {
                                this.totalPage += 1;
                                if (curPageLen >= 1) {
                                    info.end = this.pageInfo[curPageLen - 1].start;
                                }
                                this.pageInfo.push(info);

                            }else {
                                if (curPageLen >= 1 && this.currentPage <= curPageLen) {
                                    info.end = this.pageInfo[this.currentPage-1].start;
                                }
                                this.updateBpListPage(this.currentPage,info);
                            }
                            this.currentPage += 1;
                            if (this.createdPageIndex < this.totalPage) {
                                this.createdPageIndex += 1;
                            }
                        }else if (pReqType === 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 2 && this.currentPage <= curPageLen) {
                                info.end = this.pageInfo[this.currentPage-2].start;
                            }
                            this.updateBpListPage(this.currentPage-1,info);
                        }else if (pReqType === 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.savePageInfo();
                    this.$root.showModalLoading = false;
                }else {
                    console.log("Get bp list fail,error code is %s,msg is %s",result.errCode, result.errMsg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                }
            },

            updateBpListPage(index,info) {
                if (info && index >= 0 && index < this.pageInfo.length) {
                    this.pageInfo.splice(index,1,info);
                }
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
            onGoFirstPagePage() {
                if (this.currentPage > 1) {
                    let page = this.currentPage;
                    let p = this.$route.query.p;
                    if (parseInt(p) > page) {
                        page = parseInt(p);
                    }
                    this.currentPage = 2;
                    this.$router.go(1-page);
                }
            },

            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                cacheData.createdPageIndex = this.createdPageIndex;
                let listLen = this.pageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.pageInfo.forEach(function (info) {
                        let obj = {};
                        obj.start = info.start?info.start.getValue():null;
                        obj.end = info.end?info.end.getValue():null;
                        if (info.lastWitness) {
                            let lastWitness = {};
                            lastWitness.produder = info.lastWitness.getOwner().getValue();
                            lastWitness.voteCnt = info.lastWitness.getVoteCount().getValue();
                            obj.lastWitness = lastWitness;
                        }else {
                            obj.lastWitness = null;
                        }
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastWitness = null;
                }
                sessionStorage.setItem(bpsCacheKey,JSON.stringify(cacheData));
            },

            getPageInfo() {
                let info = sessionStorage.getItem(bpsCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                utility.removeComplexCacheKey(bpsCacheKey);
                if (sessionStorage.getItem(bpsCacheKey) != null) {
                    sessionStorage.removeItem(bpsCacheKey);
                }
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
            getContractsCacheData() {
                let cacheData = this.getPageInfo();
                let isQueryData = true;
                if (cacheData != null) {
                    this.currentPage = parseInt(cacheData.currentPage);
                    this.totalPage = parseInt(cacheData.totalPage);
                    this.createdPageIndex = parseInt(cacheData.createdPageIndex);
                    if (cacheData.pageInfo != null) {
                        let list = [];
                        cacheData.pageInfo.forEach(function (obj) {
                            let info = {};
                            if (obj.start != null) {
                                let startVest = new api.cos_sdk.raw_type.vest();
                                startVest.setValue(obj.start);
                                info.start = startVest;
                            }
                            if (obj.end != null ) {
                                let endVest = new api.cos_sdk.raw_type.vest();
                                endVest.setValue(obj.end);
                                info.end = endVest;
                            }
                            if (obj.lastWitness != null) {
                                let lastWitness = new api.cos_sdk.grpc.WitnessResponse();
                                let owner = new api.cos_sdk.raw_type.account_name();
                                owner.setValue(obj.lastWitness.produder);
                                lastWitness.setOwner(owner);
                                let voteCount = new  api.cos_sdk.raw_type.vest();
                                voteCount.setValue(obj.lastWitness.voteCnt);
                                lastWitness.setVoteCount(voteCount);
                                info.lastWitness = lastWitness;
                            }
                            list.push(info);
                        });
                        this.pageInfo = list;
                    }
                    this.loadData();
                    if (this.currentPage === 1) {
                        this.postListStart = null;
                        this.lastWitness = null;
                    }else if (this.currentPage >= 2 && this.pageInfo.length >= this.currentPage){
                        let lastWitness = this.pageInfo [this.currentPage-2];
                        this.listStart = lastWitness.start;
                        this.lastWitness = lastWitness.lastWitness;
                    }
                }else {
                    this.loadData();
                    let p = this.$route.query.p;
                    //now the chain not support page skip request,so in this condition just request from page 1
                    if (p > 1) {
                        let query = JSON.parse(window.JSON.stringify(this.$route.query));
                        query.p = 1;
                        this.currentPage = 0;
                        this.totalPage = 1;
                        this.$router.replace({ path: this.$route.path, query });
                        isQueryData = false;
                    }
                }
                return isQueryData;
            },

            getVoterCountOfWitness(witness) {
                if (witness != null && (typeof witness != "undefined") && witness.getVoterListList) {
                    return witness.getVoterListList().length;
                }
                return 0;
            }
        },
        mounted() {
            let isQuery = this.getContractsCacheData();
            if (isQuery) {
                this.nthPage();
            }
        },

        watch: {
            $route() {
                this.nthPage();
            }
        },
        beforeDestroy() {
            if (this.currentPage > 1) {
                this.createdPageIndex = this.currentPage;
                this.savePageInfo();
            }
        },
        destroyed() {
            if (this.currentPage <= 1) {
               this.clearCachePageInfo();
            }
        }
    };
</script>
