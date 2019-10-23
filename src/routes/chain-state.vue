<style>
    .vue-chain-state {
        width: 100%;
        background-color: #f2f2f2;
    }

    .vue-state-info-container {
        width: 100%;
        background-color: white;
        border-radius: 4px;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .vue-state-info-head-separateLine {
        margin-top: 30px;
        height: 1px;
        background-color: #e8e8e8;
    }

    .vue-state-info-bg {
        background-color: #f7f9fa;
        border-radius: 4px;
        margin-top: 5px;
        margin-bottom: 30px;
    }

    .vue-state-info-bg .vue-state-info-props {
        word-break: break-word;
        word-wrap: break-word;
        padding: 15px;
        border-radius: 4px;
        background-color: #f7f9fa;
    }


    @media (max-width: 576px) {
        .vue-state-info-container {
            width: calc(100% - 30px);
        }

    }
</style>

<template>
    <div class="vue-chain-state fullfill">
        <vue-bread title="Global Dynamic Properties"></vue-bread>
        <div v-if="stateInfo" class="container vue-state-info-container listBg">
            <table class="explorer-table d-none d-md-table" style="table-layout: auto">
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Total COS:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ toCos(this.stateInfo.state.dgpo.totalCos.value)  }}
                    </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Total VEST:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ toVest(this.stateInfo.state.dgpo.totalVest.value) }}
                    </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Post Reward Pool:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ toCos(this.stateInfo.state.dgpo.poolPostRewards.value) }}
                    </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Reply Reward Pool:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ toCos(this.stateInfo.state.dgpo.poolReplyRewards.value) }}
                    </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Vote Reward Pool:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ toCos(this.stateInfo.state.dgpo.poolVoteRewards.value) }}
                    </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Account Create Fee:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ toCos(this.stateInfo.state.dgpo.accountCreateFee.value) }}
                    </td>
                </tr>
                <tr>
                    <td class="base-info-key font-16 font-color-555555 pl-16">Blocks losing rate:
                    </td>
                    <td class="font-16 font-color-000000">
                        {{ this.rate }} %
                    </td>
                </tr>
            </table>
            <div class="vue-state-info-bg">
                <highlight-code lang="json" class="vue-state-info-props">{{ getStateInfoWithJsonFormat() }}</highlight-code>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../assets/api";
    import utility from "../assets/utility";
    const cos_sdk = require("cos-grpc-js");
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
        },

        data() {
            return {
                stateInfo: null,
                rate: 0
            }
        },

        methods: {
            fetchCurrentChainState() {
                this.$root.showModalLoading = true;
                api.fetchStateInfo(info => {
                    if (info != null && typeof info.state.dgpo != "undefined" ) {
                        this.stateInfo = info;
                        utility.updateIrreversibleBlkNum(info.state.lastIrreversibleBlockNumber);
                    }else {
                        console.log("return empty props");
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                    this.calcBlocksLosingRate();
                    this.$root.showModalLoading = false;
                },(errCode,msg) => {
                    console.log("Get state info fail,error code is %s,msg is %s",errCode,msg);
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    this.$root.showModalLoading = false;
                });
            },

            async calcBlocksLosingRate () {
                let currentBlockNum = this.stateInfo.state.dgpo.headBlockNumber;
                if (currentBlockNum < 86400) {
                    return
                }
                let blockNum = currentBlockNum - 86400;
                try {
                    let oldBlocks = await api.fetchBlockList(blockNum + 1, blockNum + 1, 1);
                    if (oldBlocks.length > 0) {
                        let block = oldBlocks[0];
                        let delta = this.stateInfo.state.dgpo.time.utcSeconds - block.getTimestamp().getUtcSeconds() - 86400;
                        this.rate = (delta / 86400 * 100).toPrecision(2)
                    }
                } catch (e) {
                    console.log(e);
                }
            },

            getStateInfoWithJsonFormat() {
                if (this.stateInfo != null && typeof this.stateInfo != "undefined") {
                    return JSON.stringify(this.stateInfo, null, 2);
                }
                return ""
            },

            toCos(value) {
                let coin = new cos_sdk.raw_type.coin();
                coin.setValue('' + value);
                return coin.toString();
            },

            toVest(value) {
                let vest = new cos_sdk.raw_type.vest();
                vest.setValue('' + value);
                return vest.toString();
            }
        },

        filters: {
            pretty: function(value) {
                return JSON.stringify(value, null, 2);
            }
        },

        mounted() {
            this.fetchCurrentChainState();
        }
    }
</script>
