<style>
    .vue-contracts {
        background-color: white;
    }

    .vue-contracts .contractListHeader {
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
    .vue-contracts .contractListHeaderCol {
        width: 20%;
    }

    .vue-contracts .contractContentCol {
        display:inline-block;
        width: 20%;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }
    
</style>
<template>
    <div class="vue-contracts fullfill">
        <vue-bread title="Contracts"></vue-bread>
        <div v-if="contractList && contractList.length" class="container mt20">
        <div class="explorer-table-container">
            <table class="mt20 explorer-table">
                <tr class="contractListHeader  font-bold font-color-000000">
                    <th class="contractListHeaderCol">Owner</th>
                    <th class="contractListHeaderCol">Name</th>
                    <th class="contractListHeaderCol">Time</th>
                    <th class="contractListHeaderCol">Balance</th>
                    <th class="contractListHeaderCol">Apply Count</th>
                </tr>

                <tr v-for="(contract, i) in contractList" :key="i">
                    <td class="contractContentCol">
                        <router-link v-if="contract.hasOwner()" v-bind:to='fragApi + "/account/" + contract.getOwner().getValue()'>
                            <span>{{ contract.getOwner().getValue()}}</span>
                        </router-link>
                    </td>

                    <td class="contractContentCol">
                        <router-link v-if="contract.hasName()" class="font-14" v-bind:to='fragApi + "/contract-detail/"
                        + contract.getName().getValue() + "/" + contract.getOwner().getValue()'>
                            <span>{{contract.getName().getValue()}}</span>
                        </router-link>
                    </td>
                    <td class="contractContentCol">
                        {{ timeConversion(Date.now()-contract.getCreateTime().getUtcSeconds()*1000) }} ago
                    </td>

                    <td class="contractContentCol">{{ contract.getBalance().toString()}}</td>
                    <td class="contractContentCol">{{ contract.getApplyCount()}}</td>

                </tr>
            </table>
        </div>

        <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                        v-on:prev=onPrev v-on:firstPage=onGoFirstPagePage></vue-pagination>
    </div>
        <vue-nothing v-if="contractList && contractList.length === 0" title="0 contracts found"></vue-nothing>
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility");
    const contractsCacheKey = utility.getPageCacheKey(utility.pageCacheType.contractsList);
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
                listStart:null,
                listEnd:null,
                lastContract:null,
                contractList: null,
                pageInfo:[],
                account: null,
                firstPageStartTime: null,
                firstPageEndTime: null,
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
                let lastContract = this.lastContract;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage === 2 ) {
                        start = this.firstPageStart;
                        lastContract= null;
                    }else {
                        let infoLen = this.pageInfo.length;
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.pageInfo[this.currentPage-3];
                            start = info.start;
                            lastContract = info.lastContract;
                        }
                    }
                    pReqType = 0;
                    isNext = false;
                }else if (this.currentPage === parseInt(p)) {
                    //refresh current page
                    pReqType = 3;
                }

                let result = await api.fetchContractListByTime(start, null, 30);
                if  (result.res) {
                    let contractList = result.res;
                    if (contractList.length > 0) {
                        this.contractList = contractList;
                        this.lastContract = contractList[contractList.length-1];
                        this.listStart = this.lastContract.getCreateTime();
                        if (this.currentPage === 0 && isNext) {
                            this.listEnd = null;
                        }else {
                            this.listEnd = contractList[0].getCreateTime();
                        }
                        let curPageLen = this.pageInfo.length;
                        let info = {start:this.listStart,lastContract:this.lastContract};
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
                                this.updateContractsListPage(this.currentPage,info);
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
                            this.updateContractsListPage(this.currentPage-1,info);
                        }else if (pReqType === 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.savePageInfo();
                    this.$root.showModalLoading = false;
                }else {
                    console.log("Get contracts list fail,error code is %s,msg is %s",result.errCode, result.errMsg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                }
            },

            updateContractsListPage(index,info) {
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
                        obj.start = info.start?info.start.getUtcSeconds():null;
                        obj.end = info.end?info.end.getUtcSeconds():null;
                        if (info.lastContract) {
                            let lastContract = {creTime:info.lastContract.getCreateTime().getUtcSeconds()};
                            lastContract.cOwner = info.lastContract.getOwner().getValue();
                            lastContract.cName = info.lastContract.getName().getValue();
                            obj.lastContract = lastContract;
                        }else {
                            obj.lastContract = null;
                        }
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastContract = null;
                }
                sessionStorage.setItem(contractsCacheKey,JSON.stringify(cacheData));
            },

            getPageInfo() {
                let info = sessionStorage.getItem(contractsCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                utility.removeComplexCacheKey(contractsCacheKey);
                if (sessionStorage.getItem(contractsCacheKey) != null) {
                    sessionStorage.removeItem(contractsCacheKey);
                }
            },
            convertOpActionsToStr(actionArray) {
                if (actionArray.length) {
                    return actionArray.join(",");
                }
                return ""
            },
            loadData() {
                let name = this.$route.params.account;
                let accountName = new api.cos_sdk.raw_type.account_name();
                accountName.setValue(name);
                this.account = accountName;
                let startTime = new api.cos_sdk.raw_type.time_point_sec();
                startTime.setUtcSeconds(Math.ceil(Date.now()/1000)+2*86400);
                this.firstPageStartTime = startTime;
                let endTime = new api.cos_sdk.raw_type.time_point_sec();
                endTime.setUtcSeconds(1);
                this.firstPageEndTime = endTime;
            },
            getContractsCacheData() {
                let cacheData = this.getPageInfo();
                if (cacheData != null) {
                    this.currentPage = parseInt(cacheData.currentPage);
                    this.totalPage = parseInt(cacheData.totalPage);
                    this.createdPageIndex = parseInt(cacheData.createdPageIndex);
                    if (cacheData.pageInfo != null) {
                        let list = [];
                        cacheData.pageInfo.forEach(function (obj) {
                            let info = {};
                            if (obj.start != null) {
                                let start = new api.cos_sdk.raw_type.time_point_sec();
                                start.setUtcSeconds(obj.start);
                                info.start = start;
                            }
                            if (obj.end != null ) {
                                let end = new api.cos_sdk.raw_type.time_point_sec();
                                end.setUtcSeconds(obj.end);
                                info.end = end;
                            }
                            if (obj.lastContract != null) {
                                let lastContract = new api.cos_sdk.grpc.ContractInfo();
                                let time = new api.cos_sdk.raw_type.time_point_sec();
                                time.setUtcSeconds(obj.lastContract.creTime);
                                lastContract.setCreateTime(time);

                                let owner = new api.cos_sdk.raw_type.account_name();
                                owner.setValue(obj.lastContract.cOwner);
                                lastContract.setOwner(owner);

                                let cName = new api.cos_sdk.raw_type.account_name();
                                cName.setValue(obj.lastContract.cName);
                                lastContract.setName(cName);

                                info.lastContract = lastContract;
                            }
                            list.push(info);
                        });
                        this.pageInfo = list;
                    }
                    this.loadData();
                    if (this.currentPage === 1) {
                        this.postListStart = null;
                        this.lastContract = null;
                    }else if (this.currentPage >= 2 && this.pageInfo.length >= this.currentPage){
                        let lastContract = this.pageInfo [this.currentPage-2];
                        this.listStart = lastContract.start;
                        this.lastContract = lastContract.lastContract;
                    }
                }else {
                    this.loadData()
                }
            }
        },
        mounted() {
            this.getContractsCacheData();
            this.nthPage();
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
