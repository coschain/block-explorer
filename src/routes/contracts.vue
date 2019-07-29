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
            <div class="maxPageTips">Display the latest {{maxContractsPageNum}} pages of data</div>
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
                        <router-link v-if="contract.hasOwner()" v-bind:to='fragApi + "/account/" + contract.getOwner().getValue()' target="_blank">
                            <span>{{ contract.getOwner().getValue()}}</span>
                        </router-link>
                    </td>

                    <td class="contractContentCol">
                        <router-link v-if="contract.hasName()" class="font-14" v-bind:to='fragApi + "/contract-detail/"
                        + contract.getName().getValue() + "/" + contract.getOwner().getValue()' target="_blank">
                            <span>{{contract.getName().getValue()}}</span>
                        </router-link >
                    </td>
                    <td class="contractContentCol">
                        {{ timeConversion(Date.now()-contract.getCreateTime().getUtcSeconds()*1000) }} ago
                    </td>

                    <td class="contractContentCol">{{ contract.getBalance().toString()}}</td>
                    <td class="contractContentCol">{{ contract.getApplyCount()}}</td>

                </tr>
            </table>
        </div>
            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextContractData()">Load More</button>
            </div>
    </div>
        <!--<vue-nothing v-if="contractList && contractList.length === 0" title="0 contracts found"></vue-nothing>-->
    </div>
</template>
<script>
    let api = require("@/assets/api"),
        utility = require("@/assets/utility");
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
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
                contractList: [],
                pageInfo:[],
                account: null,
                firstPageStartTime: null,
                firstPageEndTime: null,
                createdPageIndex:0,
                isFetching: false,
                maxContractsPageNum: 50,
                isShowLoadMore: true,
            };
        },
        methods: {

            async nthPage(p) {
                if (p < this.currentPage || p > this.maxFollowingPageNum) {
                    return;
                }
                this.$root.showModalLoading = true;
                let start = this.listStart;
                let lastContract = this.lastContract;
                let result = await api.fetchContractListByTime(start, null, 30, lastContract);
                if  (result.res) {
                    let contractList = result.res;
                    if (contractList.length > 0) {
                        this.contractList = this.contractList.concat(contractList);
                        this.lastContract = contractList[contractList.length-1];
                        this.listStart = this.lastContract.getCreateTime();
                        if (this.currentPage === 0) {
                            this.listEnd = null;
                        }else {
                            this.listEnd = contractList[0].getCreateTime();
                        }
                        let curPageLen = this.pageInfo.length;
                        let info = {start:this.listStart,lastContract:this.lastContract};
                        if (curPageLen === 0 ) {
                            info.end = this.firstPageEnd;
                        } else {
                            if (curPageLen >= 1) {
                                info.end = this.pageInfo[curPageLen - 1].start;
                            }
                        }
                        this.currentPage = parseInt(p);
                        this.pageInfo.push(info);
                    }
                    this.$root.showModalLoading = false;
                    this.isShowLoadMore = this.currentPage < this.maxContractsPageNum;
                    this.isFetching = false;
                }else {
                    console.log("Get contracts list fail,error code is %s,msg is %s",result.errCode, result.errMsg);
                    this.isFetching = false;
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

            onClickLoadNextContractData() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.currentPage + 1);
            },
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
