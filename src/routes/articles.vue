<style>
    .vue-articles {
        background-color: white;
    }

    .vue-articles .info-and-pagination .info a {
        color: inherit;
    }

    .vue-articles td,
    .vue-articles th {
        border-top-color: #ddd;
    }

    .vue-articles .hash {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        white-space: nowrap;
    }

    .vue-articles .hash>* {
        display: inline;
    }

    .vue-articles .block {
        margin-right: 8px;
    }

    .vue-articles .articlesListHeader {
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: #e8e8e8;
        font-size: 11px ;
    }

    .vue-articles .articlesListHeadCol {
        width: 25%;
    }

    .vue-articles .articlesListContentCol {
        display:inline-block;
        width: 25%;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    @media (max-width: 767.98px) {
        .vue-articles .title {
            font-size: 20px;
        }
    }


</style>
<template>
    <!-- https://etherscan.io/txs -->
    <div class="vue-articles fullfill">
        <vue-bread title="Posted Articles"></vue-bread>

        <div v-if="postList" class="container mt20">
            <!--<div class="align-items-center info-and-pagination mt20 row">-->
                <!--<div class="col info font-color-000000 font-24 font-bold title">{{ numberAddComma(totalCts) }} articles found</div>-->
                <!--&lt;!&ndash;(showing the last {{ maxDisplayCnt }} records)&ndash;&gt;-->
            <!--</div>-->

            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="articlesListHeader font-bold font-color-000000">
                        <th class="articlesListHeadCol">Author</th>
                        <th class="articlesListHeadCol">Title</th>
                        <th class="articlesListHeadCol">Id</th>
                        <th class="articlesListHeadCol">Date Created</th>
                    </tr>

                    <tr v-for="(post, i) in postList" :key="i">
                        <td class="articlesListContentCol">
                            <!--<vue-blockies v-bind:account='post.getAuthor().getValue()'></vue-blockies>-->
                            <router-link v-bind:to='fragApi + "/account/" + post.getAuthor().getValue()'>
                                <span class="hash-normal monospace">{{ post.getAuthor().getValue() }}</span>
                            </router-link>
                        </td>
                        <td class="articlesListContentCol">{{post.getTitle()}}</td>
                        <td class="articlesListContentCol">{{ post.getPostId()}} </td>
                        <td class="articlesListContentCol">{{ new Date(post.getCreated().getUtcSeconds()*1000).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                v-on:prev=onPrev v-on:firstPage=onGoFirstPage></vue-pagination>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    const articlesPageCacheKey = utility.getPageCacheKey(utility.pageCacheType.articleList);
    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
            "vue-blockies": require("@/components/vue-blockies").default
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                totalPage: 1,
                totalCts: 0,
                postList:null,
                postPageInfo:[],
                postListStart: null,
                postListEnd: null,
                lastPost: null,
            };
        },
        methods: {
            nav(n) {
                if (n < this.totalPage) {
                    if (n < this.currentPage) {
                        this.$router.back();
                    }else {
                        this.$router.forward();
                    }
                } else {
                    let query = JSON.parse(window.JSON.stringify(this.$route.query));
                    query.p = n;
                    this.$router.push({ path: this.$route.path, query });
                }
            },
            nthPage() {
                let p = this.$route.query.p || 1;
                this.$root.showModalLoading = true;
                let start = this.postListStart;
                let isNextPage = true;
                let lastPost = this.lastPost;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                let infoLen = this.postPageInfo.length;

                if (p < this.currentPage) {
                    //fetch next pre page
                    if (this.currentPage == 2 ) {
                        start = null;
                        lastPost= null;
                    }else {
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.postPageInfo[this.currentPage-3];
                            start = info.start;
                            lastPost = info.post;
                        }
                    }
                    pReqType = 0;
                    isNextPage = false;
                }else if (this.currentPage == p) {
                    //refresh current page
                    pReqType = 3;
                }
                api.fetchArticleListByCreateTime(start,null,30,lastPost,postList => {
                    if (postList.length) {
                        this.postList = postList;
                        this.lastPost = postList[postList.length-1];
                        this.postListStart = this.lastPost.getCreated();
                        if (this.currentPage === 0 && isNextPage) {
                            this.postListEnd = null;
                        }else {
                            this.postListEnd = postList[0].getCreated();
                        }
                        let info = {start:this.postListStart,post:this.lastPost};
                        let curPageLen = this.postPageInfo.length;
                        if (curPageLen === 0 || (this.currentPage == 1 && pReqType == 3)) {
                            info.end = this.firstPageEnd;
                        }
                        if (pReqType == 1) {
                            if (this.currentPage + 1 == this.totalPage) {
                                this.totalPage += 1;
                                if (curPageLen >= 1) {
                                    info.end = this.postPageInfo[curPageLen - 1].start;
                                }
                                this.postPageInfo.push(info);
                            }else {
                                if (curPageLen >= 1 && this.currentPage <= curPageLen) {
                                    info.end = this.postPageInfo[this.currentPage-1].start;
                                }
                                this.updateArticlesPageInfo(this.currentPage,info);
                            }
                            this.currentPage += 1;
                        }else if (pReqType == 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 2 && this.currentPage <= curPageLen) {
                                info.end = this.postPageInfo[this.currentPage-2].start;
                            }
                            this.updateArticlesPageInfo(this.currentPage-1,info);
                        }else if (pReqType == 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.$root.showModalLoading = false;
                    this.savePageInfo();
                },(errCode,msg) => {
                    console.log("Get Post list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
            },

            updateArticlesPageInfo(index,pageInfo) {
                if(pageInfo && index < this.postPageInfo.length) {
                    this.postPageInfo.splice(index,1,pageInfo);
                }
            },

            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                this.nav(this.currentPage - 1);
            },
            onLast() {
                this.nav(this.currentPage + 1);
            },
            onNext() {
                this.nav(this.currentPage + 1);
            },
            onPrev() {
                this.nav(this.currentPage - 1);
            },
            onGoFirstPage() {
                if (this.currentPage > 1) {
                    let page = this.currentPage;
                    let p = this.$route.query.p;
                    if (parseInt(p) > page) {
                        page = parseInt(p);
                    }
                    this.currentPage = 2;
                    this.$router.go(1-page);
                }
            },
            // onTo(n) {
            //     this.nav(n);
            // },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },  
            toWei(n) {
                return utility.toWei(n);
            },
            easyNumber(n) {
                return utility.easyNumber(n);
            },
            tokenAmount(n) {
                BigNumber.config({ DECIMAL_PLACES: 18 });
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount();
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                let listLen = this.postPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.postPageInfo.forEach(function (info) {
                        let obj = {};
                        obj.start = info.start?info.start.getUtcSeconds():null;
                        obj.end = info.end?info.end.getUtcSeconds():null;
                        obj.post = info.post?info.post.toObject():null;
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastInfo = null;
                }
                sessionStorage.setItem(articlesPageCacheKey,JSON.stringify(cacheData));

            },
            getPageInfo() {
                let info = sessionStorage.getItem(articlesPageCacheKey);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                if (sessionStorage.getItem(articlesPageCacheKey) != null) {
                    sessionStorage.removeItem(articlesPageCacheKey);
                }
            }
        },
        mounted() {
            let cacheData = this.getPageInfo();
            if (cacheData != null) {
                this.currentPage = parseInt(cacheData.currentPage);
                this.totalPage = parseInt(cacheData.totalPage);
                if (cacheData.pageInfo != null) {
                    let list = [];
                    cacheData.pageInfo.forEach(function (obj) {
                        let info = {};
                        if (obj.start != null) {
                            let start = new api.cos_sdk.raw_type.time_point_sec();
                            start.setUtcSeconds(obj.start);
                            info.start = start;
                        }
                        if (obj.end != null ) {
                            let end = new api.cos_sdk.raw_type.time_point_sec();
                            end.setUtcSeconds(obj.end);
                            info.end = end;
                        }
                        if (obj.post != null) {
                            let lastInfo = new api.cos_sdk.grpc.PostResponse();
                            let time = new api.cos_sdk.raw_type.time_point_sec();
                            time.setUtcSeconds(obj.post.created.utcSeconds);
                            lastInfo.setCreated(time);
                            lastInfo.setPostId(obj.post.postId);
                            info.post = lastInfo;
                        }
                        list.push(info);
                    });
                    this.postPageInfo = list;
                }
                if (this.currentPage == 1) {
                    this.postListStart = null;
                    this.lastPost = null;
                }else if (this.currentPage >= 2 && this.postPageInfo.length >= this.currentPage){
                    let lastInfo = this.postPageInfo[this.currentPage-2];
                    this.postListStart = lastInfo.start;
                    this.lastPost = lastInfo.post;
                }
            }
            this.nthPage();
        },
        watch: {
            $route() {
                this.nthPage();
            }
        },
        destroyed() {
            if (this.currentPage <= 1) {
                this.clearCachePageInfo();
            }
        }
    };
</script>
