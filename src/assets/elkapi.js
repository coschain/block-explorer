const { getElkProxy } = require("@/assets/utility");
const axios = require('axios');

async function fetchByPage(url, account, page, page_size) {
    const response = await axios.post(url, {
        account: account,
        page: page,
        page_size: page_size,
        order: "desc"
    });
    if (response.status === 200) {
        let events = [];
        let data = response.data;
        for(let r of data) {
           events.push(r._source)
        }
        return events
    } else {
        return []
    }
}

async function fetchCount(url, account) {
    const response = await axios.post(url, {
        account: account
    });
    if (response.status === 200) {
        return response.data
    } else {
        return 0
    }
}

module.exports = {
    async fetchAccountTrxsByPage(account, page, page_size) {
        const url = getElkProxy() + '/v1/account-events';
        return await fetchByPage(url, account, page, page_size);
    },
    async fetchAccountTrxsCount(account) {
        const url = getElkProxy() + '/v1/account-events-count';
        return await fetchCount(url, account);
    },
    async fetchAccountSendTrxsByPage(account, page, page_size) {
        const url = getElkProxy() + '/v1/account-send-txs';
        return await fetchByPage(url, account, page, page_size);
    },
    async fetchAccountSendTrxCount(account) {
        const url = getElkProxy() + '/v1/account-send-txs-count';
        return await fetchCount(url, account);
    },
    async fetchAccountFundHistoryByPage(account, page, page_size) {
        const url = getElkProxy() + '/v1/account-fund-history';
        return await fetchByPage(url, account, page, page_size);
    },
    async fetchAccountFundHistoryCount(account) {
        const url = getElkProxy() + '/v1/account-fund-history-count';
        return await fetchCount(url, account);
    },
    async fetchAccountEcoRewardByPage(account, page, page_size) {
        const url = getElkProxy() + '/v1/account-eco-events';
        return await fetchByPage(url, account, page, page_size);
    },
    async fetchAccountEcoRewardCount(account) {
        const url = getElkProxy() + '/v1/account-eco-events-count';
        return await fetchCount(url, account);
    }
};


