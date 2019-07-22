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
        <div v-if="stateInfo" class="container vue-state-info-container">
            <div class="vue-state-info-head-separateLine"></div>

            <div class="vue-state-info-bg">
                <pre v-highlightjs><code class="vue-state-info-props">{{getStateInfoWithJsonFormat()}}</code></pre>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../assets/api";
    import utility from "../assets/utility";
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
        },

        data() {
            return {
                stateInfo: null,
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
                    this.$root.showModalLoading = false;
                },(errCode,msg) => {
                    console.log("Get state info fail,error code is %s,msg is %s",errCode,msg);
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    this.$root.showModalLoading = false;
                });
            },

            getStateInfoWithJsonFormat() {
                if (this.stateInfo != null && typeof this.stateInfo != "undefined") {
                    return JSON.stringify(this.stateInfo, null, 2);
                }
                return ""
            },

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
