<template>
    <div class="vue-contract-input">
        <div class="fieldDesc">
            <slot name="fieldDesc">
                <div>{{fieldDesc}}:</div>
            </slot>
        </div>

        <div v-if="dataList.length > 0" class="inputContainer">
            <li class="dropdown">
                <div role=button  data-toggle=dropdown class="fieldInput dropDownBox" >
                    <input class="content" :id=fieldDesc v-bind:value="curValue" readonly/>
                    <div class="arrow-down"></div>
                </div>
                <ul class="dropdown-menu dropDownBoxListMenu">
                    <template v-for="(val) in dataList">
                        <li class="list-group-item" @click="selectNewValue(val)">{{val}}</li>
                    </template>
                </ul>
            </li>
        </div>
        <div v-else class="inputContainer">
            <slot name="input">
                <input class="fieldInput"  autocomplete="off" v-bind:value=curValue :id=fieldDesc
                       :disabled="!editable" type="text" :oninput="isPureNumber?'if(parseInt(value)<1)value=1;if(parseInt(value)>100)value=100':''"
                       v-bind:onKeyUp='isPureNumber?numFormat:"value=value"' />
            </slot>
        </div>
    </div>
</template>

<script>
    const editType = {
        editTypeNormal: 0,//normal type
        editTypeDesc: 1, //with Type description
    };
    export default {
        name: "vue-contract-input",
        props: {

            editable: {
                type: Boolean,
                default: true,
            },

            curType: {
                type: Number,
                default: 0
            },
            curValue: String,

            dataList: {
                type: Array,
                default: function () {
                    return [];
                },
            },

            fieldDesc: {
                type: String,
                default: "",
            },

            isPureNumber: {
                type: Boolean,
                default: false,
            }

        },
        data() {
            return {
                numFormat: "value=value.replace(/[^0-9]/ig,'')",
            }
        },

        methods: {
            getCurrentValue() {
                let fieldInput = document.getElementById(this.fieldDesc);
                let curVal = fieldInput.value;
                return curVal;
            },

            selectNewValue(value) {
                let fieldInput = document.getElementById(this.fieldDesc);
                if (fieldInput.value !== value) {
                    fieldInput.value = value;
                    let obj = {
                        fieldDesc: this.fieldDesc,
                        value: value,
                    };
                    this.$emit("switchValue", obj);
                }
            },

        }
    }
</script>

<style scoped>
    .vue-contract-input {
        display: flex;
        display: -ms-flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
    }

    .fieldDesc {
        text-align: right;
        color: rgba(0,0,0,.85);
        width: 30%;
        word-wrap: break-word;
        word-break: break-word;
    }

    .inputContainer {
        width: 70%;
        margin-left: 4px;
        border-radius: 4px;
        list-style: none;
    }

    .fieldInput {
        padding-left: 5px;
        padding-right: 5px;
        box-sizing: border-box;
        width: 100%;
        height: 35px;
        border-radius: 4px;
        border: 1px solid lightgrey;
        outline-color: #579fff;
    }

    input:disabled {
         background-color: #f5f5f5;
    }

    .inputList {
        position: absolute;
        transform: translateZ(0px);
        background-color: red;
        z-index: 100;
    }

    .inputListItem {
        width: 100%;
        position: relative;;
    }

    .dropDownBox {
        display: flex;
        display: -ms-flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
    }

    .dropDownBox:active {
        outline-color: #579fff;
    }

    .dropDownBox .content {
        width: calc(100% - 20px);
        border: none;
        outline: none;
    }

    .dropDownBoxListMenu {
        min-width: 100%;
        padding: 0;
        margin-top: -2px;
    }

    .list-group-item:active {
        background: #eee;
    }
    .list-group-item:hover{
        background: #eee;
    }

    .arrow-down {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #bfbfbf;
        margin-left: 5px;
    }

    @media (max-width: 576px) {
        .vue-contract-input {
            display: flex;
            display: -ms-flex;
            flex-direction: column;
        }

        .fieldDesc {
            text-align: left;
            width: 100%;
            margin-bottom: 5px;
        }

        .inputContainer {
            width: 100%;
            margin: 0;
        }

    }
</style>
