
module.exports = [{
    component: require("@/routes/account").default,
    meta: { headerActive: 2, uaview: "Explorer_Address_Show" },
    path: "/:api?/account/:id"
}, {
    component: require("@/routes/accounts").default,
    meta: { headerActive: 2 },
    path: "/:api?/accounts"
}, {
    component: require("@/routes/block").default,
    meta: { headerActive: 2 },
    path: "/:api?/block/:id"
}, {
    component: require("@/routes/blocks").default,
    meta: { headerActive: 2 },
    path: "/:api?/blocks/:irreversibleBlkNum"
}, {
    component: require("@/routes/tx").default,
    meta: { headerActive: 2, uaview: "Explorer_TxnsDetails_Show" },
    path: "/:api?/tx/:id"
}, {
    component: require("@/routes/txs").default,
    meta: { headerActive: 2 },
    path: "/:api?/txs"
}, {
    component: require("@/routes/block-trxs").default,
    meta: { headerActive: 2 },
    path: "/:api?/block-trxs/:blockNumber"
},{
    component: require("@/routes/DApp").default,
    meta: {headerActive: 2},
    path: "/:api?/DApp"
},{
    component: require("@/routes/testDApp").default,
    meta: {headerActive: 2},
    path: "/:api?/testDApp"
},{
    component: require("@/routes/contracts").default,
    meta: { headerActive: 2 },
    path: "/:api?/contracts"
},{
    component: require("@/routes/bp").default,
    meta: { headerActive: 2 },
    path: "/:api?/bp"
},{
    component: require("@/routes/user-article").default,
    meta: { headerActive: 2 },
    path: "/:api?/user-article/:author"
}, {
    component: require("@/routes/chain-state").default,
    meta: {headerActive: 2},
    path: "/:api?/chain-state"
}, {
    component: require("@/routes/txs-nrc20").default,
    meta: { headerActive: 2 },
    path: "/:api?/txs-nrc20"
},
// {
//     component: require("@/routes/txs-internal").default,
//     meta: { headerActive: 2 },
//     path: "/txs/internal/:id"
// },
{
    component: require("@/routes/txs-pending").default,
    meta: { headerActive: 2 },
    path: "/:api?/txs/pending"
}, {
    component: require("@/routes/404").default,
    path: "/:api?/404"
}, {
    component: require("@/routes/nothing").default,
    path: "/:api?/nothing"
}, {
    component: require("@/routes/articles").default,
    meta: { headerActive: 2 },
    path: "/:api?/articles"
}, {
    component: require("@/routes/contract-txs").default,
    meta: { headerActive: 2 },
    path: "/:api?/contract-txs"
}, {
    component: require("@/routes/dashboard").default,
    meta: { headerActive: 1, uaview: "Explorer_Home_Show" },
    path: "/:api?",
    name: "home"
}, {
    component: require("@/routes/404").default,
    name: "*",
    path: "*"
},{
    component: require("@/routes/follower").default,
    meta: { headerActive: 2 },
    path: "/:api?/follower/:account/"
},{
    component: require("@/routes/following").default,
    meta: { headerActive: 2 },
    path: "/:api?/following/:account/"
},{
    component: require("@/routes/user-trxs").default,
    meta: { headerActive: 2 },
    path: "/:api?/user-trxs/:account/"
},{
    component: require("@/routes/user-relevant").default,
    meta: { headerActive: 2 },
    path: "/:api?/user-relevant/:account/"
},{
    component: require("@/routes/user-vest-delegation").default,
    meta: { headerActive: 2 },
    path: "/:api?/user-vest-delegation/:account/:ordertype"
},{
    component: require("@/routes/article-detail").default,
    meta: {headerActive: 2},
    path: "/:api?/article-detail/:pId",
}, {
    component: require("@/routes/contract-detail").default,
        meta: {headerActive: 2},
        path: "/:api?/contract-detail/:cName/:owner",
}];
