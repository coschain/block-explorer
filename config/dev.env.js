'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    VUE_APP_CHAIN: '"http://localhost:8080"',
    VUE_ELK_PROXY: '"http://localhost:7475"',
    backendOrigin: '"http://localhost:9091"',
})
