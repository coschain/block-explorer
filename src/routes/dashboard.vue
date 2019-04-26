<style>
    .vue-dashboard {
        display: block;
        color: black;
        position: relative;
    }

    .vue-dashboard .black-header {
        position: absolute;
        top: -40px;
        width: 100%;
        height: 200px;
        z-index: -1;
    }

    .vue-dashboard>.container {
        margin-top: 40px;
    }

    .vue-dashboard .flex-row-container {
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-content: space-between;
        flex: none;
    }

    .vue-dashboard .text-light-gray {
        color: #A6A6A6;
    }

    .vue-dashboard .text-gray {
        color: #8D8D8D;
    }

    .vue-dashboard .w590 {
        width: 590px;
    }

    .vue-dashboard .w285 {
        width: 285px;
    }

    .vue-dashboard .ml30 {
        margin-left: 30px;
    }

    .vue-dashboard .row1 .flex-item {
        height: 320px;
    }

    .vue-dashboard .row2 .flex-item {
        height: 110px;
    }

    .vue-dashboard .row4 .flex-item {
        height: 476px;
    }

    .vue-dashboard .flex-item {
        position: relative;
    }

    .vue-dashboard .row>* {
        margin-bottom: 30px;
    }

    .vue-dashboard .atlaspAds-bottom>a>img {
        margin-bottom: 30px;
    }

    .vue-dashboard #atlaspAds-middle-mobile>a>img {
        margin-bottom: 30px;
    }

    @media (max-width: 767.98px) {
        .vue-dashboard .row>* {
            margin-bottom: 15px;
        }

        .vue-dashboard #atlaspAds-bottom {
            display: none;
        }

        .vue-dashboard #atlaspAds-middle-mobile>a>img {
            margin-bottom: 15px;
        }
    }

    .vue-dashboard .item-bg {
        background-color: white;
        width: 100%;
        height: 100%;
    }

    .vue-dashboard .item-shadow {
        box-shadow:10px 10px 20px 0px rgba(30,30,30,0.05);
    }

    .vue-dashboard .row1 .flex-item {
        box-shadow: none;
        background-color: initial;
    }

    .vue-dashboard .row1 .item-bg {
        position: relative;
        background:linear-gradient(135deg,rgba(33,45,128,1) 0%,rgba(24,19,93,1) 100%);
    }

    .vue-dashboard .item-title {
        position: absolute;
        left: 30px;
        top: 25px;
        font-size: 20px;
        font-weight: 600;
    }

    .vue-dashboard .row1 {
        color: white;
    }

    .vue-dashboard .row1 .item-title {
        color: white;
    }

    .vue-dashboard .daily-transactions .details {
        position: absolute;
        top: 20px;
        right: 30px;
        align-items: baseline;
        text-align: right;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
    }

    .vue-dashboard .daily-transactions .details *:nth-child(2) {
        font-size: 28px;
        color: white;
        font-weight: 400;
        margin-left: 10px;
        margin-top: 10px;
    }

    .vue-dashboard .daily-chart {
        position: absolute;
        top: 90px;
        height: 230px;
        width: calc(100% - 30px);
        margin-left: 30px;
    }

    .vue-dashboard .daily-echart-down-arrow {
        width: 0;
        height: 0;
        border-top: 4px solid #595C63;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        position: absolute;
        bottom: -4px;
        left: calc(50% - 4px);
        z-index: 1060;
    }

    .vue-dashboard .nas-price .update-time {
        position: absolute;
        top: 32px;
        right: 30px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
    }

    .vue-dashboard .tpsParts {
        display: flex;
        flex-direction: column;
        vertical-align: center;
        justify-items: center;
        justify-content: center;
    }

    .vue-dashboard .currentTps {
        display: flex;
        flex-direction: column;
        margin-left: 30px;

    }

    .vue-dashboard .currentTps .tpsTitle {
        font-size: 20px;
    }

    .vue-dashboard .currentTps .tpsValue {
        font-size: 16px;
    }

    .vue-dashboard .nas-price .detail {
        position: absolute;
        margin-top: 50px;
        margin-left: 30px;
        vertical-align: bottom;
    }
    .vue-dashboard .irreversible {
        position: absolute;
        margin-top: 130px;
        margin-left: 30px;
        vertical-align: bottom;
        font-size: 20px;
    }

    .vue-dashboard .irreversible .confirmTime {
        font-size: 16px;
    }

    .vue-dashboard .maxTPS {
        font-size: 20px;
        position: absolute;
        margin-top: 234px;
        margin-left: 30px;
    }

    .vue-dashboard .maxTPS .maxTpsValue {
        font-size: 16px;
    }

    .vue-dashboard .maxTPS .maxBlockNum {
        font-size: 16px;
        color: white;
        font-weight: 700;
        text-decoration: underline;
    }


    .vue-dashboard .nas-price .detail *:nth-child(1) {
        font-size: 16px;
    }

    .vue-dashboard .nas-price .detail *:nth-child(2) {
        font-size: 60px;
    }

    .vue-dashboard .nas-price .detail *:nth-child(3) {
        font-size: 20px;
        color: #2CEE8C;
    }

    .vue-dashboard .nas-price .detail .text-red {
        color: red;
    }

    .vue-dashboard .nas-price .market {
        position: absolute;
        margin-top: 234px;
        flex-flow: row nowrap;
        justify-content: flex-start;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
    }

    .vue-dashboard .nas-price .market .row div div {
        font-size: 28px;
        color: white;
    }

    @media (max-width: 575.98px) {
        .vue-dashboard .nas-price .market .row  div div {
            font-size: 22px;
        }
        .vue-dashboard .daily-transactions .details *:nth-child(2) {
            font-size: 12px;
        }
    }

    .vue-dashboard .nas-price .container {
        padding: 0 30px;
    }

    .vue-dashboard .realtime-blocks {
        position: absolute;
        top: 30px;
        left: 170px;
        right: 40px;
        height: 100px;
        /* overflow: hidden; */
        display: flex;
        flex-flow: row-reverse nowrap;
        justify-content: flex-start;
    }

    .vue-dashboard .realtime-block {
        position: relative;
        width: 15px;
        height: 100px;
        margin-left: 10px;
        background-color: #6C9EFF;
        transition: all 1000ms;
        display: none;
    }

    .vue-dashboard .realtime-block:first-child {
        background-color: #0057FF;
    }

    .vue-dashboard .realtime-block .blockheight {
        display: block;
        width: 15px;
        background-color: rgba(217, 230, 255, 1);
        transition: all 500ms;
        z-index: 3;
    }

    .vue-dashboard .realtime-block .block-popover {
        position: absolute;
        left: calc(-50% + 15px);
        top: -80px;
        padding: 8px;
        font-size: 12px;
        color: white;
        background-color: #0057FF;
        border-radius: 2px;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 1060;
        display: none;
    }

    .vue-dashboard .realtime-block .block-popover::before {
        content: "";
        width: 0;
        height: 0;
        border-top: 8px solid #0057FF;
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
        position: absolute;
        bottom: -4px;
        left: calc(50% - 8px);
        z-index: 2;
    }

    .vue-dashboard .realtime-block:hover .block-popover {
        display: block;
    }

    .vue-dashboard .row2 .flex-item {
        position: relative;
    }

    .vue-dashboard .row2 .flex-item .item-bg div:nth-child(1) {
        position: absolute;
        margin-top: 23px;
        margin-left: 30px;
        font-size: 28px;
        font-weight: 600;
    }

    .vue-dashboard .row2 .link-style {
        position: absolute;
        margin-top: 65px;
        margin-left: 30px;
        color: #7F7F7F;
        font-size: 12px;
    }

    .vue-dashboard .row2 img {
        position: absolute;
        top: 35px;
        right: 40px;
    }

    .vue-dashboard .row2 .flex-item:hover .link {
        color: rgba(0, 87, 255, 1)
    }

    .vue-dashboard .user-pie {
        display: block;
        position: absolute;
        margin-left: 50px;
        margin-top: 108px;
        background-color: gray;
        box-shadow:-10px 10px 20px 0px rgba(30,30,30,0.05);
    }

    .vue-dashboard .old-user {
        position: absolute;
        top: 20px;
        /* left: 20px; */
        width: 114px;
        height: 114px;
        background-color: rgba(89, 146, 255, 1);
        border-style: solid;
        border-width: 0px;
        border-radius: 50%;
    }

    .vue-dashboard .new-user-container {
        position: absolute;
        left: 57px;
        width: 77px;
        height: 154px;
        overflow: hidden;
    }

    .vue-dashboard .new-user {
        position: absolute;
        top: 0px;
        left: -77px;
        width: 154px;
        height: 154px;
        background-image: linear-gradient(to left, transparent 50%, #0057FF 0);
        border-style: solid;
        border-width: 0px;
        border-radius: 50%;
        transition-property: transform;
        transition-duration: 0.5s;
        transition-timing-function: ease;
    }

    .vue-dashboard .new-user-indicator {
        position: absolute;
        top: 20px;
        left: 57px;
        background: transparent;
        fill: none;
        stroke: none;
    }

    .vue-dashboard .new-user-indicator .line {
        fill: none;
        stroke: #000000;
        stroke-width: 0.5px;
        stroke-dasharray: 0px, 202px;
        animation: lineMove 1s ease-out 0.5s forwards;
    }

    @keyframes lineMove {
        0%{
            stroke-dasharray: 0px, 202px;
        }
        100%{
            stroke-dasharray: 202px, 202px;
        }
    }

    .vue-dashboard .new-user-indicator .labels {
        position: absolute;
        top: 0px;
        right: 0px;
        text-align: right;
    }

    .vue-dashboard .new-user-indicator .labels>div:first-child {
        margin-top: 31px;
        font-size: 18px;
        font-weight: 400;
        transform: translateY(12px);
        opacity: 0;
        animation: label 1s ease-out 1.5s forwards;
    }

    .vue-dashboard .new-user-indicator .labels>div:last-child {
        font-size: 12px;
        color: #555555;
        transform: translateY(-10px);
        opacity: 0;
        animation: label 1s ease-out 1.5s forwards;
    }

    @keyframes label {
        to {
            transform: translateY(0px);
            opacity: 1;
        }
    }

    .vue-dashboard .accounts-chart {
        position: absolute;
        top: 90px;
        width: calc(100% - 30px);
        height: 240px;
        margin-left: 30px;
    }

    .vue-dashboard .account-echart-down-arrow {
        width: 0;
        height: 0;
        border-top: 4px solid #0057FF;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        position: absolute;
        bottom: -4px;
        left: calc(50% - 4px);
        z-index: 1060;
    }

    .vue-dashboard .row4 .item-bg {
        position: relative;
        padding: 23px 30px;
    }

    .vue-dashboard .row4 .item-title {
        position: absolute;
        margin: 0;
    }

    .vue-dashboard .row4 .showall {
        position: absolute;
        top: 30px;
        right: 30px;
        font-size: 12px;
        font-weight: 400;
        color: #555;
    }

    .vue-dashboard .row4 .showall:hover {
        color: #0057FF
    }

    .vue-dashboard .row4 table {
        margin-top: 47px;
        width: 100%;
        font-size: 16px;
    }

    .vue-dashboard .row4 table tr {
        border: solid 1px;
        border-color: #F2F6F7;
    }

    .vue-dashboard .row4 tr {
        height: 74px;
    }

    .vue-dashboard .row4 td:first-child {
        width: 70px;
    }

    .vue-dashboard .row4 td:last-child {
        text-align: right;
    }

    .vue-dashboard .row4 td .time::after {
        content:'\A ';
        white-space:pre;
    }

    .vue-dashboard .row4 .flex-item .item-bg {
         overflow-y: hidden;
     }

    .vue-dashboard .row4 tr {
        transition: all 1s;
    }

    .vue-dashboard .row4 tr:nth-of-type(n+6) {
        opacity: 0;
    }

    .vue-dashboard #atlaspAds-side {
        position: fixed;
        top: 460px;
        left: calc((100% - 1140px) * 0.5 + 1140px + 5px);
        width: 300px;
        max-width: calc((100% - 1140px) * 0.5 - 25px);
    }

    @media (max-width: 320px) {
        .vue-dashboard .realtime-block:nth-of-type(-n+5) {
            display: block;
            opacity: 1;
        }

        .vue-dashboard .realtime-block:nth-of-type(5) {
            opacity: 0;
        }

        .vue-dashboard .row4 .txcnt {
            display: none;
        }
    }


    @media (max-width: 414px) {
        .vue-dashboard .row1 .data-source {
            visibility: hidden;
        }
    }

    @media (max-width: 575.98px) {
        .vue-dashboard .realtime-block:nth-of-type(-n+7) {
            display: block;
            opacity: 1;
        }

        .vue-dashboard .realtime-block:nth-of-type(7) {
            opacity: 0;
        }

        .vue-dashboard .user-pie {
            margin-left: 30px;
            margin-top: 128px;
        }

        .vue-dashboard .row4 table {
            font-size: 12px;
        }

        .vue-dashboard .row4 td:first-child {
            width: 60px;
        }

        .vue-dashboard .row4 td .time::after {
            content:'';
            white-space:pre;
        }
    }

     /* Small devices (landscape phones, 576px and up) */
    @media (min-width: 576px) {
        .vue-dashboard .realtime-block:nth-of-type(-n+14) {
            display: block;
            opacity: 1;
        }

        .vue-dashboard .realtime-block:nth-of-type(14) {
            opacity: 0;
        }
    }

    /* Medium devices (tablets, 768px and up) */
    @media (min-width: 768px) {
        .vue-dashboard .realtime-block:nth-of-type(-n+21) {
            display: block;
            opacity: 1;
        }

        .vue-dashboard .realtime-block:nth-of-type(21) {
            opacity: 0;
        }
    }

    /* Large devices (desktops, 992px and up) */
    @media (min-width: 992px) {
        .vue-dashboard .realtime-block:nth-of-type(-n+31) {
            display: block;
            opacity: 1;
        }

        .vue-dashboard .realtime-block:nth-of-type(31) {
            opacity: 0;
        }
    }

    /* Extra large devices (large desktops, 1200px and up) */
    @media (min-width: 1200px) {
        .vue-dashboard .realtime-block:nth-of-type(-n+38) {
            display: block;
            opacity: 1;
        }

        .vue-dashboard .realtime-block:nth-of-type(38) {
            opacity: 0;
        }
    }

    /* Large devices (desktops, 992px and up) */
    @media (min-width: 992px) and (max-width: 1199.98px) {
        .vue-dashboard .row2 .flex-item .item-bg div:nth-child(1) {
            font-size: 20px;
        }
    }

    .list-enter {
        opacity: 0;
        transform: translateX(100px);
    }

</style>
<template>
    <div class="vue-dashboard">
        <div class="bg-black black-header"></div>
        <div class="container">
            <!-- ====================1==================== -->
            <div class="row row1">
                <div class="daily-transactions flex-item col-12 col-lg-6 row1-item">
                    <div class="item-bg">
                        <div class="item-title" >Transactions Per Hour</div>
                        <!--<div class="details" v-if="hourTxChartOptions">-->
                            <!--<span v-if="todayTxCnt >= 0">Today</span>-->
                            <!--<span v-if="todayTxCnt >= 0">{{ numberAddComma(todayTxCnt) }}</span>-->
                        <!--</div>-->
                        <vchart class="daily-chart" v-if="hoursData.length > 0" :options="hourTxChartOptions" :autoResize='true'></vchart>
                    </div>
                </div>
                <div class="nas-price flex-item col-12 col-lg-6 row1-item">
                    <div class="item-bg">
                        <div class="item-title">TPS</div>
                        <!--<div v-if="stateInfo" class="update-time">Update Time : {{ timeConversion(Date.now() - stateInfo.time.utcSeconds*1000) }} ago</div>-->
                        <div v-if="stateInfo" class="detail">
                            <span>{{ stateInfo.tps }}</span>
                        </div>
                        <div v-if="confirmBlkTime" class="irreversible">
                            <div>Confirmation delay Time</div>
                            <div v-if="confirmBlkTime" class="confirmTime">{{ confirmBlkTime }} ago</div>
                        </div>

                        <div v-if="stateInfo" class="maxTPS">
                            <div> Max TPS</div>
                            <router-link v-if="stateInfo.maxTps > 0 && stateInfo.maxTpsBlockNum > 0" :to='fragApi + "/block/" + stateInfo.maxTpsBlockNum' class="maxBlockNum">{{ stateInfo.maxTps }}</router-link>
                            <div v-else-if="stateInfo.maxTps >= 0" class="maxTpsValue">{{ stateInfo.maxTps }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ====================2==================== -->
            <div class="row row2">
                <div class="col-lg-3 col-md-6 col-12 flex-item w285">
                    <div class="item-bg item-shadow">
                        <div v-if="stateInfo">{{ stateInfo.headBlockNumber }}</div>
                        <router-link v-if="stateInfo" class="link link-style" :to='fragApi + "/blocks/" + getLatestIrreversibleBlkNum()'>Block Height ></router-link>
                        <img src=/static/img/cos_block_height_icon.png width=44 alt="">
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-12 flex-item w285">
                    <div class="item-bg item-shadow">
                        <div v-if="stateInfo">{{ numberAddComma(stateInfo.totalTrxCnt) }}</div>
                        <router-link v-if="stateInfo" class="link link-style" :to='fragApi + "/txs/"'>Total Transactions ></router-link>
                        <img src=/static/img/cos_txs_icon.png width=44 alt="">
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-12 flex-item w285">
                    <div class="item-bg item-shadow">
                        <div v-if="stateInfo">{{ numberAddComma(stateInfo.totalPostCnt) }}</div>
                        <router-link v-if="stateInfo" class="link link-style" :to='fragApi + "/articles/"'>Total articles ></router-link>
                        <img src=/static/img/cos_articles_icon.png width='44' height='44' alt="">
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-12 flex-item w285">
                    <div class="item-bg item-shadow">
                        <div v-if="stateInfo">{{ numberAddComma(stateInfo.totalUserCnt) }}</div>
                        <router-link v-if="stateInfo" class="link link-style" :to='fragApi + "/accounts/"'>Total Accounts ></router-link>
                        <img src=/static/img/cos_accounts_icon.png width=44 alt="">
                    </div>
                </div>
            </div>
            <!-- ===================4===================== -->
            <div class="row row4">
                <div class="flex-item col-12 col-lg-6 row4-item">
                    <div class="item-bg item-shadow">
                        <div class="item-title">Blocks</div>
                        <router-link :to='fragApi + "/blocks/" + getLatestIrreversibleBlkNum() ' class="showall">View All ></router-link>
                        <transition-group name="list" tag="table" frame=hsides rules=rows>
                            <tr class="list-item" v-for="(block, i) in blocks" v-if="i < 5" :key="block.getBlockHeight()">
                                <td>
                                    <img src="/static/img/cos_block_logo.png" width="50" height="50">
                                </td>
                                <td>
                                    Block#
                                    <router-link :to='fragApi + "/block/" + block.getBlockHeight()' class="monospace">{{block.getBlockHeight()}}</router-link>
                                    <br>
                                    <span class="txcnt monospace">
                                        <router-link v-if="block.getTrxCount()" :to='fragApi + "/block-trxs/"
                                        + block.getBlockHeight()'>{{ block.getTrxCount() }}
                                            {{ block.getTrxCount() > 1 ? "transactions" : "transaction" }}</router-link>
                                        <span v-else>0 transaction</span>
                                    </span>
                                </td>
                                <td>
                                    <div class="time">{{ timeConversion(Date.now() - block.toObject().timestamp.utcSeconds*1000) }} ago</div>
                                </td>
                            </tr>
                        </transition-group>
                    </div>
                </div>
                <div class="flex-item col-12 col-lg-6 row4-item">
                    <div class="item-bg item-shadow">
                        <div class="item-title">Transactions</div>
                        <router-link :to='fragApi + "/txs/"' class="showall">View All ></router-link>
                        <transition-group name="list" tag="table" frame=hsides rules=rows>
                            <tr v-for="(tx, i) in txs" v-if="i < 5" :key="tx.toObject().trxId.hash">
                                <td>
                                    <img src="/static/img/cos_trx_logo.png" width="50" height="50">
                                </td>
                                <td>
                                    Hash#
                                    <router-link :to='fragApi + "/tx/" + tx.getTrxId().getHexHash()'>
                                        <!--<span class="monospace"> {{tx.getTrxId().getHexHash()}} </span>-->
                                        <span class="monospace"> {{trimTrxId(tx.getTrxId().getHexHash())}} </span>
                                    </router-link>
                                    <br>
                                    <span class="fromto d-sm-inline">
                                        From
                                        <router-link :to='fragApi + "/account/" + tx.getTrxWrap().getSigTrx().getTrx().sender()'>
                                            <span class="monospace">{{  tx.getTrxWrap().getSigTrx().getTrx().sender() }}</span>
                                        </router-link>
                                    </span>
                                </td>
                                <td>
                                    <div class="time">{{ timeConversion(Date.now() - tx.toObject().blockTime.utcSeconds*1000) }} ago</div>
                                </td>
                            </tr>
                        </transition-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const api = require("@/assets/api");
    const utility = require("@/assets/utility");
    const cos_sdk = require("cos-grpc-js");
    const BigNumber = require("bignumber.js");
    const ECharts = require('vue-echarts/components/ECharts').default;
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    import commonAlert from "../components/vue-tips-alert"
    import Vue from 'vue'
    module.exports = {
        components: {
            'vchart': ECharts,
            commonAlert
        },
        data() {
            return {
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                todayTxCnt: 0,
                // dailyTxData: [],
                hours: [],
                hoursData: [],
                blocks: [],
                staticInfo: null,
                txs: [],
                shortIntervalID: null,
                stateInfo: null,//chain props
                curTps: 0, //current tps
                maxTps: 0,//Historical max tps
                blkTotalNum:0,//total block number(block height)
                trxTotalNum:0, //total trx number
                articleTotalNum:0,//total article number
                accountTotalNum:0,//total account number
                curBlkNum: 0,
                trxStartTime:null,//the latest trx block time
                confirmBlkTime: null,
                byteToHex: utility.byteToHexStr,
                hexTobyte: utility.hexStrToByte,
                xaxis: 6,
                hiddenTopic:"hidden",
                visibilityChangeTopic:"visibilitychange",
            }
        },
        computed: {
            // dailyTxChartOptions() {
            hourTxChartOptions() {
                // if (!this.dailyTxData) return null;
                if (!this.hoursData.length > 0) return null;
                // let dates = [],
                //     nums = [];

                // this.dailyTxData.forEach(function (info) {
                //     if (info.date) {
                //         let date = new Date(info.date.utcSeconds*1000);
                //         let Y = date.getFullYear() + '-';
                //         let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                //         let D = date.getDate() + ' ';
                //         let dateStr = Y+M+D;
                //         dates.push(dateStr);
                //     }
                //     if (info.count) {
                //         nums.push(info.count);
                //     }else {
                //         nums.push(0);
                //     }
                // });

                let hours = this.hours.slice().reverse();
                let hoursData = this.hoursData.slice().reverse();

                let vm = this;

                return {
                    grid: {left: '40', bottom: '50', right: '17', top: '10', containLabel: false},
                    xAxis: {
                        data: hours,
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
                                return value + ':00'
                            },
                        }
                    },
                    yAxis: {
                        // min: 'dataMin',
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
                        data: hoursData,
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
                            // let date = new Date(params.name);
                            // let dateStr = date.toLocaleDateString('en', {
                            //     year: 'numeric',
                            //     month: 'short',
                            //     day: 'numeric'
                            // });
                            return  '<div>Transactions: ' + vm.numberAddComma(params.value) + '</div><div class=daily-echart-down-arrow></div>';
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
        },
        async mounted() {
            if (this.judgeIsUpdateSys()) {
                this.showUpgradeAlert();
            }
            this.addVisibleListener();
            utility.clearPagesInfoCache();
            utility.clearComplexCaches();
            //clear data when change rpc address
            this.$root.eBus.$on("changeRpcAddress",address => {
                // this.dailyTxData = [];
                this.hours = [];
                this.blocks = [];
                this.stateInfo = null;
                this.txs = [];
                this.curTps = 0;
                this.maxTps = 0;
                this.blkTotalNum = 0;
                this.trxTotalNum = 0;
                this.articleTotalNum = 0;
                this.accountTotalNum = 0;
                this.trxStartTime = null;
                this.curBlkNum = 0;
                this.confirmBlkTime = null;
            });

            this.loadData();
            this.setTimer();

        },
        methods: {
            judgeIsUpdateSys() {
                return utility.isUpdateSys;
            },

            showUpgradeAlert() {
                let tipsAlert = Vue.extend(commonAlert);
                let alert = new tipsAlert();
                let config = {};
                config.title = "Tips";
                config.content = "System upgrade, coming back soon";
                alert.showCommonAlert(config);
            },
            addVisibleListener() {
                if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
                    this.hiddenTopic = "hidden";
                    this.visibilityChangeTopic = "visibilitychange";
                } else if (typeof document.msHidden !== "undefined") {
                    this.hiddenTopic = "msHidden";
                    this.visibilityChangeTopic = "msvisibilitychange";
                } else if (typeof document.webkitHidden !== "undefined") {
                    this.hiddenTopic = "webkitHidden";
                    this.visibilityChangeTopic = "webkitvisibilitychange";
                }
                if (typeof document.addEventListener === "undefined" || typeof document[this.hiddenTopic] === "undefined") {
                    console.log("not support visibility listener");
                }else {
                    document.addEventListener(this.visibilityChangeTopic, this.handleVisibilityChange, false);
                }
            },

            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            formatTxsCount(num) {
                return utility.formatTxsCnt(num);
            },
            afterEnter: function (el) {
                let height = (1 - Math.min(5, Math.max(0, el.firstElementChild.dataset.txncnt)) / 5.0) * 100 + 'px';
                $(el.firstElementChild).css('height', height);
            },
            shortDate(value) {
                if (!value || value === 'undefined') {
                    return '';
                }
                let date = new Date(value);
                if (isNaN(date.getMonth())) {
                    return '';
                }
                let str = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                if (str.length > 6) {
                    str = date.getMonth() + 1 + '-' + date.getDate();
                }
                return str;
            },
            addLocalTimestamp(n) {
                if (n instanceof Array) {
                    for (let index in n) {
                        if (!n[index].localTimestamp) {
                            n[index].localTimestamp = Date.now();
                        }
                    }
                }
                return n;
            },
            trimTrxId(trxId) {
                if (trxId.length >= 20) {
                    return trxId.substr(0, 6) + "..." + trxId.substr(-6, 6)
                }
                return trxId;
            },

            getLatestIrreversibleBlkNum() {
                return utility.getIrreversibleBlkNum();
            },

            fetchChainStateInfo() {
                let currentTime = Date.now();
                api.fetchStateInfo(info => {
                    if (info != null && typeof info.state.dgpo != "undefined" ) {
                        this.stateInfo = info.state.dgpo;
                        let confirmTime = info.state.lastIrreversibleBlockTime;
                        if (confirmTime != null && typeof confirmTime != "undefined" && confirmTime > 0) {
                            this.confirmBlkTime = this.timeConversion(currentTime - confirmTime*1000);
                        }
                        utility.updateIrreversibleBlkNum(info.state.lastIrreversibleBlockNumber);
                    }else {
                        console.log("return empty props");
                    }
                },(errCode,msg) => {
                    console.log("Get state info fail,error code is %s,msg is %s",errCode,msg);
                });
            },
            async fetchBlocksList() {
                try {
                    let blkList = await api.fetchBlockList(parseInt(this.curBlkNum) + 1, 0, 5);
                    let cnt = blkList.length;
                    if (cnt > 0) {
                        for (let b of blkList) {
                            this.blocks.unshift(b)
                        }
                        if (this.blocks.length > 10) {
                            this.blocks.splice(10);
                        }
                        this.curBlkNum = this.blocks[0].getBlockHeight();
                        if (this.stateInfo) {
                            this.stateInfo.headBlockNumber = this.curBlkNum;
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
            },
            async statByHour(c_hours) {
                let stats = await api.statByHour(c_hours);
                let hours = [];
                let hoursData = [];
                let date = new Date();
                let offset = date.getTimezoneOffset() / 60;
                for (let stat of stats) {
                    let so = stat.toObject();
                    let utcHour = so.hour;
                    let hour = utcHour - offset;
                    if (hour < 0) {
                        hour += 24;
                    }
                    if (hour >= 24) {
                        hour -= 24;
                    }
                    let count = so.count;
                    if (hour < 10){
                        hour = '0' + hour
                    } else {
                        hour = '' + hour
                    }
                    hours.push(hour);
                    hoursData.push(count);
                }
                // newer in front
                this.hours = hours;
                this.hoursData = hoursData;
            },
            async fetchSpanTrxs(start, end, limit) {
                let s = null;
                let e = null;
                if (start !== 0) {
                    s = new cos_sdk.raw_type.time_point_sec();
                    s.setUtcSeconds(Math.ceil(start));
                }
                if (end !== 0) {
                    e = new cos_sdk.raw_type.time_point_sec();
                    e.setUtcSeconds(Math.ceil(end));
                }
                return api.fetchTrxListByTime(s, e, limit, null).catch((errCode,msg) => {
                    console.log("fetch trx list fail,error code is %s,msg is %s ",errCode,msg);
                });
            },
            // incrementTrxs(trxList) {
            //     let reversed = trxList.reverse();
            //     for (let trx of reversed) {
            //         this.txs.unshift(trx)
            //     }
            //     this.txs.splice(10);
            //     this.adjustmentHourData(trxList);
            // },
            // adjustmentHourData(trxs) {
            //     let hourStat = this.eachHourStat;
            //     for (let trx of trxs) {
            //         let hour = new Date(trx.getBlockTime()).getHours();
            //         if (hour < 10) hour = '0' + hour;
            //         else hour = '' + hour;
            //
            //         if (this.hours.indexOf(hour) >= 0) {
            //             hourStat[hour] += 1;
            //         }
            //         else {
            //             this.hours.unshift(hour);
            //             hourStat[hour] = 1;
            //             let expiredHour = this.hours.pop();
            //             delete hourStat[expiredHour];
            //         }
            //     }
            //     this.eachHourStat = hourStat;
            //     let hoursData = [];
            //     for (let hour of this.hours) {
            //         hoursData.push(this.eachHourStat[hour])
            //     }
            //     this.hoursData = hoursData;
            // }

            handleVisibilityChange() {
                if (document[this.hiddenTopic]) {
                    this.clearTimer();
                } else  {
                    this.loadData();
                    this.setTimer();
                }
            },
            setTimer() {
                this.clearTimer();
                this.shortIntervalID = setInterval( async () => {
                    //fetch latest trx list
                    let endTime = Date.now() / 1000;
                    // this.fetchTotalTrxList();
                    this.txs = await this.fetchSpanTrxs(0, 0, 5);
                    //fetch latest tps
                    this.fetchChainStateInfo();
                    //fetch latest blocks
                    await this.fetchBlocksList();
                    await this.statByHour(6);
                }, 5000);

            },
            clearTimer() {
                if(this.shortIntervalID != null && typeof this.shortIntervalID != "undefined") {
                    clearInterval(this.shortIntervalID);
                    this.shortIntervalID = null;
                }
            },
            async loadData() {
                //fetch state info
                this.fetchChainStateInfo();
                //fetch latest block list
                await this.fetchBlocksList();
                //fetch total trx in recent 6 hours
                await this.statByHour(6);
                this.txs = await this.fetchSpanTrxs(0, 0, 5);
            }

        },
        updated() {
            if (window.isIE()) {
                $('#svg-line').css('stroke-dasharray', 'none');
            }
        },
        destroyed() {
            // clearInterval(this.shortIntervalID);
            this.clearTimer();
            document.removeEventListener(this.visibilityChangeTopic, this.handleVisibilityChange, false);
        }
    }
</script>

