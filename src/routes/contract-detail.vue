<style>
    .vue-contractDetail {
        width: 100%;
        background-color: #f2f2f2;
        position: relative;
    }

    .vue-contractDetail-container {
        background-color: white;
        border-radius: 4px;
    }

    .vue-contractDetail-contentBg {
        display: flex;
        flex-direction: column;
    }
    .vue-contractDetail-contentBg .vue-contractDetail-tabContainer {
        width: 100%;
        font-size: 16px;
        overflow: scroll;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: white;
        border-bottom: solid 1px #e8e8e8;
    }

    .vue-contractDetail-tab {
        color: black;
        display: inline-block;
        height: 100%;
        padding: 12px 16px;
        margin: 0 32px 0 0;
        box-sizing: border-box;
    }

    .vue-contractDetail-tab:active {
        color: #1890ff;
    }

    .vue-contractDetail-tab:hover {
        color: #1890ff;
    }

    .vue-contractDetail-tab-select {
        color: #1890ff;
        font-weight: bold;
        border-bottom-color: #1890ff;
        border-bottom-width: 2px;
        border-bottom-style: solid;
    }

    .contract-Json-bg {
        background-color: #f7f9fa;
        border-radius: 4px;
        padding: 20px;
        margin-top: 10px;
        margin-bottom: 30px;
    }

    .contract-Json-bg .Json-content {
        width: 100%;
        height: 100%;
        word-break: break-word;
        word-wrap: break-word;
    }
    .Abi-key {
        color: red;
    }

    .Abi-Value {
        color: green;
    }

    .vue-contractDetail-useContract-tabContainer {
        margin-top: 80px;
    }

    .vue-contractDetail-operate-bg {
        margin-top: 20px;
        background-color: white;
        width: 100%;
        padding-left: 30px;
        padding-right: 30px;
    }

    .vue-contractDetail-operate-bg .filedList {
        width: 100% ;
        padding-left: 10px;
        padding-right: 10px;
        display: block;
        box-sizing: border-box;
    }

    .vue-contractDetail-operate-bg .filedList .singleField {
        position: center;
        width: 82%;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .vue-contractDetail-operate-bg .submitBg{
        margin-top: 30px;
        margin-bottom: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vue-contractDetail-operate-bg .submitBtn {
        outline: none;
        border: none;
        padding-left: 50px;
        padding-right: 50px;
        box-shadow: none;
    }

    .vue-contractDetail-queryResult-bg {
        width: 100%;
        margin-top: 20px;
        margin-bottom: 50px;
    }

    .vue-contractDetail-switchContainer {
        display: flex;
        display: -ms-flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
    }

    .vue-contractDetail-resultListHeader {
        display: -ms-flex;
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: rgba(247, 247, 247, 1);
    }

    .vue-contractDetail-resultListHeader-col {
        font-size: 14px ;
        color: rgba(0,0,0,.85);
        font-weight: 500;
        padding-left: 15px;
    }

    .vue-contractDetail-resultList-content {
        display:flex;
        flex-direction: row;
        height: 50px;
        font-size: 14px ;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        border-top: 1px solid #e8e8e8;
    }

    .vue-contractDetail-resultList-content-col {
        padding-left: 15px;
        color: rgba(85, 85, 85, 1);
    }

    @media (max-width: 576px) {
        .vue-contractDetail-container {
            width: calc(100% - 30px);
        }

        .vue-contractDetail-operate-bg {
            padding: 0;
        }

        .vue-contractDetail-operate-bg .filedList .singleField {
            width: 100%;
        }
    }
</style>

<template>
    <div class="vue-contractDetail fullfill" v-bind:triggerComputed=loadContractData>
        <vue-header title="Contract" :subtitle='$route.params.cName' ></vue-header>
        <div class="container vue-contractDetail-container">
            <div class="vue-contractDetail-contentBg">
                <!--header tab-->
                <div class="vue-contractDetail-tabContainer">
                    <template v-for="(type) in tabList" >
                        <div :class= '[curTab === type ? "vue-contractDetail-tab vue-contractDetail-tab-select" : "vue-contractDetail-tab" ]' @click="switchTabType(type)">{{fetchTabTitle(type)}}</div>
                    </template>
                </div>
                <!--Tab ABI-->
                <div v-if="curTab=== 1&&Abi&&Abi.length > 0" class="contract-Json-bg">
                    <pre class="Json-content" v-html=formatJson(Abi)></pre>
                </div>

                <!-- Tab Operate contract-->
                <div v-if="curTab === 0">
                    <div class="vue-contractDetail-tabContainer vue-contractDetail-useContract-tabContainer">
                        <template v-for="(type) in useTypeList">
                            <div :class= '[curUseType === type ? "vue-contractDetail-tab vue-contractDetail-tab-select" : "vue-contractDetail-tab" ]'
                                 @click="switchContractUseType(type)">{{fetchContractUseTabTitle(type)}}</div>
                        </template>
                    </div>
                    <!--query contract-->
                    <template v-if="curUseType === 0">
                        <div class="vue-contractDetail-operate-bg">
                            <template v-for="(type) in queryFieldList">
                                <div class="filedList">
                                    <fieldInput :ref= "getInputRefFromType(type)" v-bind="getPropsFromType(type)" class="singleField"
                                                v-on:switchValue="handleInputValueChange"></fieldInput>
                                </div>
                            </template>
                            <div class="submitBg">
                                <button class="btn btn-primary submitBtn" type="button" @click="startQueryContract">Submit</button>
                            </div>

                        </div>
                    </template>
                    <!--query result-->
                    <template v-if="fieldJson && fieldJson.length > 0">
                        <div class="vue-contractDetail-queryResult-bg">
                            <div class="custom-control custom-checkbox vue-contractDetail-switchContainer">
                                <input type="checkbox" class="custom-control-input" :id=switchElId @click=handleJsonDisplaySwitch>
                                <label class="custom-control-label" :for=switchElId >Display original code</label>
                            </div>
                            <!--show json-->
                            <div v-if="isShowOriCode" class="contract-Json-bg">
                                <pre class="Json-content" v-html="formatJson(fieldJson)"></pre>
                            </div>
                            <!--show table-->
                            <div v-else>
                                <div class="vue-contractDetail-resultListHeader">
                                    <template v-for="(fName) in tablesMap[queryingTable]">
                                        <div class="vue-contractDetail-resultListHeader-col" :style="'width: calc(100% / '+ fieldsCnt + ')' ">{{fName}}</div>
                                    </template>
                                </div>

                                <template v-for="(obj) in fieldsList">
                                    <div class="vue-contractDetail-resultList-content">
                                        <template v-for="(field) in tablesMap[queryingTable]">
                                            <div class="vue-contractDetail-resultList-content-col"
                                                 :style="'width: calc(100% / '+ fieldsCnt + ')' ">
                                                {{getFieldValueByName(obj,field)}}
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
    import pHead from "../components/vue-bread";
    import api from "../assets/api";
    import fieldInput from "../components/vue-contract-input";

    const tabType = {
        tabTypeHandleContract: 0, //the tab of handle contract
        tabTypeAbi: 1, // the tab of abi
    };

    const useType = {
        useTypeQuery: 0, //the tab of query contract
        useTypeApply: 1, // the tab of apply contract
    };

    const queryFieldType = {
        queryFieldTypeContractName: 0,// contract name
        queryFieldTypeTableName: 1, //table name
        queryFieldTypeStart: 2, // lower bound of query
        queryFieldTypeField: 3, // the field to query
        queryFieldTypeLimit: 4, // the query limit
    };

    const abiTableListKey = "tables";
    const abiTableNameKey = "name";
    const abiPrimaryKey = "primary";
    const abiSecondaryKey = "secondary";

    module.exports = {
        data() {
            return {
                tabList: [tabType.tabTypeHandleContract, tabType.tabTypeAbi],
                curTab: tabType.tabTypeHandleContract, // current selected tab
                queryFieldList: [queryFieldType.queryFieldTypeContractName,queryFieldType.queryFieldTypeTableName,
                    queryFieldType.queryFieldTypeField, queryFieldType.queryFieldTypeStart, queryFieldType.queryFieldTypeLimit],
                Abi: null,
                useTypeList: [useType.useTypeQuery],
                curUseType: useType.useTypeQuery,
                tagName: "",
                fieldJson: "", //the query result(the chain will return json string)
                tablesMap: null, //table map(key is table name , value is field name array) of current contract
                tNameList: [], //table name of current contract
                curTableName:"", // current table name which is for query
                fieldsCnt:0,
                fieldsList: [],
                queryingTable:"",
                switchElId: "jsonCheckBox",
                isShowOriCode: false, // whether display origin json code of query result or display in table format

            }
        },

        components: {
            "vue-header": pHead,
            "fieldInput": fieldInput,
        },

        methods: {
            async loadContractData() {
                this.$root.showModalLoading =true;
                let result = await api.fetchContractDetailInfo(this.$route.params.owner, this.$route.params.cName, true, false);
                let contract = result.res;
                if (contract) {
                    let abi = contract.getAbi();
                    // console.log("the abi is ", abi);
                    if (abi && abi.length > 0) {
                        this.Abi = abi;
                        this.getTableInfoFromAbi();
                    }
                } else {
                    console.log("error code is:", result.errCode);
                    console.log("error msg is:", result.errMsg);
                }
                this.$root.showModalLoading = false;
            },

             switchTabType(type) {
                if (this.curTab !== type) {
                    this.curTab = type;
                    if (type === tabType.tabTypeAbi && (this.Abi == null || typeof (this.Abi) == "undefined" || (this.Abi.length < 1))) {
                        this.loadContractData();
                    }
                }
            },

            switchContractUseType(type) {
                if (this.curUseType !== type) {
                    this.curUseType = type;
                }
            },

            fetchTabTitle(type) {
                if (type === tabType.tabTypeHandleContract) {
                    return "Operate Contract";
                } else if (type === tabType.tabTypeAbi) {
                    return "ABI";
                }
                return ""
            },

            fetchContractUseTabTitle(type) {
                if (type === useType.useTypeQuery) {
                    return "Inquire";
                } else if (type === useType.useTypeApply) {
                    return "Apply";
                }
                return ""
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
            },

            startQueryContract() {
                let tName = this.$refs.tableName[0].getCurrentValue();
                let lowerBound = this.$refs.lowerBound[0].getCurrentValue();
                if (this.judgeStartIsNeedConvertToJson(lowerBound)) {
                    //convert string to json string
                    lowerBound = JSON.stringify(lowerBound);
                }
                let field = this.$refs.field[0].getCurrentValue();
                let limit = this.$refs.limit[0].getCurrentValue();
                //convert to json string
                this.queryContactInfo(this.$route.params.owner, this.$route.params.cName, tName, field, lowerBound, limit, false);
            },

            async queryContactInfo(owner, cName, tName, field, start, limit, isReverse) {
                this.$root.showModalLoading =true;
                this.queryingTable = tName;
                this.fieldsCnt = this.tablesMap[tName].length;
                this.fieldJson = "";
                this.isShowOriCode = false;
                let result = await api.queryContract(owner, cName, tName, field, start, limit, isReverse);
                if (result.res) {
                    let fieldJson = result.res;
                    if (fieldJson && fieldJson.length > 0) {
                        let list = JSON.parse(fieldJson);
                        if (list && list.length > 0) {
                            this.fieldsList = list;
                            this.fieldJson = fieldJson;
                        }
                    }
                } else {
                    console.log("Failed to query, the error code is ", result.errCode);
                    console.log("Failed to query, the error msg is ", result.errMsg);
                }
                this.$root.showModalLoading =false;
            },

            getTableInfoFromAbi() {
                if (this.Abi && this.Abi.length > 0) {
                    let abiJson = JSON.parse(this.Abi);
                    if (abiJson.hasOwnProperty(abiTableListKey)) {
                        let tables = abiJson[abiTableListKey];
                        this.tablesMap = {};
                        for (let table of tables) {
                            let filedList = [];
                            let priKey = "";
                            let tName = "";
                            // get table name
                            if (table.hasOwnProperty(abiTableNameKey)) {
                                tName = table[abiTableNameKey];
                            }

                            //get primaryKey
                            if (table.hasOwnProperty(abiPrimaryKey)) {
                                priKey = table[abiPrimaryKey];
                                filedList.push(priKey);
                            }
                            //get secondary key
                            if (table.hasOwnProperty(abiSecondaryKey)) {
                                let obj = table[abiSecondaryKey];
                                for (let filed of obj) {
                                    filedList.push(filed);
                                }
                            }

                            if (tName.length > 0) {
                                this.tablesMap[tName] = filedList;
                                this.tNameList.push(tName);
                            }

                        }

                        if (JSON.stringify(this.tablesMap) === "{}") {
                            this.tablesMap = null;
                        }else if (this.tNameList.length) {
                            this.curTableName = this.tNameList[0];
                        }
                    }
                }
            },

            getPropsFromType(type) {
                let props = {};
                if (type === queryFieldType.queryFieldTypeContractName) {
                    props.fieldDesc = 'code';
                    props.curValue = this.$route.params.cName;
                    props.editable =  false;
                }else if (type === queryFieldType.queryFieldTypeTableName) {
                    props.fieldDesc = "table";
                    if (this.tNameList.length > 0) {
                        let tName = this.tNameList[0];
                        props.curValue = this.curTableName;
                        props.dataList = this.tNameList;
                    }
                }else if (type === queryFieldType.queryFieldTypeStart) {
                    props.fieldDesc = 'lower_bound';
                }else if (type === queryFieldType.queryFieldTypeField) {
                    props.fieldDesc = 'field';
                    if (this.tNameList.length > 0) {
                        let tName = this.curTableName;
                        if (this.tablesMap && this.tablesMap.hasOwnProperty(tName)) {
                            let filedList = this.tablesMap[tName];
                            if (filedList.length > 0) {
                                props.curValue = filedList[0];
                            }
                            props.dataList = this.tablesMap[tName];

                        }
                    }
                }else if (type === queryFieldType.queryFieldTypeLimit) {
                    props.fieldDesc = 'limit';
                    props.curValue = '30';
                    props.isPureNumber = true;
                }

                return props;
            },

            getInputRefFromType(type) {
                let ref = "";
                if (type === queryFieldType.queryFieldTypeContractName) {
                    ref = "contractName";
                }else if (type === queryFieldType.queryFieldTypeTableName) {
                    ref = "tableName";
                }else if (type === queryFieldType.queryFieldTypeStart) {
                    ref = "lowerBound";
                }else if (type === queryFieldType.queryFieldTypeField) {
                    ref = "field";
                }else if (type === queryFieldType.queryFieldTypeLimit) {
                    ref = "limit";
                }
                return ref
            },

            handleInputValueChange(val) {
                if (val && (typeof val == "object") && (val.hasOwnProperty("fieldDesc")) && (val.hasOwnProperty("value"))) {
                    let filed = val["fieldDesc"];
                    if (filed === "table") {
                        this.curTableName = val["value"];
                    }
                } 
            },

            getFieldValueByName(obj, name) {
                let val = "";
                if (obj && obj.hasOwnProperty(name)) {
                    val = obj[name];
                }
                return val;
            },

            handleJsonDisplaySwitch() {
                this.isShowOriCode = document.getElementById(this.switchElId).checked;
            },

            judgeStartIsNeedConvertToJson(start) {
                if (start) {
                    let len = start.length;
                    if (len > 0) {
                        let pattern = /[a-z]/i;
                        if (pattern.test(start)) {
                            if (start.startsWith('[') && (start.substr(len-1, 1) === ']')) {
                                return false;
                            }else if (start.startsWith('{') && (start.substr(len-1, 1) === '}')) {
                                return false
                            }
                            return true;
                        }
                    }
                }
                return false;
            },


        },

        mounted() {
            this.loadContractData();
        }
    }
</script>
