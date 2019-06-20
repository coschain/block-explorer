<style>
    .vue-TestDApp {
        width: 100%;
        background-color: #f2f2f2;
        position: relative;
    }

    .vue-TestDApp-container {
        background-color: white;
        border-radius: 4px;
        width: 100%;
    }

    .vue-TestDApp-tabContainer {
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

    .vue-TestDApp-tab {
        color: black;
        display: inline-block;
        height: 100%;
        padding: 12px 16px;
        margin: 0 32px 0 0;
        box-sizing: border-box;
    }

    .vue-TestDApp-tab:active {
        color: #1890ff;
    }

    .vue-TestDApp-tab:hover {
        color: #1890ff;
    }

    .vue-TestDApp-tab-select {
        color: #1890ff;
        font-weight: bold;
        border-bottom-color: #1890ff;
        border-bottom-width: 2px;
        border-bottom-style: solid;
    }

    .vue-TestDApp-chart-bg {
        margin-top: 30px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        align-items: center;
        justify-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
    }

    .vue-TestDApp-chart-bg .chartContainer {
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

    .vue-TestDApp .detailChart {
        top: 90px;
        height: 230px;
        width: calc(100% - 30px);
        margin-left: 30px;
    }

    .vue-TestDApp .item-title {
        position: absolute;
        left: 30px;
        top: 25px;
        font-size: 20px;
        font-weight: 600;
    }

    @media (max-width: 576px) {
        .vue-TestDApp .item-title {
            font-size: 16px;
        }

        .vue-TestDApp-container {
            width: calc(100% - 20px);
        }

        .vue-TestDApp .detailChart {
            width: calc(100% - 10px);
            margin-left: 5px;
        }
    }

</style>

<template>
    <div class="vue-TestDApp fullfill" v-bind:triggerComputed=loadLocalDAppData>
        <vue-header title="Dapp data"></vue-header>
        <div class="container vue-TestDApp-container">
            <!--tab-->
            <div class="vue-TestDApp-tabContainer">
                <template v-for="(name) in dAppList">
                    <div :class= '[selectDApp === name ? "vue-TestDApp-tab vue-TestDApp-tab-select" : "vue-TestDApp-tab" ]' @click="switchDAppType(name)">{{name}}</div>
                </template>
            </div>
            <!--charts-->
            <div class="vue-TestDApp-chart-bg">
                <template v-for="(type) in chartsArray">
                    <div class="chartContainer col-12 col-lg-6">
                        <div class="singleChart">
                            <div class="item-title" >{{fetchTitleFromType(type)}}</div>
                            <charts class="detailChart" :options=fetchChartOptions(type) :autoResize='true'></charts>
                        </div>
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
    import * as dappData from "../dAppData";
    const chartType =  {
        chartTypeDAU : 0, // every day DAU of recent 30 days
        chartTypeNewAcct: 1, // every day new account of recent 30 days
        chartTypeTxCnt: 2, // every day tx count of recent 30 day
        chartTypeTxAmount: 3,// every day tx amount of recent 30 day
        chartTypeTotalUser: 4, //total user count
    };

    const days = 30;

    module.exports = {
        data() {
            return {
                selectDApp: "",
                chartsArray: [chartType.chartTypeTotalUser,chartType.chartTypeDAU, chartType.chartTypeNewAcct, chartType.chartTypeTxCnt,
                    chartType.chartTypeTxAmount],
                dAppList: [],
                statList: [],
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                pgDataList: [],
                cosList: [],
                dataMap: null,
            }
        },

        components: {
            "vue-header": pHead,
            "charts": ECharts,
        },

        methods: {
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

            formatTxsCount(num) {
                return formatTxsCnt(num);
            },

            numberAddComma(n) {
                return numberAddComma(n);
            },

            switchDAppType(name) {
                if (this.selectDApp !== name) {
                    this.selectDApp = name;
                    if (this.statList && this.statList.length > 0){
                        this.statList.splice(0, this.statList.length);
                    }
                    this.selectDApp = name;
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
                let list = this.getSelectedDAppData();
                if (list == null || !(list instanceof Array)) {
                    return {};
                }

                let vm = this;
                let tips = "DAU:";
                let dateArray = [];
                let dataArray = [];
                for (let stat of list) {
                    let date = this.convertStampToMMDD(BigNumber(stat.date).multipliedBy(1000).toNumber());
                    dateArray.push(date);
                    let data = stat.dau;
                    if (type === chartType.chartTypeNewAcct) {
                        data = stat.dnu;
                        tips = "DNU:";
                    } else if (type === chartType.chartTypeTxCnt) {
                        data = stat.trxs;
                        tips = "Transactions:";
                    } else if (type === chartType.chartTypeTxAmount) {
                        data = BigNumber(stat.amount).div(1000000).toFixed(1);
                        tips = "Transaction Amount:"
                    } else if (type === chartType.chartTypeTotalUser) {
                        data = stat.tusr;
                        tips = "Total User Count:"
                    }

                    dataArray.push(data);
                }

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

            loadLocalDAppData() {
                let nameList = Object.getOwnPropertyNames(dappData);
                let index = nameList.indexOf("default");
                if (index > -1) {
                    nameList.splice(index, 1);
                }
                if (nameList.length > 0) {
                    this.dAppList = nameList;
                    this.selectDApp = nameList[0];
                    for (let i = 0; i < nameList.length; i++)  {
                        let name = nameList[i];
                        let list = this.getSingleDAppDataFromLocal(name);
                        if (list &&  list instanceof Array) {
                            if (!this.dataMap)  {
                                this.dataMap = {}
                            }
                            this.dataMap[name] = list;
                        }
                    }
                }

            },

            getSingleDAppDataFromLocal(dApp) {
                if (dappData.hasOwnProperty(dApp)) {
                    return dappData[dApp];
                }
                return null
            },

            getSelectedDAppData() {
                if (this.dataMap) {
                    if (this.dataMap.hasOwnProperty(this.selectDApp)) {
                        let list = this.dataMap[this.selectDApp];
                        if (list && (list instanceof Array) && list.length > 30) {
                            return list.slice(list.length-30);
                        }
                        return list;
                    }
                }
                return null
            }


        },

        mounted() {
            this.loadLocalDAppData();
        },

        computed: {

        }

    }
</script>
