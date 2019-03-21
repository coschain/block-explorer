<template>
    <div class="vue-modify-rpc-bg">
        <div class="vue-modify-rpc-card">
            <div class="vue-modify-rpc-header">
                <slot name="header">
                    <div class="vue-modify-rpc-headerTitle">Change RPC Address</div>
                    <button class="vue-modify-rpc-close" @click="close">X</button>
                </slot>
            </div>

            <div class="vue-modify-rpc-body">
                <slot name="body">
                    <!-- Input -->
                    <input  type = "text" autocomplete="off" :placeholder="defaultRpc" v-bind:value=currentAddress class= "vue-modify-rpc-input" id="rpcAddress"/>
                </slot>
            </div>

            <div class="vue-modify-rpc-footer">
                <slot name="footer">
                    <button class="vue-modify-rpc-btn" @click="changeRpcAddress">Confirm</button>
                    <button class="vue-modify-rpc-btn" @click="close">Cancel</button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "vue-modify-rpc",
        props:["currentAddress"],
        data() {
            return {
                rpcAddress: "",
                defaultRpc: process.env.VUE_APP_CHAIN
            }
        },
        methods: {
            close: function () {
                let input = document.getElementById("rpcAddress");
                input.value = "";
                this.$emit('close');

            },
            changeRpcAddress: function () {
                let input = document.getElementById("rpcAddress");
                let value = input.value;
                input.value = "";
                this.$emit("changeRpcAddress",value)
            }
        }
    }
</script>

<style scoped>
    .vue-modify-rpc-bg {
        position: fixed;
        top: 0; right: 0;
        bottom: 0; left: 0;
        background-color: rgba(0,0,0,.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100000;
    }

    .vue-modify-rpc-card {
        background-color: #fff;
        box-shadow: 2px 2px 20px 1px;
        overflow-x:auto;
        display: flex;
        width: 50%;
        flex-direction: column;
    }

    .vue-modify-rpc-body {
        background-color: white;
        width: 100%;
    }

    .vue-modify-rpc-input {
        color: black;
        font-size: 18px;
        width: calc(100% - 10px);
        margin-left: 5px;
    }
    .vue-modify-rpc-header {
        padding: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid #eee;
        justify-content: space-between;
    }

    .vue-modify-rpc-headerTitle {
        font-size: 20px;
        color: black;
        text-align: center;
        width: calc(100% - 40px);
    }

    .vue-modify-rpc-footer {
        border-top: 1px solid #eee;
        justify-content: space-around;
        display: flex;
        flex-direction: row;
        padding: 15px;
    }

    .vue-modify-rpc-btn {
        color: black;
        font-size: 17px;
        border-color: black;
    }

    .vue-modify-rpc-close {
        border: none 0;
        font-size: 20px;
        cursor: pointer;
        font-weight: bold;
        color: red;
        margin-right: 5px;
        margin-left: 20px;
    }

    @media (max-width:  576px) {
        .vue-modify-rpc-headerTitle {
            font-size: 8px;
        }

        .vue-modify-rpc-close {
            font-size: 8px;
        }

        .vue-modify-rpc-btn {
            font-size: 7px;
        }

        .vue-modify-rpc-input {
            font-size: 4px;
        }
    }
</style>
