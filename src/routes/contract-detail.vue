<style>
    .vue-contractDetail {
        width: 100%;
        background-color: #f2f2f2;
        position: relative;
    }

    .vue-contractDetail-desc-container {
        background-color: white;
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 0;
    }

    .contract-desc-cell {
        display: flex;
        flex-direction: row;
        padding-top: 11px;
        padding-bottom: 11px;
        width: 100%;
        border-bottom: 1px solid #eee;
    }

    .contract-desc-cell .proDesc {
        margin-left: 15px;
        width: 18%;
        text-align: left;
        font-size: 16px;
        word-wrap: normal;
    }

    .contract-desc-cell .proValue {
        text-align: left;
        width: 82%;
        word-wrap: break-word;
        word-break: break-word;
        font-size: 16px;
    }

    /*.vue-contractDetail-desc-container .contract-desc-cell:nth-of-type(even) {*/
        /*background: rgba(247, 247, 247, 1);*/
    /*}*/

     /*.vue-contractDetail-desc-container .contract-desc-cell:nth-of-type(odd) {*/
        /*background: rgba(255, 255, 255, 1);*/
    /*}*/

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
        width: 82%;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .vue-contractDetail-reverseBg {
        width: 70%;
        margin-left: 30%;
        display: flex;
        display: -ms-flex;
        align-items: center;
        color: black;
    }

    .vue-contractDetail-operate-bg .queryBg{
        margin-top: 30px;
        margin-bottom: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vue-contractDetail-operate-bg .queryBtn {
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
        display: inline-block;
        padding-left: 15px;
        color: rgba(85, 85, 85, 1);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .vue-contractDetail-titleHead {
        background-color: #f7f7f7;
        overflow: auto;
        padding: 10px 0;
    }

    .vue-contractDetail-titleHead_bg {
        display: flex;
        flex-direction: row;
        align-items: baseline;
    }

    .vue-contractDetail-subTitle-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .vue-contractDetail-subTitle-container .subTitle-singleRow {
        word-wrap: break-word;
        word-break: break-word;
    }

    @media (max-width: 576px) {
        .vue-contractDetail-container {
            width: calc(100% - 30px);
        }

        .vue-contractDetail-desc-container {
            width: calc(100% - 30px);
        }

        .contract-desc-cell .proDesc {
            width: 30%;
        }

        .contract-desc-cell .proValue {
            width: 70%;
        }

        .vue-contractDetail-operate-bg {
            padding: 0;
        }

        .vue-contractDetail-operate-bg .filedList .singleField {
            width: 100%;
        }

        .vue-contractDetail-reverseBg {
            width: 100%;
            margin-left: 0;
        }
    }

    @media  (min-width:576px ) and (max-width: 992px) {
        .contract-desc-cell .proDesc {
            width: 20%;
        }

        .contract-desc-cell .proValue {
            width: 80%;
        }

    }
</style>

<template>
    <div class="vue-contractDetail fullfill" v-bind:triggerComputed=loadContractData>
        <!--<div class="vue-contractDetail-titleHead">-->
            <!--<div class="container">-->
                <!--<div class="row align-items-center">-->
                    <!--<div class="vue-contractDetail-titleHead_bg">-->
                        <!--<div class="col-auto font-40 font-bold font-color-000000">Contract</div>-->
                        <!--<div class="vue-contractDetail-subTitle-container">-->
                            <!--<div class="font-16 font-bold font-color-000000 subTitle-singleRow">{{ctrName}}</div>-->
                            <!--<div class="font-16 font-bold font-color-000000 subTitle-singleRow">{{ctrDesc}}</div>-->
                            <!--<div class="font-16 font-bold font-color-000000 subTitle-singleRow">{{ctrOriCodePosition}}</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <vue-header title="Contract" :subtitle= "ctrName" ></vue-header>
        <template v-if="judgeIsHasCtrDesc()">
            <div class="container vue-contractDetail-desc-container">
                <!--contract description-->
                <template v-if="ctrDesc.length">
                    <div class="contract-desc-cell">
                        <div class="proDesc font-color-555555">Description:</div>
                        <div class="proValue font-color-000000">{{ctrDesc}}</div>
                    </div>
                </template>
                <!--contract Source code position-->
                <template v-if="ctrOriCodePosition.length">
                    <div class="contract-desc-cell">
                        <div class="proDesc font-color-555555">Source code location:</div>
                        <div class="proValue font-color-000000" v-html="convertTolinkifyHtml(ctrOriCodePosition)"></div>
                    </div>
                </template>
            </div>

        </template>
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
                            <!--whether is reverse-->
                            <div class="filedList">
                                <div class="singleField">
                                    <div class="vue-contractDetail-reverseBg">
                                        <div class="custom-control custom-checkbox vue-contractDetail-switchContainer">
                                            <input type="checkbox" class="custom-control-input" :id=reverseElId @click=handleReverseInquireSwitch>
                                            <label class="custom-control-label" :for=reverseElId >Reverse Order</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="queryBg">
                                <button class="btn btn-primary queryBtn" type="button" @click="startQueryContract">Query</button>
                            </div>

                        </div>
                    </template>
                    <!--query result-->
                    <template v-if="fieldJson && fieldJson.length > 0">
                        <div class="vue-contractDetail-queryResult-bg">
                            <div v-if="isDisplaySwitch" class="custom-control custom-checkbox vue-contractDetail-switchContainer">
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
    import linkifyHtml from 'linkifyjs/html';
    import * as linkify from "linkifyjs";
    import * as utility from "../assets/utility";


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
    const abiTableType = "type";
    const abiPrimaryKey = "primary";
    const abiSecondaryKey = "secondary";
    const abiStructsKey = "structs";
    const abiStructNameKey = "name";
    const abiStructFieldsKey = "fields";
    const abiStructFieldNameKey = "name";

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
                tablesMap: null, //table map(key is table name , value is field name which support query array) of current contract
                fieldsMap: null, //table map(key is table name , value is all member field name array) of tables in current contract
                tNameList: [], //table name of current contract
                curTableName:"", // current table name which is for query
                fieldsCnt:0,
                fieldsList: [],
                queryingTable:"",
                switchElId: "jsonCheckBox",
                isShowOriCode: false, // whether display origin json code of query result or display in table format
                reverseElId: "reverseCheckBox",
                isReverse: false, // whether is inquire in reverse order
                ctrName:utility.filterXSS(this.$route.params.cName),//contract name
                ctrDesc:"",//contract description
                ctrOriCodePosition: "",//the position of contract origin code
                isDisplaySwitch: true,
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
                    if (abi && abi.length > 0) {
                        this.Abi = abi;
                        this.getTableInfoFromAbi();
                    }
                    if (contract.getUrl&&contract.getUrl().length) {
                        this.ctrOriCodePosition = contract.getUrl();
                    }

                    if (contract.getDescribe&&contract.getDescribe().length) {
                        this.ctrDesc = utility.filterXSS(contract.getDescribe());

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
                let lowerBound = utility.filterXSS(this.$refs.lowerBound[0].getCurrentValue());
                if (this.judgeStartIsNeedConvertToJson(lowerBound)) {
                    //convert string to json string
                    lowerBound = JSON.stringify(lowerBound);
                }
                let field = this.$refs.field[0].getCurrentValue();
                let limit = this.$refs.limit[0].getCurrentValue();
                //convert to json string
                this.queryContactInfo(this.$route.params.owner, this.$route.params.cName, tName, field, lowerBound, limit, this.isReverse);
            },

            async queryContactInfo(owner, cName, tName, field, start, limit, isReverse) {
                this.$root.showModalLoading =true;
                this.queryingTable = tName;
                let fieldList = this.tablesMap[tName];
                if (fieldList) {
                    this.fieldsCnt = fieldList.length;
                }
                // this.fieldJson = "";
                this.isShowOriCode = false;
                let result = await api.queryContract(owner, cName, tName, field, start, limit, isReverse);

                if (result.res) {
                    let fieldJson = result.res;
                    if (fieldJson && fieldJson.length > 0) {
                        let list = JSON.parse(fieldJson);
                        if (list && list.length > 0) {
                            this.fieldsList = list;
                            this.fieldJson = fieldJson;

                            this.isShowOriCode = false;
                            this.isDisplaySwitch = true;
                            if (!this.judgeMapIsEmpty(this.fieldsMap)) {
                                let fList = this.fieldsMap[tName];
                                if (utility.judgeIsNotEmpty(fList) && !this.judgeMapIsEmpty(this.tablesMap)) {
                                    let queryFields = this.tablesMap[tName];
                                    if (queryFields != null && typeof queryFields != "undefined") {
                                        for (let f of queryFields) {
                                            if (fList.indexOf(f) === -1) {
                                                //The Field is field of parent class, only show origin code
                                                this.isShowOriCode = true;
                                                this.isDisplaySwitch = false;
                                                break;
                                            }
                                        }
                                    }
                                }

                            }
                        }else {
                            this.fieldJson = "";
                            this.fieldsList = this.fieldsList.splice(0, this.fieldsList.length);
                        }
                    }else {
                        this.fieldJson = "";
                        this.fieldsList = this.fieldsList.splice(0, this.fieldsList.length);
                    }
                } else {
                    this.fieldJson = "";
                    this.fieldsList = this.fieldsList.splice(0, this.fieldsList.length);
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
                        if (tables) {
                            this.fieldsMap = {};
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
                                    if (obj) {
                                        for (let filed of obj) {
                                            filedList.push(filed);
                                        }
                                    }

                                }

                                if (tName.length > 0) {
                                    this.tablesMap[tName] = filedList;
                                    this.tNameList.push(tName);

                                    //Get All fields of table(not include fields inherited from parent class)
                                    if (abiJson.hasOwnProperty(abiStructsKey) && table.hasOwnProperty(abiTableType)) {
                                        let typeName = table[abiTableType];
                                        let sList = abiJson[abiStructsKey];
                                        if (sList != null && typeof sList != "undefined") {
                                            for (let s of sList) {
                                                let fList = [];
                                                if (s.hasOwnProperty(abiStructNameKey)) {
                                                    let sName = s[abiStructNameKey];
                                                    if (sName === typeName) {
                                                        let fields = s[abiStructFieldsKey];
                                                        if (fields != null && typeof fields != "undefined") {
                                                            for (let f of fields) {
                                                                if (f.hasOwnProperty(abiStructFieldNameKey)) {
                                                                    let fName = f[abiStructFieldNameKey];
                                                                    if (fName.length) {
                                                                        fList.push(fName);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (fList.length) {
                                                   let curMap = {};
                                                   curMap[tName] = fList;
                                                   this.fieldsMap = {...this.fieldsMap, ...curMap};
                                                    break;
                                                }

                                            }
                                        }
                                    }
                                }

                            }

                            if (JSON.stringify(this.tablesMap) === "{}") {
                                this.tablesMap = null;
                            }else if (this.tNameList.length) {
                                this.curTableName = this.tNameList[0];
                            }
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

            handleReverseInquireSwitch() {
                this.isReverse = document.getElementById(this.reverseElId).checked;
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

            judgeIsHasCtrDesc() {
                return this.ctrDesc.length > 0 || this.ctrOriCodePosition.length > 0;
            },

            convertTolinkifyHtml(content) {
                if (content != null && typeof content == "string") {
                    let filterContent = utility.filterXSS(content)
                    return linkifyHtml(filterContent,linkify.options.defaults);
                }
                return content;
            },

            judgeMapIsEmpty(m) {
                return !(utility.judgeIsNotEmpty(m) && JSON.stringify(m) !== "{}");

            }
        },

        mounted() {
            this.loadContractData();
        }
    }
</script>
