
var { ajax, ajaxSplitAction, getContentosNetHost } = require("@/assets/utility");
const cos_sdk = require("cos-grpc-js");
const cos_host = 'http://' + window.location.hostname + ':8080';
const grpc_web = require("@improbable-eng/grpc-web").grpc;

module.exports = {
     cos_host ,
    /*
     * get user account info by account name
     * @param name: user name
     * @param success:  the request success callback
     * @param fail:  the request fail callBack
     * @returns nil
     */
     async fetchAccountInfoByName(name,success,fail) {
         if (typeof success != "function" || typeof fail != "function") {
             console.log("The success or fail is not a callBack function");
             return
         }
        let req = new  cos_sdk.grpc.GetAccountByNameRequest();
        let accountName = new cos_sdk.raw_type.account_name();
        accountName.setValue(name);
        req.setAccountName(accountName);
        let promise = new Promise(function (resolve, reject) {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetAccountByName, {
                request: req,
                host: cos_host,
                onEnd: res => {
                    const { status, statusMessage, headers, message, trailers } = res;
                    if (status === grpc_web.Code.OK && message) {
                        if (message.hasAccountName()) {
                            let obj = message.toObject();
                            resolve(obj)
                        }else {
                            resolve(null)
                        }

                    } else {
                        reject(status,statusMessage)
                    }
                }
            });
        });
        promise.then(success,fail);
    },

    /**
     *  fetch the account list by account balance in reverse order
     * @param start: the account balance for query start
     * @param end: the account balance for query end
     * @param lastAccount:the account info of the last one in last page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchAccountListByBalance(start,end,lastAccount,success,fail){
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new  cos_sdk.grpc.GetAccountListByBalanceRequest();
        req.setStart(start);
        req.setEnd(end);
        if (lastAccount != null) {
            console.log("last account is :");
            console.log(lastAccount.toObject());
            req.setLastAccount(lastAccount);
        }
        let promise = new Promise(function (resolve, reject) {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetAccountListByBalance, {
                request: req,
                host: cos_host,
                onEnd: res => {
                    const { status, statusMessage, headers, message, trailers } = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getListList();
                        resolve(obj);
                    } else {
                        reject(status,statusMessage)
                    }
                }
            });
        });
        promise.then(success,fail);
    },

    /**
     * get some state info from chain like tps、maxTps
     * @param success:  the request success callback
     * @param fail:     the  request fail callback
     */
    async fetchStateInfo(success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.NonParamsRequest();
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetStatInfo,{
                 request:req,
                 host:cos_host,
                onEnd: res => {
                    const { status, statusMessage, headers, message, trailers } = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.toObject();
                        resolve(obj);
                    }else {
                        reject(status,statusMessage)
                    }
                }
            })
        });
        promise.then(success,fail);
    },

    /**
     * get block list by block height
     * @param start: the start block height in range, if value null,query from the first in db
     * @param end: the end block height in range,if value is null,query to the end in db
     * @param success: the request success callback
     * @param fail: the  request fail callback
     * if start = 0 and end = 0,fetch all the blocks data in chain;if start == end and start != 0,fetch single
     * block which block number is from
     */
    async fetchBlockList(start,end,success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetBlockListRequest();
        req.setStart(start);
        req.setEnd(end);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetBlockList, {
                request:req,
                host:cos_host,
                onEnd: res => {
                    const { status, statusMessage, headers, message, trailers } = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getBlocksList();
                        resolve(obj)
                    }else {
                        reject(status,statusMessage)
                    }
                }
            })
        });
        promise.then(success,fail);
    },

    /**
     * get trx list by time in reverse order
     * @param start: the  start time in request range, if value null,query from the first in db
     * @param end: the end time  in request range, if value is null,query to the end in db
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchTrxListByTime(start,end,lastInfo,success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetTrxListByTimeRequest();
        req.setStart(start);
        req.setEnd(end);
        if (lastInfo != null ) {
            req.setLastInfo(lastInfo)
        }
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetTrxListByTime, {
                request:req,
                host:cos_host,
                onEnd: res => {
                    const { status, statusMessage, headers, message, trailers } = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getListList();
                        resolve(obj)
                    }else {
                        console.log("error code is %s,msg is %s",status,statusMessage);
                        reject(status,statusMessage)
                    }
                }
            })
        });
        promise.then(success,fail)
    },

    /**
     * get list of daily total trx count by time
     * @param start: the  start time in request range, if value null,query from the first in db
     * @param end: the end time  in request range, if value is null,query to the end in db
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchDailyTotalTrxInfoList(start,end,success,fail){
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetDailyTotalTrxRequest();
        req.setStart(start);
        req.setEnd(end);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetDailyTotalTrxInfo, {
                request:req,
                host:cos_host,
                onEnd: res => {
                    const { status, statusMessage, headers, message, trailers } = res;
                    if (status === grpc_web.Code.OK && message) {
                        console.log("fetch daily total trxs list");
                        let obj = message.toObject();
                        console.log(obj);
                        resolve(obj.listList)
                    }else {
                        console.log("error code is %s,msg is %s",status,statusMessage);
                        reject(status,statusMessage)
                    }
                }
            })
        });
        promise.then(success,fail)
    },

    /**
     * get trx info by trxId
     * @param hashValue: trxId hash value
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchTrxInfoById(hashValue,success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetTrxByIdRequest();
        let trxId = new cos_sdk.raw_type.sha256();
        trxId.setHash(hashValue);
        req.setTrxId(trxId);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetTrxInfoById, {
                request:req,
                host:cos_host,
                onEnd: res => {
                    const { status, statusMessage, headers, message, trailers } = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getInfo();
                        resolve(obj)
                    }else {
                        console.log("error code is %s,msg is %s",status,statusMessage);
                        reject(status,statusMessage)
                    }
                }
            })
        });
        promise.then(success,fail)
    },

    // get api/account?
    // - p      - 页码, 默认 1
    getAccount(p, done, fail) {
        ajax1("account", { p }, function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }, fail);
    },


    // get api/address?
    // - p      - 页码, 默认 1
    // - part   - mine
    // get api/address/
    // - <hash>
    getAddress(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"'))
            ajax1("address", t, d, fail);
        else
            ajax1("address/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },
    getTransactionByContract(t, netname, done, fail) {
        var host =  getContentosNetHost(netname)
        ajax('POST ' + host + '/user/getTransactionByContract', t, done, fail)
    },

    // get api/block?
    // - p      - 页码, 默认 1
    // - m      - miner hash
    // - type   - 目前只有 latest, newblock
    // get api/block/
    // - <id or hash>
    getBlock(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"'))
            ajax1("block", t, d, fail);
        else
            ajax1("block/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },


    getBlocks(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"'))
            ajax1("blocks", t, d, fail);
        else
            ajax1("blocks/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    // get api/market_cap
    getMarketCap(done, fail) {
        ajax1("market_cap", null, function (s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }, fail);
    },

    getSearch(q, done, fail) {
        ajax1("search", { q }, function (s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }, fail);
    },

    // get api/tx?
    // - a          - address hash
    // - block      - block height
    // - isPending
    // - p          - 页码, 默认 1
    // - type       - 目前只有 latest
    // get api/tx/
    // - cnt_static
    // - <id or hash>
    getTx(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"'))
            ajax1("tx", t, d, fail);
        else
            ajax1("tx/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    // get api/contract?
    // - c      - contract address
    getContract(c, done, fail) {
        if (eval('typeof t == "object"'))
            ajax1("contract", c, d, fail);
        else
            ajax1("contract/" + c, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    // get api/contract/tx?
    // - contract   - contract address
    // - isPending  - 默认 false
    // - p          - 页码, 默认 1
    getContractTx(t, done, fail) {
        if (eval('typeof t == "object"'))
            ajax1("contract/tx", t, d, fail);
        else
            ajax1("contract/tx/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    // get api/contract/holders?
    // - contract   - contract address
    // - p          - 页码, 默认 1
    getContractHolders(t, done, fail) {
        if (eval('typeof t == "object"'))
            ajax1("contract/holders", t, d, fail);
        else
            ajax1("contract/holders/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    // get address/nrc20/{hash}/{page}
    // - address   - address
    // - page   - 页码, 默认 1
    getNrc20Txs(address, page, done, fail) {
        ajax1("address/nrc20/" + address + "/" + page, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    getTodayTxCnt(done, fail) {
        ajax1("tx/cnt_today", null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    getStaticInfo(done, fail) {
        ajax1("nasinfo", null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    getContracts(t, done, fail) {
        ajax1("contracts", t, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    getDipList(t, done, fail) {
        ajax1("dip/list", t, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },
};

function ajax1(action, args, done, fail) {
    var a = ajaxSplitAction(action);

    return ajax(a[0] + " " + sessionStorage.apiPrefix + a[1], args, done, fail);
}
