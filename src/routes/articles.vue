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
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: #e8e8e8;
        font-size: 11px ;
    }

    .vue-articles .headSelectStatus {
        background-color: #e8e8e8;
    }

    .vue-articles .articlesListHeadCol {
        width: 20%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

    }

    .vue-articles .sortHeadCol {
        width: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }

    .vue-articles .sortHeadCol:hover {
        background-color: #e8e8e8;
    }

    .vue-articles .sortHeadCol:focus-within {
        background-color: #e8e8e8;
    }
    .vue-articles .articlesListContentCol {
        display:inline-block;
        width: 20%;
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
    <div class="vue-articles fullfill">
        <vue-bread title="Posted Articles"></vue-bread>

        <div v-if="postList" class="container mt20">
            <div class="explorer-table-container">
                <table class="mt20 explorer-table">
                    <tr class="articlesListHeader font-bold font-color-000000">
                        <th class="articlesListHeadCol">Author</th>
                        <th class="articlesListHeadCol">Title</th>
                        <th :class='[sortType === 1?"sortHeadCol headSelectStatus":"sortHeadCol"]' @click="switchListSortType(1)">
                            <div> Date Created</div>
                            <div :class='[sortType === 1?"arrow-down selected-arrow-down":"arrow-down"]' @click="switchListSortType(1)"></div>
                        </th>
                        <th class="articlesListHeadCol">Id</th>
                        <th :class='[sortType === 2?"sortHeadCol headSelectStatus":"sortHeadCol"]' @click="switchListSortType(2)">
                            <div>Reward</div>
                            <div :class='[sortType === 2?"arrow-down selected-arrow-down":"arrow-down"]' @click="switchListSortType(2)"></div>
                        </th>
                    </tr>

                    <tr v-for="(post, i) in postList" :key="i">
                        <td class="articlesListContentCol">
                            <router-link v-bind:to='fragApi + "/account/" + post.getAuthor().getValue()'>
                                <span class="hash-normal monospace">{{ post.getAuthor().getValue() }}</span>
                            </router-link>
                        </td>
                        <td class="articlesListContentCol">{{fetchPostTitleFromPostInfo(post)}}</td>
                        <td class="articlesListContentCol">{{ new Date(post.getCreated().getUtcSeconds()*1000).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
                        <td class="articlesListContentCol">
                            <router-link v-bind:to='fragApi + "/article-detail/" + post.getPostId()'>
                                <span class="hash-normal monospace">{{ post.getPostId()}}</span>
                            </router-link>
                        </td>
                        <td class="articlesListContentCol">{{post.getRewards().toString()}}</td>
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
    const ArticleListSortType = {
        listSortTypeUnknown : 0,//unknown type
        listSortTypeCreTime : 1,//article list sort by create time
        listSortTypeVest : 2,//article list sort by vest
    };
    const pageSize = 30;
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
                createdPageIndex:0,
                sortType:ArticleListSortType.listSortTypeCreTime,//current sort type
                timeStart: null,
                timeEnd: null,
                vestStart: null,
                vestEnd: null,
            };
        },
        methods: {
            nav(n) {
                if (n < this.createdPageIndex && this.createdPageIndex >= this.currentPage) {
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
            nthPage(lastType) {
                let p = this.$route.query.p || 1;
                this.$root.showModalLoading = true;
                let isChangeSortType = false;
                if (lastType !== this.sortType) {
                    isChangeSortType = true
                }
                let start = this.timeStart;
                if (this.sortType === ArticleListSortType.listSortTypeVest) {
                    start = this.vestStart;
                }
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

                if (this.sortType === ArticleListSortType.listSortTypeCreTime) {
                    this.fetchActListByCreateTime(p,start, pReqType, lastPost, isChangeSortType);
                }else if (this.sortType === ArticleListSortType.listSortTypeVest) {
                    this.fetchActListByVest(p,start, pReqType, lastPost, isChangeSortType)
                }else {
                    this.$root.showModalLoading = false;
                }

            },

            updateArticlesPageInfo(index,pageInfo) {
                if( pageInfo  /*&& index < this.postPageInfo.length*/) {
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
                cacheData.createdPageIndex = this.createdPageIndex;
                cacheData.sortType = this.sortType;
                let listLen = this.postPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.postPageInfo.forEach(function (info) {
                        let obj = {};
                        if (cacheData.sortType === ArticleListSortType.listSortTypeVest && info.start instanceof api.cos_sdk.raw_type.vest){
                            obj.start = info.start?info.start.getValue():null;
                            obj.post = info.post?info.post.toObject():null;
                            pageList.push(obj);
                        }else if (cacheData.sortType === ArticleListSortType.listSortTypeCreTime && (info.start instanceof api.cos_sdk.raw_type.time_point_sec)){
                            obj.start = info.start?info.start.getUtcSeconds():null;
                            obj.post = info.post?info.post.toObject():null;
                            pageList.push(obj);
                        }

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
            },
            fetchPostTitleFromPostInfo(info) {
                if (info != null && typeof info != "undefined") {
                    let pId = info.getParentId();
                    if (pId.length > 0 && BigNumber(pId).comparedTo(0) === 1) {
                        //if the parentId exist,indicate is reply
                        return "Reply";
                    }
                    return info.getTitle();
                }
                return ""
            },

            switchListSortType(type) {
                if (type !== this.sortType) {
                    let originType = this.sortType;
                    this.sortType = type;
                    this.lastPost = null;
                    this.vestStart = null;
                    this.vestEnd = null;
                    this.timeStart = null;
                    this.timeEnd = null;
                    // this.clearCachePageInfo();
                    this.savePageInfo();
                    let p = parseInt(this.$route.query.p || 1);
                    if (this.currentPage > 1) {
                        this.onGoFirstPage()
                    } else if (p > 1) {
                        this.currentPage = 2;
                        this.$router.go(1-p);
                    } else {
                        this.nthPage(originType);
                    }
                }
            },

            fetchActListByCreateTime(p,start,pReqType,lastPost,isSwitchSortType) {
                api.fetchArticleListByCreateTime(start,null,pageSize,lastPost,articleList => {
                    this.handleFetchArticleListSuccessEvent(p,articleList,pReqType,ArticleListSortType.listSortTypeCreTime,isSwitchSortType);
                },(errCode,msg) => {
                    console.log("Get post list by create time fail,error code is %s,msg is %s",errCode,msg);
                    if (this.sortType === ArticleListSortType.listSortTypeCreTime) {
                        if (isSwitchSortType) {
                            this.postList = null;
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                });
            },


            async fetchActListByVest(p,start,pReqType,lastPost,isSwitchSortType) {
                let result = await api.fetchPostListByVest(start,null,lastPost,pageSize);
                if  (result.res) {
                    this.handleFetchArticleListSuccessEvent(p,result.res,pReqType,ArticleListSortType.listSortTypeVest,isSwitchSortType);
                } else {
                    if (this.sortType === ArticleListSortType.listSortTypeVest) {
                        if (isSwitchSortType) {
                            this.postList = null;
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                    console.log("Get post list by vest fail,error code is %s,msg is %s",result.errCode, result.errMsg);
                }
            },

            handleFetchArticleListSuccessEvent(p,postList,pReqType,sortType,isSwitchSortType) {
                if (sortType === this.sortType) {
                    let listLen = postList.length;
                    if (listLen > 0) {
                        this.postList = postList;
                        this.lastPost = postList[postList.length-1];
                        let info = {post:this.lastPost};
                        if (sortType === ArticleListSortType.listSortTypeVest) {
                            this.vestStart = this.lastPost.getRewards();
                            if (this.currentPage === 0 && pReqType === 1) {
                                this.vestEnd = null;
                            }else {
                                this.vestEnd = postList[0].getRewards();
                            }
                            info.start =  this.vestStart;
                        }else if (sortType === ArticleListSortType.listSortTypeCreTime) {
                            this.timeStart = this.lastPost.getCreated();
                            if (this.currentPage === 0 && pReqType === 1) {
                                this.timeEnd = null;
                            }else {
                                this.timeEnd = postList[0].getCreated();
                            }
                            info.start = this.timeStart;
                        }

                        let curPageLen = this.postPageInfo.length;
                        if (curPageLen === 0 || (this.currentPage == 1 && pReqType === 3)) {
                            info.end = this.firstPageEnd;
                        }
                        if (pReqType === 1) {
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
                            if (this.createdPageIndex < this.totalPage) {
                                this.createdPageIndex += 1;
                            }
                        }else if (pReqType === 0) {
                            this.currentPage -= 1;
                            if (this.currentPage >= 2 && this.currentPage <= curPageLen) {
                                info.end = this.postPageInfo[this.currentPage-2].start;
                            }
                            this.updateArticlesPageInfo(this.currentPage-1,info);
                        }else if (pReqType == 3) {
                            this.currentPage = parseInt(p);
                            // if (isSwitchSortType) {
                                this.updateArticlesPageInfo(this.currentPage-1,info);
                            // }
                        }
                        this.savePageInfo();
                    } else if (isSwitchSortType) {
                        //clear post list when switch sortType
                        this.postList = null;
                    }

                    this.$root.showModalLoading = false;
                }
            }
        },
        mounted() {
            let cacheData = this.getPageInfo();
            let isQueryData = true;
            if (cacheData != null) {
                this.currentPage = parseInt(cacheData.currentPage);
                this.totalPage = parseInt(cacheData.totalPage);
                this.createdPageIndex = parseInt(cacheData.createdPageIndex);
                this.sortType = parseInt(cacheData.sortType);
                if (cacheData.pageInfo != null) {
                    let list = [];
                    let sortType = this.sortType;
                    cacheData.pageInfo.forEach(function (obj) {
                        let info = {};
                        if (obj.start != null) {
                            if (sortType === ArticleListSortType.listSortTypeCreTime) {
                                let start = new api.cos_sdk.raw_type.time_point_sec();
                                start.setUtcSeconds(obj.start);
                                info.start = start;
                            } else if (sortType === ArticleListSortType.listSortTypeVest) {
                                let start = new api.cos_sdk.raw_type.vest();
                                start.setValue(obj.start);
                                info.start = start;
                            }

                        }
                        // if (obj.end != null ) {
                        //     if (sortType === ArticleListSortType.listSortTypeCreTime) {
                        //         let end = new api.cos_sdk.raw_type.time_point_sec();
                        //         end.setUtcSeconds(obj.end);
                        //         info.end = end;
                        //     } else if (sortType === ArticleListSortType.listSortTypeVest) {
                        //         let end = new api.cos_sdk.raw_type.vest();
                        //         end.setValue(obj.end);
                        //         info.end = end;
                        //     }
                        //
                        // }
                        if (obj.post != null) {
                            let lastInfo = new api.cos_sdk.grpc.PostResponse();
                            lastInfo.setPostId(obj.post.postId);
                            if (sortType === ArticleListSortType.listSortTypeCreTime) {
                                let time = new api.cos_sdk.raw_type.time_point_sec();
                                time.setUtcSeconds(obj.post.created.utcSeconds);
                                lastInfo.setCreated(time);
                            } else if (sortType === ArticleListSortType.listSortTypeVest) {
                                let vest = new api.cos_sdk.raw_type.vest();
                                vest.setValue(obj.post.rewards.value);
                                lastInfo.setRewards(vest)
                            }
                            info.post = lastInfo;
                        }
                        list.push(info);
                    });
                    this.postPageInfo = list;
                }
                if (this.currentPage == 1) {
                    this.timeStart = null;
                    this.vestStart = null;
                    this.lastPost = null;
                }else if (this.currentPage >= 2 && this.postPageInfo.length >= this.currentPage){
                    let lastInfo = this.postPageInfo[this.currentPage-2];
                    if (this.sortType === ArticleListSortType.listSortTypeCreTime) {
                        this.timeStart = lastInfo.start;
                    }else if (this.sortType === ArticleListSortType.listSortTypeVest) {
                        this.vestStart = lastInfo.start;
                    }
                    this.lastPost = lastInfo.post;
                }
            } else {
                let p = this.$route.query.p;
                //now the chain not support page skip request,so in this condition just request from page 1
                if (p > 1) {
                    let query = JSON.parse(window.JSON.stringify(this.$route.query));
                    query.p = 1;
                    this.currentPage = 0;
                    this.totalPage = 1;
                    this.$router.replace({ path: this.$route.path, query });
                    isQueryData = false;
                }
            }
            if (isQueryData) {
                this.nthPage(this.sortType);
            }
        },
        watch: {
            $route() {
                this.nthPage(this.sortType);
            }
        },

        beforeDestroy() {
            this.createdPageIndex = this.currentPage;
            this.totalPage = this.currentPage+1;
            this.savePageInfo();
        },

        destroyed() {
            if (this.currentPage <= 1 && this.sortType !== ArticleListSortType.listSortTypeVest) {
                this.clearCachePageInfo();
            }
        }
    };
</script>
