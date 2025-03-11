const { getBackendOrigin } = require("@/assets/utility");
const axios = require('axios');

async function get(url, params) {
    try {
        const response = await axios.get(url, { params });
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error();
    }
}
module.exports = {
    async fetchChannelVipData(limit) {
        const url = getBackendOrigin() + '/api/v3.0/explorer/channel-vip/statistic';
        return await get(url, { limit });
    },
};


