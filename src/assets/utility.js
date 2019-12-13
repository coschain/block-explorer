const pageCacheType = {
    blocksList : 1,//blocks list page
    txsList : 2,//txs list page
    articleList : 3,//article list page
    accountsList : 4,//account list page
    usrArticleList : 5,//user posted articles list page
    blkTxsList : 6, //txs list in single block
    contractsList : 7, // contract list page
    bpList: 8 ,// bp list page
};

const DAppType = {
    DAppTypePg : 0, // PhotoGrid
    DAppTypeCos : 1, // Contentos.io
    DAppType2048 : 2, // Game2048
    DAppTypeWalkcoin : 3, // Walkcoin

}
const rpcCacheKey = "rpcAddress";
const complexCacheMapKey = "complexMapKey";
let irreversibleNum = 0;
const isUpdateSys = false;

import xss from 'xss';
module.exports = {
    isUpdateSys,
    pageCacheType:pageCacheType,
    DAppType:DAppType,
    ajax: ajax,
    ajaxSplitAction: ajaxSplitAction,
    millisecondsToMinutesAndSeconds: millisecondsToMinutesAndSeconds,
    numberAddComma: numberAddComma,
    parseQueryString: parseQueryString,
    q: q,
    randomInt: randomInt,
    shuffle: shuffle,
    timeConversion: timeConversion,
    timeConversionSec: timeConversionSec,
    toWei: toWei,
    easyNumber:easyNumber,
    ua: ua,
    yyyymmdd: yyyymmdd,
    getContentosNetHost: getContentosNetHost,
    searchType: judgeSearchType,
    byteToHexStr: convertByteToHexString,
    hexStrToByte: convertHexStringToByteArray,
    getHost: getRpcHost,
    getElkProxy: getElkProxy,
    setHost: modifyRpcHost,
    clearPagesInfoCache: clearAllPageListDataCache,
    getPageCacheKey: getPageInfoCacheKey,
    getTestNetName:getTestNetName,
    formatBlkSize: formatBlockSize,
    formatTxsCnt: formatTxsCount,
    updateIrreversibleBlkNum:updateIrreversibleBlkNum,
    getIrreversibleBlkNum:getIrreversibleBlkNum,
    addComplexCacheKey:addComplexCacheKey,
    removeComplexCacheKey:removeComplexCacheKey,
    clearComplexCaches:clearAllComplexCache,
    getTrxStatusByTrxInfo:getTrxReceiptStatusByTrxInfo,
    getTrxStatusByTrxWrap:getTrxReceiptStatusByWrap,
    judgeIsNotEmpty:judgeIsNotEmpty,
    filterXSS:filterXSS
};

////////////////////////////////////////////////////////////

function getRpcHost() {
    let cachedAddr = sessionStorage.getItem(rpcCacheKey);
    if (cachedAddr) {
        return cachedAddr;
    }
    return process.env.VUE_APP_CHAIN;
}

function getElkProxy() {
    return process.env.VUE_ELK_PROXY;
}

function modifyRpcHost(address) {
    if (address && address.length > 0) {
        sessionStorage.setItem(rpcCacheKey,address)
    }
}

function clearAllPageListDataCache() {
    for (let type in pageCacheType) {
        clearCacheFromSession(getPageInfoCacheKey(pageCacheType[type]));
    }
}

function clearCacheFromSession(keyStr) {
    if (typeof keyStr == "string") {
        if (sessionStorage.getItem(keyStr)) {
            sessionStorage.removeItem(keyStr);
        }
    }
}

function getPageInfoCacheKey(pType) {
    if (pType === pageCacheType.blocksList) {
        return "blocksVueCache";
    }else if (pType === pageCacheType.txsList) {
        return "txsPageCache";
    }else if (pType === pageCacheType.articleList) {
        return "articlesPageCache";
    }else if (pType === pageCacheType.accountsList) {
        return "accountsPageCache";
    }else if (pType === pageCacheType.usrArticleList) {
        return "userArticlesPageCache";
    }else if (pType === pageCacheType.blkTxsList) {
        return "blockTxsPageCache";
    } else if (pType === pageCacheType.contractsList) {
        return "contractsPageCache";
    } else if (pType === pageCacheType.bpList) {
        return "bpListPageCache";
    }
    return "cacheKey"
}


function addComplexCacheKey(keyStr) {
    if (typeof keyStr == "string") {
        let cacheInfo = sessionStorage.getItem(complexCacheMapKey);
        let cacheMap = null;
        if(cacheInfo) {
            cacheMap = JSON.parse(cacheInfo);
        }else {
            cacheMap = {};
        }
        cacheMap[keyStr] = keyStr;
        sessionStorage.setItem(complexCacheMapKey,JSON.stringify(cacheMap));
    }
}

function removeComplexCacheKey(keyStr) {
    if (typeof keyStr == "string") {
        let cacheInfo = sessionStorage.getItem(complexCacheMapKey);
        if(cacheInfo) {
            let cacheMap = JSON.parse(cacheInfo);
            if (cacheMap) {
                if (cacheMap.hasOwnProperty(keyStr)) {
                    delete cacheMap[keyStr];
                    sessionStorage.setItem(complexCacheMapKey,JSON.stringify(cacheMap));
                }
            }
        }
        if (sessionStorage.getItem(keyStr)) {
            sessionStorage.removeItem(keyStr);
        }
    }
}

function clearAllComplexCache() {
    let cacheInfo = sessionStorage.getItem(complexCacheMapKey);
    if (cacheInfo) {
        let cacheMap = JSON.parse(cacheInfo);
        if (cacheMap) {
            for(let keyStr in cacheMap) {
                if (sessionStorage.getItem(cacheMap[keyStr])) {
                    sessionStorage.removeItem(cacheMap[keyStr]);
                }
            }
        }
        sessionStorage.removeItem(complexCacheMapKey);
    }

}

function getTestNetName() {
    return "/testnet";
}

//
function ajax(action, args, done, fail) {
    var a = ajaxSplitAction(action), i,
        method = a[0], url = a[1],
        xhr = new XMLHttpRequest();

    if (method == "get") {
        url += url.indexOf("?") == -1 ? "?" : "&";
        for (i in args) args[i] === undefined || (url += encodeURIComponent(i) + "=" + encodeURIComponent(args[i]) + "&");
        url += "timestamp=" + Date.now();
        url = url.slice(0, -1);
        args = null;
    }

    xhr.open(method, url);
    xhr.onload = function (e) {
        if (this.status < 300)
            typeof done == "function" && done(this.response, e);
        else
            typeof fail == "function" && fail(e);
    };
    xhr.onabort = xhr.onerror = xhr.ontimeout = fail;

    if (args)
        xhr.setRequestHeader("content-type", "application/json; charset=utf-8");
    else
        args = undefined; // convert null  to undefined, JSON.stringify(undefined) not create string

    // wtf - webpack require window.JSON.stringify
    xhr.send(window.JSON.stringify(args));
    return xhr;
}

function ajaxSplitAction(s) {
    var i = s.indexOf(" "), method, url;

    if (i == -1) {
        method = "get";
        url = s;
    } else {
        method = s.slice(0, i).toLowerCase();
        url = s.slice(i + 1);
    }

    return [method, url];
}

function millisecondsToMinutesAndSeconds(ms) {
    var seconds = Math.round(ms / 1000),
        min = ("00" + Math.floor(seconds / 60)).slice(-2),
        sec = ("00" + seconds % 60).slice(-2);

    return min + "'" + sec + '"';
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberAddComma(n) {
    n = +n || 0;

    var parts = n.toString().split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
// Andy E
function parseQueryString(s) {
    var ret = {}, match, search = /([^&=]+)=?([^&]*)/g;

    while (match = search.exec(s))
        ret[decode(match[1])] = decode(match[2]);

    return ret;
    function decode(s) {
        var pl = /\+/g; // Regex for replacing addition symbol with a space
        return decodeURIComponent(s.replace(pl, " "));
    }
}

function q(elementOrSelector, selectorOrAll, all) {
    if (typeof elementOrSelector == "string")
        return selectorOrAll ? document.querySelectorAll(elementOrSelector) : document.querySelector(elementOrSelector);
    else
        return all ? elementOrSelector.querySelectorAll(selectorOrAll) : elementOrSelector.querySelector(selectorOrAll);
}

// http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
// Nofi
function timeConversion(millisec) {
    millisec = Math.max(millisec, 0);
    let seconds = (millisec / 1000).toFixed(0),
        minutes = (millisec / (1000 * 60)).toFixed(0),
        hours = (millisec / (1000 * 60 * 60)).toFixed(0),
        days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0),
        years = (millisec / (1000 * 60 * 60 * 24 * 365)).toFixed(0);

    if (seconds < 60)
        return seconds + (seconds > 1 ? " Secs" : " Sec");
    else if (minutes < 60)
        return minutes + (minutes > 1 ? " Mins" : " Min");
    else if (hours < 24)
        return hours + (hours > 1 ? " Hrs" : " Hr");
    else if (days < 365)
        return days + (days > 1 ? " Days" : " Day");
    else
        return years + (years > 1 ? " Years" : " Year");
}

function timeConversionSec(millisec) {
    millisec = Math.max(millisec, 0);
    return (millisec / 1000).toFixed(1) + " Sec";
}

function toWei(n) {
    // "kNas", "MNas", "GNas", "TNas", "PNas", "ENas", "ZNas", "YNas"
    var arr = ["Wei", "kWei", "MWei", "GWei", "TWei", "PWei", "Nas"],
        i, len = arr.length - 1;

    for (i = 0, n = +n || 0; i < len && n >= 1000; ++i, n /= 1000);

    n = n.toFixed();
    return (i == len ? numberAddComma(n) : n) + " " + arr[i];
}

function easyNumber(num) {
    return num && num
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
        });
}

// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
function ua() {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    return {
        isBlink: isBlink,
        isChrome: isChrome,
        isEdge: isEdge,
        isFirefox: isFirefox,
        isIE: isIE,
        isOpera: isOpera,
        isSafari: isSafari
    };
}

// https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
// D-Money, Hero Qu
function yyyymmdd(dateNow) {
    var d = new Date(dateNow);
    return 10000 * d.getFullYear() + 100 * d.getMonth() + 100 + d.getDate();
}


function getContentosNetHost(net){
    var mainnet = 'https://mainnet.nebulas.io/v1'

    if(!net){
        return mainnet
    }

    if (net.toLowerCase() == 'testnet') {
        return 'https://testnet.nebulas.io/v1'
    }

    return mainnet
}

/**
 * judge the search type 1：search block 2:search account name 3: search trx
 */
function judgeSearchType(content) {
      //judge block
      let blkRegular=/^[0-9]{1,20}$/;
      if (blkRegular.test(content)) {
          //search block number
          return 1;
      }

      //judge account
      let accountRegular = /^[A-Za-z0-9]*$/;
      if (accountRegular.test(content)) {
          if (content.length >= 64) {
              //judge trx
              return 3;
          }
          return 2;
      }

      //judge trx
     let trxRegular = /^[0-9a-fA-F]+$/;
      if (trxRegular.test(content)) {
          return 3;
      }
     return -1;
}

/**
 * convert byte array to 16 Hex
 */
function convertByteToHexString(arrBytes) {
    let str = "";
    for (let i = 0; i < arrBytes.length; i++) {
        let tmp;
        let num=arrBytes[i];
        if (num < 0) {
            tmp =(255+num+1).toString(16);
        } else {
            tmp = num.toString(16);
        }
        if (tmp.length === 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}

function convertHexStringToByteArray(str) {
    let pos = 0;
    let len = str.length;
    if (len % 2 !== 0) {
        return null;
    }
    len /= 2;
    let arrBytes = [];
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        arrBytes.push(v);
        pos += 2;
    }
    return arrBytes;
}

function formatBlockSize(blkSize)  {
    if (typeof blkSize != "number" && typeof blkSize != "string") {
        return "0";
    }
    let size = 0;
    if (typeof blkSize == "string") {
        size = parseInt(blkSize);
    }else  {
        size = blkSize
    }
    if (size <= 0) {
        return "0"
    }else if (size >= 1024*1024) {
        return handleDecimalPointNum(size/(1024*1024)) + "M";
    }else if (size >= 1024) {
        return handleDecimalPointNum(size/1024) + "K";
    }else {
        return size+"B";
    }
}

/**
 *  Keep two decimals if decimal number greater than 2
 * @param num : origin value
 * @return: return  value with two decimals
 */
function  handleDecimalPointNum(num) {
    let decimalPos = String(num).indexOf('.') + 1;
    let decimalNum = String(num).length - decimalPos;
    if (decimalNum > 3) {
        return num.toFixed(3);
    }
    return num;
}

function formatTxsCount(count) {
    if (typeof count != "number" && typeof count != "string") {
        return "0";
    }
    let num = 0;
    if (typeof count == "string") {
        num = Number(count);
    }else {
        num = count;
    }
    if (num >= 1000000) {
        return handleDecimalPointNum(num/1000000) + "M"
    }else if (num >= 1000) {
        return handleDecimalPointNum(num/1000) + "K"
    } else {
        return num;
    }
}

function updateIrreversibleBlkNum(num) {
    if (num != null && typeof num != "undefined") {
        irreversibleNum = num;
    }
}

function getIrreversibleBlkNum() {
    return irreversibleNum;
}


function getTrxReceiptStatusByTrxInfo(trx) {
    if (trx != null && typeof trx != "undefined" && trx.hasTrxWrap() && trx.getTrxWrap()) {
        return getTrxReceiptStatusByWrap(trx.getTrxWrap());
    }
    return "Unknown";
}

function getTrxReceiptStatusByWrap(txWrap) {
    if (txWrap != null && typeof txWrap != "undefined" && txWrap.hasReceipt()) {
        let status =txWrap.getReceipt().getStatus();
        if (status === 200) {
            return "Success";
        } else if (status === 201) {
            return "Fail But Deducted Stamina"
        } else if ( status === 500) {
            return "Fail";
        }
    }
    return "Unknown";
}

function judgeIsNotEmpty(obj) {
    return obj != null && typeof obj != "undefined";
}

function filterXSS(data) {
    return xss(data, {
        whiteList: {
            // a: ['title', 'target', 'class', 'data-id'],
        },
        stripIgnoreTag: true, // Filter all non-whitelisted HTML
        stripIgnoreTagBody: ['script'], // The script tag is special, you need to filter the content in the middle of the tag.
    });
}
