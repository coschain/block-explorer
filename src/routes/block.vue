<style>
    .vue-block {
        width: 100%;
        background-color: white;
    }
    .vue-block .table tbody tr td {
        border: 0;
        vertical-align: middle;
    }

    .vue-block td .pagination {
        margin: 0;
        vertical-align: top;
    }

    .vue-block tr>td:first-child {
        padding-left: 24px;
    }

    .vue-block tr>td:first-child::after {
        content: ":";
    }

    .vue-block .card {
        border: 0;
    }

    .vue-block .dynasty a {
        margin-bottom: 10px;
    }

    .Json-content {
        width: 100%;
        word-break: break-word;
        word-wrap: break-word;
    }

</style>
<template>
    <!-- https://etherscan.io/block/4951841 -->
    <div class="vue-block fullfill" v-bind:triggerComputed=urlChange>
        <vue-bread title='Block' :subtitle='this.blkHash'></vue-bread>
        <div v-if="blockInfo" class="container">
            <div class="font-24 font-bold font-color-000000 table-title">
                Overview
            </div>

            <div class="explorer-table-container d-none d-md-block">
                <table class="explorer-table  font-16" style="table-layout: auto">
                    <tr>
                        <td class="font-color-555555">Height</td>
                        <td class="font-color-000000">
                            <nav aria-label="Page navigation" class=navgation-tab>
                                <ul class=pagination>
                                    <li>
                                        <router-link v-if="blockInfo.hasBlockId() && judgeIsShowPre()" v-bind:to='fragApi + "/block/" + (+$route.params.id - 1)' aria-label=Previous>
                                            <span aria-hidden=true>&lt; Prev</span>
                                        </router-link>
                                        <span v-else style="color: #0057FF" >&lt;</span>
                                    </li>
                                    <li>&nbsp; {{$route.params.id}} &nbsp;</li>
                                    <li>
                                        <router-link v-if="blockInfo" v-bind:to='fragApi + "/block/" + (+$route.params.id + 1)' aria-label=Next>
                                            <span aria-hidden=true>Next &gt;</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </nav>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-color-555555">TimeStamp</td>
                        <td class="font-color-000000">{{ timeConversion(Date.now() - bTime) }} ago ({{ new Date(bTime).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ bTime }})</td>
                    </tr>
                    <tr>
                        <td class="font-color-555555">Transactions</td>
                        <td class="font-color-000000">
                            <!--<router-link v-bind:to='fragApi + "/txs?block=" + this.$route.params.id'>-->
                                <!--<span>{{ blockInfo.transactionsList.length }}</span>-->
                            <!--</router-link>-->
                            <router-link v-bind:to='fragApi + "/block-trxs/" + this.$route.params.id'>
                                <span>{{ blockInfo.toObject().trxCount }}</span>
                            </router-link>
                            <span>{{ blockInfo.toObject().trxCount > 1 ? "transactions" : "transaction" }} in this block</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-color-555555">Hash</td>
                        <td class="font-color-000000 monospace">{{ blockInfo.getBlockId().getHexHash()}}</td>
                    </tr>
                    <tr>
                        <td class="font-color-555555">Parent Hash</td>
                        <td>
                            <span class="font-color-000000 monospace">{{ blockInfo.getPreId().getHexHash()}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-color-555555">Minted</td>
                        <td>
                            <router-link v-bind:to='fragApi + "/account/" + blockInfo.toObject().blockProducer.value'>
                                <span class="monospace">{{ blockInfo.toObject().blockProducer.value }}</span>
                            </router-link>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-color-555555">Size</td>
                        <td>
                            <span class="font-color-000000">{{ formatBlockSize(blockInfo.toObject().blockSize) }}</span>
                        </td>
                    </tr>
                    <tr v-if="bftInfo">
                        <td class="font-color-555555">BFT Info</td>
                        <td>
                            <pre class="Json-content" v-html=convertBftInfoToJson()></pre>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="mobile-detail d-md-none">
                <div class="mobileCell">
                    <div class="font-color-555555"> Height:</div>
                    <div class="detail">
                        <nav aria-label="Page navigation" class=navgation-tab>
                            <ul class=pagination>
                                <li>
                                    <router-link v-if="blockInfo" v-bind:to='fragApi + "/block/" + (+$route.params.id - 1)' aria-label=Previous>
                                        <span aria-hidden=true>&lt; Prev</span>
                                    </router-link>
                                </li>
                                <li>&nbsp; {{$route.params.id}} &nbsp;</li>
                                <li>
                                    <router-link v-if="blockInfo" v-bind:to='fragApi + "/block/" + (+$route.params.id + 1)' aria-label=Next>
                                        <span aria-hidden=true>Next &gt;</span>
                                    </router-link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">TimeStamp:</div>
                    <div class="font-color-000000">{{ timeConversion(Date.now() - bTime) }} ago ({{ new Date(bTime).toString().replace('GMT', 'UTC').replace(/\(.+\)/gi, '') }} | {{ bTime }})</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Transactions:</div>
                    <div class="detail">
                        <router-link v-bind:to='fragApi + "/block-trxs/" + this.$route.params.id'>
                            <span>{{ blockInfo.toObject().trxCount }}</span>
                        </router-link>
                        tx in this block
                    </div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Hash:</div>
                    <div class="detail monospace">{{ blockInfo.getBlockId().getHexHash() }}</div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Parent Hash:</div>
                    <div class="detail">
                        <!--<router-link v-bind:to='fragApi + "/block/" + blockInfo.toObject().signedHeader.header.previous.hash'>-->
                            <span class="font-color-000000 monospace">{{ blockInfo.getPreId().getHexHash()}}</span>
                        <!--</router-link>-->
                    </div>
                </div>
                <div class="mobileCell">
                    <div class="font-color-555555">Minted:</div>
                    <div class="detail">
                        <!--<router-link v-bind:to='fragApi + "/address/" + block.miner.hash'>-->
                            <!--<span class="monospace">{{ blockInfo.signedHeader.header.witness.value }}</span>-->
                        <!--</router-link>-->
                        <router-link v-bind:to='fragApi + "/account/" + blockInfo.toObject().blockProducer.value'>
                            <span class="monospace">{{ blockInfo.toObject().blockProducer.value }}</span>
                        </router-link>
                    </div>
                </div>

                <div class="mobileCell">
                    <div class="font-color-555555">Size:</div>
                    <div>
                        <span class="font-color-000000 monospace">{{formatBlockSize(blockInfo.toObject().blockSize)}}</span>
                    </div>
                </div>

                <div v-if="bftInfo" class="mobileCell">
                    <div class="font-color-555555">BFT Info</div>
                    <div>
                        <pre class="Json-content" v-html=convertBftInfoToJson()></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    let BigNumber = require("bignumber.js");
    const api = require("@/assets/api"),
        utility = require("@/assets/utility");

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-tab-buttons": require("@/components/vue-tab-buttons").default
        },
        computed: {
          async urlChange() {
            this.$root.showModalLoading = true;
            //fetch block info
              try {
                  let blkInfo = await api.fetchBlockList(+this.$route.params.id+1,+this.$route.params.id+1, 1);
                  if (blkInfo.length > 0 ) {
                      this.blockInfo = blkInfo[0];
                      this.bTime = this.blockInfo.toObject().timestamp.utcSeconds*1000;
                      this.blkHash = this.blockInfo.getBlockId().getHexHash();
                  }

              }catch (err) {
                  console.log("fetch block fail,error is %s",err);
              }
              let bftInfo = await api.fetchBlockBFTInfo(this.$route.params.id)
              if (bftInfo.res) {
                  this.bftInfo = bftInfo.res
              } else {
                  console.log("Fail to fetch BFT Info,the error code is %s, the error msg is %s", bftInfo.errCode, bftInfo.errMsg)
              }
            this.$root.showModalLoading = false;
          }
        },
        methods: {
            judgeIsShowPre() {
                return BigNumber(this.$route.params.id).comparedTo(1) === 1;

            },

            showOrHideDynasty(){
                this.isShowDynasty = !this.isShowDynasty;
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            timeConversionSec(ms) {
                return utility.timeConversionSec(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            formatBlockSize(size) {
                return utility.formatBlkSize(size);
            },
            convertBftInfoToJson() {
                if (this.bftInfo != null && typeof this.bftInfo != 'undefined') {
                    let jsonStr = JSON.stringify(this.bftInfo.toObject(), null, 2)
                    return this.formatJson(jsonStr)
                }
            },

            formatJson(content) {
                if ((typeof content == "string") && content.length > 0) {
                    let abi = content.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
                    abi = abi.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                        var cls = 'number';
                        if (/^"/.test(match)) {
                            if (/:$/.test(match)) {
                                cls = 'Abi-key';
                            } else {
                                cls = 'Abi-Value';
                            }
                        } else if (/true|false/.test(match)) {
                            cls = 'boolean';
                        } else if (/null/.test(match)) {
                            cls = 'null';
                        }
                        return '<span class="' + cls + '">' + match + '</span>';
                    });
                    return abi;
                }
                return "";
            }
        },
        data() {
            return {
                block: null,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                tab: 0,
                tabButtons: ["Overview"],
                isShowDynasty: false,
                timestamp: Date.now(),
                blockInfo: null,
                bTime: null,
                blkHash: null,
                bftInfo: null,
            };
        }
    };
</script>
