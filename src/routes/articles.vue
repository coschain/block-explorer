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
        <template v-if="postList.length">
            <div class="container maxPageTips">Display the latest 50 pages of data</div>
            <div  class="container">
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
                                <router-link v-bind:to='fragApi + "/account/" + post.getAuthor().getValue()' target="_blank">
                                    <span class="hash-normal monospace">{{ post.getAuthor().getValue() }}</span>
                                </router-link>
                            </td>
                            <td class="articlesListContentCol">{{fetchPostTitleFromPostInfo(post)}}</td>
                            <td class="articlesListContentCol">{{ new Date(post.getCreated().getUtcSeconds()*1000).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
                            <td class="articlesListContentCol">
                                <router-link v-bind:to='fragApi + "/article-detail/" + post.getPostId()' target="_blank">
                                    <span class="hash-normal monospace">{{ post.getPostId()}}</span>
                                </router-link>
                            </td>
                            <td class="articlesListContentCol">{{post.getRewards().toString()}}</td>
                        </tr>
                    </table>
                </div>
                <div v-if="isShowLoadMore" class="loadMore-container">
                    <button type="button" class="loadMoreBtn" @click="onClickLoadNextPageArticles()">Load More</button>
                </div>
            </div>
        </template>
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
            "vue-blockies": require("@/components/vue-blockies").default
        },
        data() {
            return {
                arr: null,
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                postList: [],
                postPageInfo:[],
                postListStart: null,
                postListEnd: null,
                lastPost: null,
                sortType:ArticleListSortType.listSortTypeCreTime,//current sort type
                timeStart: null,
                timeEnd: null,
                vestStart: null,
                vestEnd: null,
                isShowLoadMore: true,
                isFetching: false,
                maxArticlePagesNum: 50,
            };
        },
        methods: {
            nthPage(lastType, p) {
                if (p < this.currentPage || p > this.maxArticlePagesNum) {
                    this.isFetching = false;
                    return;
                }
                this.$root.showModalLoading = true;
                let isChangeSortType = false;
                if (lastType !== this.sortType) {
                    isChangeSortType = true;
                    if (p !== 1) {
                        p = 1;
                    }
                }
                let start = this.timeStart;
                if (this.sortType === ArticleListSortType.listSortTypeVest) {
                    start = this.vestStart;
                }
                let lastPost = this.lastPost;

                if (this.sortType === ArticleListSortType.listSortTypeCreTime) {
                    this.fetchActListByCreateTime(p,start, lastPost, isChangeSortType);
                }else if (this.sortType === ArticleListSortType.listSortTypeVest) {
                    this.fetchActListByVest(p,start, lastPost, isChangeSortType)
                }else {
                    this.$root.showModalLoading = false;
                }

            },

            numberAddComma(n) {
                return utility.numberAddComma(n);
            },

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
                cacheData.sortType = this.sortType;
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
                    this.currentPage = 1;
                    this.postList = [];
                    this.isShowLoadMore = true;
                    // this.clearCachePageInfo();
                    this.savePageInfo();
                    this.nthPage(originType, 1);
                }
            },

            fetchActListByCreateTime(p,start,lastPost,isSwitchSortType) {
                api.fetchArticleListByCreateTime(start,null,pageSize,lastPost,articleList => {
                    this.handleFetchArticleListSuccessEvent(p,articleList,ArticleListSortType.listSortTypeCreTime,isSwitchSortType);
                    this.isFetching = false;
                },(errCode,msg) => {
                    console.log("Get post list by create time fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
                    if (this.sortType === ArticleListSortType.listSortTypeCreTime) {
                        if (isSwitchSortType) {
                            this.postList = [];
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                });
            },


            async fetchActListByVest(p,start,lastPost,isSwitchSortType) {
                let result = await api.fetchPostListByVest(start,null,lastPost,pageSize);
                if  (result.res) {
                    this.handleFetchArticleListSuccessEvent(p,result.res,ArticleListSortType.listSortTypeVest,isSwitchSortType);
                    this.isFetching = false;
                } else {
                    this.isFetching = false;
                    if (this.sortType === ArticleListSortType.listSortTypeVest) {
                        if (isSwitchSortType) {
                            this.postList = [];
                        }
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                    }
                    console.log("Get post list by vest fail,error code is %s,msg is %s",result.errCode, result.errMsg);
                }
            },

            handleFetchArticleListSuccessEvent(p,postList,sortType,isSwitchSortType) {
                if (sortType === this.sortType) {
                    let listLen = postList.length;
                    if (listLen > 0) {
                        this.postList = this.postList.concat(postList);
                        this.lastPost = postList[postList.length-1];
                        let info = {post:this.lastPost};
                        if (sortType === ArticleListSortType.listSortTypeVest) {
                            this.vestStart = this.lastPost.getRewards();
                            if (this.currentPage === 0) {
                                this.vestEnd = null;
                            }else {
                                this.vestEnd = postList[0].getRewards();
                            }
                            info.start =  this.vestStart;
                        }else if (sortType === ArticleListSortType.listSortTypeCreTime) {
                            this.timeStart = this.lastPost.getCreated();
                            if (this.currentPage === 0) {
                                this.timeEnd = null;
                            }else {
                                this.timeEnd = postList[0].getCreated();
                            }
                            info.start = this.timeStart;
                        }

                        let curPageLen = this.postPageInfo.length;
                        if (curPageLen === 0) {
                            info.end = this.firstPageEnd;
                        } else {
                            if (curPageLen >= 1) {
                                info.end = this.postPageInfo[curPageLen - 1].start;
                            }

                        }
                        this.postPageInfo.push(info);
                        this.currentPage = parseInt(p);
                        this.savePageInfo();
                    } else if (isSwitchSortType) {
                        //clear post list when switch sortType
                        this.postList = [];
                    }

                    this.$root.showModalLoading = false;
                    this.isShowLoadMore = this.currentPage < this.maxArticlePagesNum;
                }
            },

            onClickLoadNextPageArticles() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.sortType, this.currentPage+1);
            }
        },
        mounted() {
            let cacheData = this.getPageInfo();
            let isQueryData = true;
            if (cacheData != null) {
                this.sortType = parseInt(cacheData.sortType);
            }
            this.nthPage(this.sortType, 1);

        },
        watch: {
            $route() {
                this.nthPage(this.sortType, 1);
            }
        },


        destroyed() {
            if (this.currentPage <= 1 && this.sortType !== ArticleListSortType.listSortTypeVest) {
                this.clearCachePageInfo();
            }
        }
    };
</script>
