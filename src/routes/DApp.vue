<style>
    .vue-DApp {
        width: 100%;
        background-color: #f2f2f2;
        position: relative;
    }

    .vue-DApp-container {
        background-color: white;
        border-radius: 4px;
        width: 100%;
    }

    .vue-DApp-tabContainer {
        width: 100%;
        font-size: 16px;
        overflow: scroll;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: white;
        margin-top: 20px;
        border-bottom: solid 1px #e8e8e8;
    }

    .vue-DApp-tab {
        color: black;
        display: inline-block;
        height: 100%;
        padding: 12px 16px;
        margin: 0 32px 0 0;
        box-sizing: border-box;
    }

    .vue-DApp-tab:active {
        color: #1890ff;
    }

    .vue-DApp-tab:hover {
        color: #1890ff;
    }

    .vue-DApp-tab-select {
        color: #1890ff;
        font-weight: bold;
        border-bottom-color: #1890ff;
        border-bottom-width: 2px;
        border-bottom-style: solid;
    }

    .vue-DApp-chart-bg {
        margin-top: 30px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        align-items: flex-start;
        justify-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
    }

    .vue-DApp-chart-bg .chartContainer {
        margin-bottom: 30px;
        width: 100%;
    }


    .singleChart {
        top: 20px;
        color: rgba(255, 255, 255, 0.7);
        height: 320px;
        width: 100%;
        background:linear-gradient(135deg,rgba(33,45,128,1) 0%,rgba(24,19,93,1) 100%);
    }

    .vue-DApp .detailChart {
        top: 90px;
        height: 230px;
        width: calc(100% - 30px);
        margin-left: 30px;
    }

    .vue-DApp .item-title {
        position: absolute;
        left: 30px;
        top: 25px;
        font-size: 20px;
        font-weight: 600;
    }

    .vue-DApp .titleHead {
        background-color: #f7f7f7;
        overflow: auto;
        padding: 10px 0;
    }

    .vue-DApp .titleBg {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
    }

    .vue-DApp .dnuDesc {
        margin-top: 10px;
        color: #858585;
        font-size: 14px;
        width: 100%;
        word-break: break-word;
        word-wrap: break-word;
    }

    @media (max-width: 576px) {
        .vue-DApp .item-title {
            font-size: 16px;
        }

        .vue-DApp-container {
           width: calc(100% - 20px);
        }

        .vue-DApp .detailChart {
            width: calc(100% - 10px);
            margin-left: 5px;
        }
    }

</style>

<template>
   <div class="vue-DApp fullfill" v-bind:triggerComputed=loadData>
       <!--<vue-header title="All DApps">-->
       <!--</vue-header>-->
       <div class="titleHead">
           <div class="container">
               <div class="row align-items-center">
                   <div class="titleBg">
                       <div class="col-auto bread-title font-40 font-bold font-color-000000">All DApp</div>
                       <router-link  v-bind:to='fragApi + "/testDApp/"'>
                           <span>Dapp data from last TestNet update</span>
                       </router-link>
                   </div>

               </div>
           </div>
       </div>

       <div class="container vue-DApp-container">
           <!--tab-->
           <div class="vue-DApp-tabContainer">
               <template v-for="(type) in dAppsArray">
                   <div :class= '[selectType === type ? "vue-DApp-tab vue-DApp-tab-select" : "vue-DApp-tab" ]' @click="switchDAppType(type)">{{fetchTabTitle(type)}}</div>
               </template>
           </div>
           <!--charts-->
           <div class="vue-DApp-chart-bg">
               <template v-for="(type) in chartsArray">
                   <div class="chartContainer col-12 col-lg-6">
                       <div class="singleChart">
                           <div class="item-title" >{{fetchTitleFromType(type)}}</div>
                           <charts class="detailChart" :options=fetchChartOptions(type) :autoResize='true'></charts>
                       </div>

                       <template v-if="type === chartsArray[2]">
                           <div class="dnuDesc">*The new user refers to the number of accounts activated today, not fully representing the user's visit today.</div>
                       </template>
                   </div>
               </template>
           </div>
       </div>
   </div>
</template>

<script>
    import pHead from "../components/vue-bread";
    import ECharts from "vue-echarts/components/ECharts";
    import {DAppType,formatTxsCnt,numberAddComma} from "../assets/utility";
    import api from "../assets/api";
    import BigNumber from "bignumber.js";
    const chartType =  {
        chartTypeDAU : 0, // every day DAU of recent 30 days
            chartTypeNewAcct: 1, // every day new account of recent 30 days
            chartTypeTxCnt: 2, // every day tx count of recent 30 day
            chartTypeTxAmount: 3,// every day tx amount of recent 30 day
            chartTypeTotalUser: 4, //total user count
            chartTypeMau: 5, //mau
    };

    const days = 30;

    module.exports = {
        data() {
           return {
               selectType: this.getDefaultType(),
               // dAppsArray: [DAppType.DAppTypePg, DAppType.DAppTypeCos, DAppType.DAppType2048, DAppType.DAppTypeWalkcoin],
               dAppsArray: this.getDAppList(),
               chartsArray: [chartType.chartTypeTotalUser,chartType.chartTypeDAU, chartType.chartTypeNewAcct, chartType.chartTypeTxCnt,
                   chartType.chartTypeTxAmount, chartType.chartTypeMau],
               statList: [],
               statMList: [],
               fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
           }
        },

        components: {
            "vue-header": pHead,
            "charts": ECharts,
        },

        methods: {
            getDefaultType() {
                //test env default is pg, main net default is costv
                let ty = this.checkIsProduction() ? DAppType.DAppTypeCos : DAppType.DAppTypePg;
                return ty;
            },


            checkIsProduction() {
                if (process.env.NODE_ENV === 'production')  {
                    return true
                }
                return false
            },

            getDAppList() {
                if (this.checkIsProduction())  {
                    return [DAppType.DAppTypeCos, DAppType.DAppTypePg];
                }
                return [DAppType.DAppTypePg, DAppType.DAppTypeCos, DAppType.DAppType2048, DAppType.DAppTypeWalkcoin];
            },

            convertStampToMMDD(date) {
                if (!date || date === 'undefined') {
                    return '';
                }
                let t = new Date(date);
                if (isNaN(t.getMonth())) {
                    return '';
                }
                let str = t.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                if (str.length > 6) {
                    str = t.getMonth() + 1 + '-' + t.getDate();
                }
                return str;
            },
            convertStampToMM(date) {
                if (!date || date === 'undefined') {
                    return '';
                }
                let t = new Date(date);
                if (isNaN(t.getMonth())) {
                    return '';
                }
                let str = t.toLocaleDateString('en', { month: 'short' });
                if (str.length > 6) {
                    str = t.getMonth() + 1;
                }
                return str;
            },

            formatTxsCount(num) {
                return formatTxsCnt(num);
            },

            numberAddComma(n) {
                return numberAddComma(n);
            },

            switchDAppType(type) {
                if (this.selectType !== type) {
                    this.selectType = type;
                    if (this.statList && this.statList.length > 0){
                        this.statList.splice(0, this.statList.length);
                    }
                    this.loadData(type);
                }
            },

            fetchTitleFromType(type) {
                if (type === chartType.chartTypeDAU) {
                    return "Daily Active User";
                } else if (type === chartType.chartTypeNewAcct) {
                    return "Daily New User";
                } else if (type === chartType.chartTypeTxCnt) {
                    return "Transactions Per Day";
                } else if (type === chartType.chartTypeTxAmount) {
                    return "Transaction Amount Per Day";
                } else if (type === chartType.chartTypeTotalUser) {
                    return "Total User Count";
                } else if (type === chartType.chartTypeMau) {
                    return "Monthly Active User";
                }
                return ""
            },

            getDAppNameByType(type) {
                if (type != null && typeof type != "undefined") {
                    if (type === DAppType.DAppTypePg) {
                        return "photogrid";
                    } else if (type === DAppType.DAppTypeCos) {
                        return "contentos";
                    } else if (type === DAppType.DAppType2048) {
                        return "game 2048";
                    } else if (type === DAppType.DAppTypeWalkcoin) {
                        return "walk coin";
                    }
                }
                return "";
            },

            fetchTabTitle(type) {
                if (type === DAppType.DAppTypePg) {
                    return "PhotoGrid";
                } else if (type === DAppType.DAppTypeCos) {
                    return "COS.TV";
                } else if (type === DAppType.DAppType2048) {
                    return "Game2048";
                } else if (type === DAppType.DAppTypeWalkcoin) {
                    return "WalkCoin";
                }
                return ""
            },

            fetchChartOptions(type) {
                if ((this.chartsArray.indexOf(type) === -1) || this.statList.length < 1) {
                    return {};
                }

                let vm = this;
                let tips = "DAU:";
                let dateArray = [];
                let dataArray = [];
                if (type === chartType.chartTypeMau) {
                    for (let stat of this.statMList) {
                        let date = this.convertStampToMM(stat.getDate()*1000);
                        dateArray.push(date);
                        let data = stat.getMau();
                        tips = "Mau:";
                        dataArray.push(data);
                    }
                } else {
                    for (let stat of this.statList) {
                        let date = this.convertStampToMMDD(stat.getDate()*1000);
                        dateArray.push(date);
                        let data = stat.getDau();
                        if (type === chartType.chartTypeNewAcct) {
                            data = stat.getDnu();
                            tips = "DNU:";
                        } else if (type === chartType.chartTypeTxCnt) {
                            data = stat.getTrxs();
                            tips = "Transactions:";
                        } else if (type === chartType.chartTypeTxAmount) {
                            data = BigNumber(stat.getAmount()).div(1000000).toFixed(0);
                            tips = "Transaction Amount:"
                        } else if (type === chartType.chartTypeTotalUser) {
                            data = stat.getTotalUserCount();
                            tips = "Total User Count:"
                        }

                        dataArray.push(data);
                    }
                }

                //console.log(dateArray);
                //console.log(dataArray);
                if (dateArray.length < 1 || dataArray.length < 1) {
                    return {};
                }

                return {
                    grid: {left: '40', bottom: '50', right: '17', top: '10', containLabel: false},
                    xAxis: {
                        data: dateArray,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#B2B2B2'
                            },
                            margin: 18,
                            formatter: function (value) {
                                // return vm.shortDate(value);
                                return value;
                            },
                        }
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#B2B2B2'
                            },
                            margin: 0,
                            formatter: function (value) {
                                return vm.formatTxsCount(value);
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                    },
                    series: {
                        type: 'line',
                        data: dataArray,
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        lineStyle: {
                            color: '#595C83',
                            width: 3
                        },
                        itemStyle: {
                            color: '#C0C0C0',
                            borderWidth: 3
                        },
                        areaStyle: {
                            color: '#595C93',
                            opacity: 1
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        transitionDuration: 0,
                        position: 'top',
                        formatter: function (params, ticket, callback) {
                            let val = tips +  vm.numberAddComma(params.value);
                            let t = "Date:" + params.name;
                            return  '<div>' + val + '</div><div class=daily-echart-down-arrow></div>' + '<div>'+ t + '</div>';
                        },
                        backgroundColor: '#595C63',
                        padding: 8,
                        extraCssText: 'border-radius: 2px;box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);',
                        textStyle: {
                            fontFamily: 'menlo, consolas',
                            fontSize: 12,
                            lineHeight: 18
                        }
                    }
                };
            },

            async loadData(type) {
                if (type == null || typeof type == "undefined") {
                    type = DAppType.DAppTypePg;
                    if (this.checkIsProduction()) {
                        type = DAppType.DAppTypeCos
                    }
                }
                this.$root.showModalLoading = true;
                let dApp = this.getDAppNameByType(type);
                if (dApp.length < 1) {
                    this.$root.showModalLoading = false;
                    return;
                }
                let result = await api.fetchDailyStats(dApp, days);
                if (result.res) {
                    let list = result.res;
                    if (list.length) {
                        this.statList = list;
                    }else {
                        console.log("Get empty list of  ", dApp);
                    }
                } else {
                    console.log("error code is:", result.errCode);
                    console.log("error msg is:", result.errMsg);
                }

                let result1 = await api.fetchMonthlyStats(dApp, 12);
                if (result1.res) {
                    let list = result1.res;
                    console.log(list);
                    if (list.length) {
                        this.statMList = list;
                    }else {
                        console.log("Get empty list of  ", dApp);
                    }
                } else {
                    console.log("error code is:", result.errCode);
                    console.log("error msg is:", result.errMsg);
                }

                this.$root.showModalLoading = false;
            },

        },

        mounted() {
            console.log("select type is:", this.selectType)
            this.loadData(this.selectType);
        },

        computed: {

        }

    }
</script>
