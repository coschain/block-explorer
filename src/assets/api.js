
var { ajax, ajaxSplitAction, getContentosNetHost,getHost } = require("@/assets/utility");
const cos_sdk = require("cos-grpc-js");
const grpc_web = require("@improbable-eng/grpc-web").grpc;

module.exports = {
    cos_sdk,
    /*
     * get user account info by account name
     * @param name: user name
     * @param success:  the request success callback
     * @param fail:  the request fail callBack
     * @returns nil
     */
    async fetchAccountInfoByName(name, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetAccountByNameRequest();
        let accountName = new cos_sdk.raw_type.account_name();
        accountName.setValue(name);
        req.setAccountName(accountName);
        let promise = new Promise(function (resolve, reject) {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetAccountByName, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        if (message.hasInfo() && message.getInfo().hasAccountName()) {
                            resolve(message)
                        } else {
                            resolve(null)
                        }

                    } else {
                        reject(status, statusMessage)
                    }
                }
            });
        });
        promise.then(success, fail);
    },

    /**
     *  fetch the account list by account balance in reverse order
     * @param start: the account balance for query start
     * @param end: the account balance for query end
     * @param pageSize: the count of a page
     * @param lastAccount:the account info of the last one in last page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchAccountListByBalance(start, end, pageSize, lastAccount, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetAccountListByBalanceRequest();
        req.setStart(start);
        req.setEnd(end);
        if (lastAccount != null) {
            req.setLastAccount(lastAccount);
        }
        req.setLimit(pageSize);
        let promise = new Promise(function (resolve, reject) {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetAccountListByBalance, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getListList();
                        resolve(obj);
                    } else {
                        reject(status, statusMessage)
                    }
                }
            });
        });
        promise.then(success, fail);
    },

    /**
     * get some state info from chain like tps、maxTps
     * @param success:  the request success callback
     * @param fail:     the  request fail callback
     */
    async fetchStateInfo(success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.NonParamsRequest();
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetChainState, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        if (message.hasState()) {
                            let obj = message.toObject();
                            resolve(obj);
                        } else {
                            resolve(null)
                        }

                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail);
    },

    /**
     * get block list by block height
     * @param start: the start block height in range, if value null,query from the first in db
     * @param end: the end block height in range,if value is null,query to the end in db
     * @param limit: as meaning of word
     // * @param success: the request success callback
     // * @param fail: the  request fail callback
     * if start = 0 and end = 0,fetch all the blocks data in chain;if start == end and start != 0,fetch single
     * block which block number is from
     */
    async fetchBlockList(start, end, limit) {
        let req = new cos_sdk.grpc.GetBlockListRequest();
        req.setStart(start);
        req.setEnd(end);
        req.setLimit(limit);
        return new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetBlockList, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getBlocksList();
                        resolve(obj)
                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        // promise.then(success,fail);
    },

    async statByHour(hour) {
        let req = new cos_sdk.grpc.TrxStatByHourRequest()
        req.setHours(hour)
        return new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.TrxStatByHour, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getStatList();
                        resolve(obj)
                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        // promise.then(success,fail);
    },

    async fetchSignedBlock(blkNumber, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetSignedBlockRequest();
        req.setStart(blkNumber);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetSignedBlock, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getBlock();
                        resolve(obj)
                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail);
    },

    /**
     * get trx list by time in reverse order
     * @param start: the  start time in request range, if value null,query from the first in db
     * @param end: the end time  in request range, if value is null,query to the end in db
     * @param limit: one pass return list restrict, set to zero meaning no limit.
     * @param lastInfo: with start and end can not point an unique checkpoint
     */
    async fetchTrxListByTime(start, end, limit, lastInfo) {
        // if (typeof success != "function" || typeof fail != "function") {
        //     console.log("The success or fail is not a callBack function");
        //     return
        // }
        let req = new cos_sdk.grpc.GetTrxListByTimeRequest();
        // let s = new cos_sdk.raw_type.time_point_sec();
        // s.setUtcSeconds(Math.ceil(start));
        // let e = new cos_sdk.raw_type.time_point_sec();
        // e.setUtcSeconds(Math.ceil(end));
        // query should reverse start end end
        req.setStart(end);
        req.setEnd(start);
        req.setLimit(limit);
        if (lastInfo != null) {
            req.setLastInfo(lastInfo)
        }
        return new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetTrxListByTime, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getListList();
                        resolve(obj)
                    } else {
                        console.log("error code is %s,msg is %s", status, statusMessage);
                        reject(status, statusMessage)
                    }
                }
            })
        });
        // promise.then(success,fail)
    },

    /**
     * get list of daily total trx count by time
     * @param start: the  start time in request range, if value null,query from the first in db
     * @param end: the end time  in request range, if value is null,query to the end in db
     * @param pageSize: the count of a page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchDailyTotalTrxInfoList(start, end, pageSize, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetDailyTotalTrxRequest();
        if (typeof start == "number") {
            let sTime = new cos_sdk.raw_type.time_point_sec();
            sTime.setUtcSeconds(start);
            req.setStart(sTime);
        } else {
            req.setStart(start);
        }

        if (typeof end == "number") {
            let eTime = new cos_sdk.raw_type.time_point_sec();
            eTime.setUtcSeconds(end);
            req.setEnd(eTime);
        } else {
            req.setEnd(end);
        }
        req.setLimit(pageSize);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetDailyTotalTrxInfo, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.toObject();
                        resolve(obj.listList)
                    } else {
                        console.log("error code is %s,msg is %s", status, statusMessage);
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * get trx info by trxId
     * @param hashValue: trxId hash value
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchTrxInfoById(hashValue, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetTrxInfoByIdRequest();
        let trxId = new cos_sdk.raw_type.sha256();
        trxId.setHash(hashValue);
        req.setTrxId(trxId);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetTrxInfoById, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        if (message.hasInfo() && message.getInfo().hasTrxId()) {
                            let obj = message.getInfo();
                            resolve(obj)
                        } else {
                            resolve(null)
                        }

                    } else {
                        console.log("error code is %s,msg is %s", status, statusMessage);
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * fetch article list by create time in reverse order
     * @param start: the start time in request range
     * @param end: the end time in request range
     * @param pageSize: the count of a page
     * @param lastArticle: the article info of the last one in last page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchArticleListByCreateTime(start, end, pageSize, lastArticle, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetPostListByCreateTimeRequest();
        req.setStart(start);
        req.setEnd(end);
        req.setLastPost(lastArticle);
        req.setLimit(pageSize);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetPostListByCreateTime, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getPostedListList();
                        resolve(obj)
                    } else {
                        console.log("error code is %s,msg is %s", status, statusMessage);
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * fetch articles list posted by user
     * @param start: the start time in request range
     * @param end: the end time in request range
     * @param pageSize: the count of a page
     * @param lastArticle: the article info of the last one in last page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchArticleListByName(start, end, pageSize, lastArticle, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetPostListByNameRequest();
        req.setStart(start);
        req.setEnd(end);
        req.setLastPost(lastArticle);
        req.setLimit(pageSize);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetPostListByName, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getPostedListList();
                        resolve(obj)
                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * fetch following list of user
     * @param start: the start time in request range
     * @param end: the end time in request range
     * @param pageSize: the count of a page
     * @param lastFollowOrder: the follower create order of the last one in last page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchFollowerListByName(start, end, pageSize, lastFollowOrder, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetFollowerListByNameRequest();
        req.setStart(start);
        req.setEnd(end);
        req.setLastOrder(lastFollowOrder);
        req.setLimit(pageSize);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetFollowerListByName, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getFollowerListList();
                        resolve(obj)
                    } else {
                        console.log(message);
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * fetch following list of user
     * @param start: the start time in request range
     * @param end: the end time in request range
     * @param pageSize: the count of a page
     * @param lastFollowingOrder: the following create order of the last one in last page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchFollowingListByName(start, end, pageSize, lastFollowingOrder, success, fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetFollowingListByNameRequest();
        req.setStart(start);
        req.setEnd(end);
        req.setLastOrder(lastFollowingOrder);
        req.setLimit(pageSize);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetFollowingListByName, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getFollowingListList();
                        resolve(obj)
                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     *
     * @param account
     * @param start:the start time in request range
     * @param end: the end time in request range
     * @param pageSize:the count of a page
     * @param lastTrx: the trx of the last one in last page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchUserTrxListByTime(account,start,end,pageSize,lastTrx,success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetUserTrxListByTimeRequest();
        req.setName(account);
        req.setStart(start);
        req.setEnd(end);
        req.setLastTrx(lastTrx);
        req.setLimit(pageSize);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetUserTrxListByTime, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getTrxListList();
                        resolve(obj)
                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * fetch article detail info(voter list 、reply list、rewards etc.) by post id
     * @param pId: the post id of article
     * @param voterLimit: the list count of voter list
     * @param replyLimit: the list count of reply list
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchArticleDetailInfoById(pId,voterLimit,replyLimit,success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }

        let req = new cos_sdk.grpc.GetPostInfoByIdRequest();
        req.setPostId(pId);
        req.setVoterListLimit(voterLimit);
        req.setReplyListLimit(replyLimit);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetPostInfoById, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        resolve(message)
                    } else {
                        reject(status, statusMessage)
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * judge trx  block is irreversible
     * @param trxId: trx id
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async getBlockOfTrxIsIrreversible(trxId,success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetBlkIsIrreversibleByTxIdRequest();
        req.setTrxId(trxId);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetBlkIsIrreversibleByTxId, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        resolve(message);
                    } else {
                        reject(status, statusMessage);
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     *
     * @param start: the start time in request range
     * @param end: the end time in request range
     * @param lastAccount: the account info of the last one in last page
     * @param pageSize: the list count of a page
     * @param success: the request success callback
     * @param fail: the request fail callback
     */
    async fetchAccountListByCreateTime(start,end,lastAccount,pageSize,success,fail) {
        if (typeof success != "function" || typeof fail != "function") {
            console.log("The success or fail is not a callBack function");
            return
        }
        let req = new cos_sdk.grpc.GetAccountListByCreTimeRequest();
       req.setStart(start);
       req.setEnd(end);
       req.setLastAccount(lastAccount);
       req.setLimit(pageSize);
        let promise = new Promise((resolve, reject) => {
            grpc_web.unary(cos_sdk.grpc_service.ApiService.GetAccountListByCreTime, {
                request: req,
                host: getHost(),
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc_web.Code.OK && message) {
                        let obj = message.getListList();
                        resolve(obj);
                    } else {
                        reject(status, statusMessage);
                    }
                }
            })
        });
        promise.then(success, fail)
    },

    /**
     * fetch daily statistics data(contain dau 、dnu、tx count、tx amount)
     * @param dApp: the dApp name
     * @param days: Number of dates
     * @return result: {res,errCode,errMsg}
     */
    async fetchDailyStats(dApp,days) {
        let result = {
            res: null,
            errCode: null,
            errMsg: null,
        };

        try {
            let req = new cos_sdk.grpc.GetDailyStatsRequest();
            req.setDapp(dApp);
            req.setDays(days);
            return new Promise((resolve, reject) => {
                grpc_web.unary(cos_sdk.grpc_service.ApiService.GetDailyStats, {
                    request: req,
                    host: getHost(),
                    onEnd: res => {
                        const {status, statusMessage, headers, message, trailers} = res;
                        if (status === grpc_web.Code.OK && message) {
                            let list = message.getStatList();
                            resolve(list);
                        } else {
                            let err = {
                                errCode: status,
                                msg: statusMessage,
                            };
                            reject(err);
                        }
                    }
                })
            }).then((res) => {
                if (res) {
                    result.res = res;
                    result.errMsg = null;
                    result.errCode = null;
                } else {
                    result.res = null;
                    result.errMsg = "Failed to fetch daily Statistical data";
                }
                return result;
            }).catch(({ errCode, msg }) => {
                result.res = null;
                result.errCode = errCode;
                result.errMsg = msg;
                return result;
            });

        } catch(err) {
            result.errMsg = err;
            result.res = null;
            return result;
        }
    },

    /**
     *
     * @param owner: the owner of contract
     * @param cName: the contract name
     * @param tName: the contract table name
     * @param field: the table filed to query
     * @param start:  the detail value of filed in query range
     * @param limit: the total count in one query
     * @param isReverse： Whether to query in reverse order
     */
    async queryContract(owner, cName, tName, field, start, limit, isReverse) {
        let result = {
            res: null,
            errCode: null,
            errMsg: null,
        };
        try {
            let req = new cos_sdk.grpc.GetTableContentRequest();
            req.setOwner(owner);
            req.setBegin(start);
            req.setContract(cName);
            req.setField(field);
            req.setTable(tName);
            req.setCount(limit);
            req.setReverse(isReverse);
            return new Promise((resolve, reject) => {
                grpc_web.unary(cos_sdk.grpc_service.ApiService.QueryTableContent, {
                    request: req,
                    host: getHost(),
                    onEnd: res => {
                        const {status, statusMessage, headers, message, trailers} = res;
                        if (status === grpc_web.Code.OK && message) {
                            let content = message.getTableContent();
                            resolve(content);
                        } else {
                            let err = {
                                errCode: status,
                                msg: statusMessage,
                            };
                            reject(err);
                        }
                    }
                })
            }).then(res => {
                result.res = res;
                result.errMsg = null;
                result.errCode = null;
                return result;
            }).catch(({ errCode, msg }) => {
                result.res = null;
                result.errCode = errCode;
                result.errMsg = msg;
                return result;
            });
        } catch (e) {
           result.errMsg = e;
           return result;
        }
    },

    /**
     *  fetch contract info by contract name and owner
     * @param owner: the owner of contract
     * @param cName: the name of contract
     * @param isGetAbi: whether get abi of contact
     * @param isGetCode: whether get wsam of contact
     */
    async fetchContractDetailInfo(owner, cName, isGetAbi, isGetCode) {
        let result = {
            res: null,
            errCode: null,
            errMsg: null,
        };

        try {
            let req = new cos_sdk.grpc.GetContractInfoRequest();
            req.setContractName(cName);
            let account = new cos_sdk.raw_type.account_name();
            account.setValue(owner);
            req.setOwner(account);
            req.setFetchabi(isGetAbi);
            req.setFetchcode(isGetCode);
            return new Promise((resolve, reject) => {
                grpc_web.unary(cos_sdk.grpc_service.ApiService.GetContractInfo, {
                    request: req,
                    host: getHost(),
                    onEnd: res => {
                        const {status, statusMessage, headers, message, trailers} = res;
                        if (status === grpc_web.Code.OK && message) {
                            resolve(message);
                        } else {
                            let err = {
                                errCode: status,
                                msg: statusMessage,
                            };
                            reject(err);
                        }
                    }
                })
            }).then(res => {
                result.res = res;
                result.errMsg = null;
                result.errCode = null;
                return result;
            }).catch(({ errCode, msg }) => {
                result.res = null;
                result.errCode = errCode;
                result.errMsg = msg;
                return result;
            });
        } catch (e) {
            result.errMsg = e;
            return result;
        }
    },

    /**
     *  fetch contract list by create time in reverse order
     * @param start: the start time in request range
     * @param end: the end time in request range
     * @param limit: the count of a page
     */
    async fetchContractListByTime(start,end,limit,lastContract) {
        let result = {
            res: null,
            errCode: null,
            errMsg: null,
        };
        try {
            let req = new cos_sdk.grpc.GetContractListByTimeRequest();
            req.setStart(start);
            req.setEnd(end);
            req.setLimit(limit);
            req.setLastContract(lastContract);
            return new Promise((resolve, reject) => {
                grpc_web.unary(cos_sdk.grpc_service.ApiService.GetContractListByTime, {
                    request: req,
                    host: getHost(),
                    onEnd: res => {
                        const {status, statusMessage, headers, message, trailers} = res;
                        if (status === grpc_web.Code.OK && message) {
                            let list = message.getContractListList();
                            resolve(list);
                        } else {
                            let err = {
                                errCode: status,
                                msg: statusMessage,
                            };
                            reject(err);
                        }
                    }
                })
            }).then(res => {
                result.res = res;
                result.errMsg = null;
                result.errCode = null;
                return result;
            }).catch(({ errCode, msg }) => {
                result.res = null;
                result.errCode = errCode;
                result.errMsg = msg;
                return result;
            });
        }catch (e) {
            result.errMsg = e;
            return result;
        }
    },

    /**
     * get witness list by vote count in reverse order
     * @param start: the min voter count in query range
     * @param end: the max voter count in query range
     * @param limit: the count of a page
     * @param lastWitness: the witness info of the last one in last page
     */
    async fetchWitnessListByVoteCount(start,end,limit,lastWitness) {
        let result = {
            res: null,
            errCode: null,
            errMsg: null,
        };
        try {
            let req = new cos_sdk.grpc.GetWitnessListByVoteCountRequest();
            req.setStart(start);
            req.setEnd(end);
            req.setLimit(limit);
            req.setLastWitness(lastWitness);
            return new Promise((resolve, reject) => {
                grpc_web.unary(cos_sdk.grpc_service.ApiService.GetWitnessListByVoteCount, {
                    request: req,
                    host: getHost(),
                    onEnd: res => {
                        const {status, statusMessage, headers, message, trailers} = res;
                        if (status === grpc_web.Code.OK && message) {
                            let list = message.getWitnessListList();
                            resolve(list);
                        } else {
                            let err = {
                                errCode: status,
                                msg: statusMessage,
                            };
                            reject(err);
                        }
                    }
                })
            }).then(res => {
                result.res = res;
                result.errMsg = null;
                result.errCode = null;
                return result;
            }).catch(({ errCode, msg }) => {
                result.res = null;
                result.errCode = errCode;
                result.errMsg = msg;
                return result;
            });;
        } catch (e) {
            result.errMsg = e;
            return result;
        }
    }
  };
    function ajax1(action, args, done, fail) {

        var a = ajaxSplitAction(action);

        return ajax(a[0] + " " + sessionStorage.apiPrefix + a[1], args, done, fail);
    }
