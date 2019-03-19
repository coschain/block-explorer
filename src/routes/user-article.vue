<style>
    .vue-user-article {
        background-color: white;
    }

    .vue-user-article .info-and-pagination .info a {
        color: inherit;
    }

    .vue-user-article .tagAndContent {
        display:inline-block;
        width: 20%;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 17px;
    }

    .vue-user-article td,
    .vue-user-article th {
        border-top-color: #ddd;
    }

    .vue-user-article .hash {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        white-space: nowrap;
    }

    .vue-user-article .hash>* {
        display: inline;
    }

    .vue-user-article .block {
        margin-right: 8px;
    }

    .vue-user-article .header {
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

    .vue-user-article .headCol {
        width: 20%;
    }

    .vue-user-article .content {
        width: 10%;
    }

    @media (max-width: 767.98px) {
        .vue-user-article .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <div class="vue-user-article fullfill">
        <vue-bread v-bind:title='"Posted Articles by:"'
                   v-bind:subtitle="$route.params.author"
                   v-bind:subtitlemonospaced="!!$route.params.author">
        </vue-bread>
        <div v-if="postList" class="container mt20">

            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table">
                    <tr class=" header font-bold font-color-000000">
                        <th class=" headCol">Id</th>
                        <th class=" headCol">Title</th>
                        <th class="headCol">Content</th>
                        <th class="headCol">Tag</th>
                        <th class="headCol">Vote Count</th>
                    </tr>

                    <tr v-for="(post, i) in postList" :key="i">
                        <td  class="font-color-000000 tagAndContent"> {{post.getPostId()}} </td>
                        <td class="font-color-000000 tagAndContent">{{ post.getTitle() }}</td>
                        <td class="font-color-000000 tagAndContent ">{{ post.getBody()}} </td>
                        <td class="font-color-000000 tagAndContent">{{fetchArticleTag(post.getTagsList())}}</td>
                        <td  class="ont-color-000000 tagAndContent">{{post.getVoteCnt()}}</td>
                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                            v-on:prev=onPrev v-on:homePage=onGoHomePage></vue-pagination>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    import {cos_sdk} from "../../src/assets/api"

    const userArticlesCache = utility.getPageCacheKey(utility.pageCacheType.usrArticleList);

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
                postList: null,
                postPageInfo:[],
                postListStart: null,
                postListEnd: null,
                lastPost: null,
                firstPageStart: null,
                firstPageEnd: null,
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
                this.$root.showModalLoading = true;
                let p = this.$route.query.p || 1;
                let start = this.postListStart;
                let end = this.postListEnd;
                let isNextPage = true;
                let lastPost = this.lastPost;
                let pReqType = 1;// 0: request pre page  1: request next page  3: refresh current page
                if (p < this.currentPage) {
                    if (this.currentPage == 2 ) {
                        start = this.firstPageStart;
                        end = this.firstPageEnd;
                        lastPost= null;
                    }else {
                        let infoLen = this.postPageInfo.length;
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.postPageInfo[this.currentPage-3];
                            start = info.start;
                            lastPost = info.post;
                            end = info.end;
                        }
                    }
                    pReqType = 0;
                    isNextPage = false;
                }else if (this.currentPage == p) {
                    //refresh current page
                    pReqType = 3;
                }
                api.fetchArticleListByName(start,this.firstPageEnd,30,lastPost,postList => {
                    if (postList.length) {
                        this.postList = postList;
                        this.lastPost = postList[postList.length-1];
                        let listStart = new cos_sdk.multi_id.user_post_create_order();
                        listStart.setCreate(this.lastPost.getCreated());
                        listStart.setAuthor(this.lastPost.getAuthor());
                        this.postListStart = listStart;
                        if (this.currentPage == 0 && isNextPage) {
                            this.postListEnd = this.firstPageEnd;
                        }else {
                            let listEnd = new cos_sdk.multi_id.user_post_create_order();
                            listEnd.setCreate(postList[0].getCreated());
                            listEnd.setAuthor(postList[0].getAuthor());
                            this.postListEnd = listEnd;
                        }
                        if (pReqType == 1) {
                            if (this.currentPage + 1 == this.totalPage) {
                                this.totalPage += 1;
                                let curPageLen = this.postPageInfo.length;
                                let info = {start:this.postListStart,post:this.lastPost};
                                if (curPageLen === 0) {
                                    info.end = this.postListEnd;
                                }else if (curPageLen >= 1) {
                                    info.end = this.postPageInfo[curPageLen - 1].start;
                                }
                                this.postPageInfo.push(info);
                            }
                            this.currentPage += 1;
                        }else if (pReqType == 0) {
                            this.currentPage -= 1;
                        }else if (pReqType == 3) {
                            this.currentPage = parseInt(p);
                        }
                    }
                    this.$root.showModalLoading = false;
                    this.savePageInfo();
                },(errCode,msg) => {
                    console.log("Get user's Post list fail,error code is %s,msg is %s",errCode,msg);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
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
            onGoHomePage() {
                this.$router.replace(utility.getTestNetName());
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
            fetchArticleTag(tagsArray) {
                let tag = "";
                if (tagsArray.length > 0) {
                    tag = tagsArray.join(",");
                }

                return tag;
            },
            savePageInfo() {
                let cacheData = {};
                cacheData.currentPage = this.currentPage;
                cacheData.totalPage = this.totalPage;
                let listLen = this.postPageInfo.length;
                if ( listLen > 0) {
                    let pageList = [];
                    this.postPageInfo.forEach(function (info) {
                        let start = {};
                        start.create = info.start?info.start.getCreate().getUtcSeconds():null;
                        start.author = info.start?info.start.getAuthor().getValue():null;

                        let end = {};
                        end.create = info.end?info.end.getCreate().getUtcSeconds():null;
                        end.author = info.end?info.end.getAuthor().getValue():null;

                        let obj = {};
                        obj.start = start;
                        obj.end = end;
                        obj.post = info.post?info.post.toObject():null;
                        pageList.push(obj);
                    });
                    cacheData.pageInfo = pageList;
                }else {
                    cacheData.pageInfo = null;
                    cacheData.lastInfo = null;
                }
                sessionStorage.setItem(userArticlesCache,JSON.stringify(cacheData));
            },
            getPageInfo() {
                let info = sessionStorage.getItem(userArticlesCache);
                if (info != null) {
                    return JSON.parse(info);
                }
                return null;
            },
            clearCachePageInfo() {
                if (sessionStorage.getItem(userArticlesCache) != null) {
                    sessionStorage.removeItem(userArticlesCache);
                }
            },
            loadData() {
                let name = this.$route.params.author;
                let accountName = new cos_sdk.raw_type.account_name();
                accountName.setValue(name);
                let startTime = new cos_sdk.raw_type.time_point_sec();
                let endTime = new cos_sdk.raw_type.time_point_sec();
                startTime.setUtcSeconds(Math.ceil(Date.now()/1000)+86400);
                endTime.setUtcSeconds(1);
                let start = new cos_sdk.multi_id.user_post_create_order();
                start.setAuthor(accountName);
                start.setCreate(startTime);
                let end = new cos_sdk.multi_id.user_post_create_order();
                end.setAuthor(accountName);
                end.setCreate(endTime);
                this.postListStart = start;
                this.postListEnd = end;
                this.firstPageStart = start;
                this.firstPageEnd = end;
            },
            getCacheData() {
                let cacheData = this.getPageInfo();
                if (cacheData) {
                    this.currentPage = parseInt(cacheData.currentPage);
                    this.totalPage = parseInt(cacheData.totalPage);
                    if (cacheData.pageInfo) {
                        let list = [];
                        for (let data of cacheData.pageInfo) {
                            let info = {};
                            info.start = this.getUserPostObjFromCache(data.start);
                            info.end = this.getUserPostObjFromCache(data.end);
                            if (data.post) {
                                let lastInfo = new api.cos_sdk.grpc.PostResponse();
                                let time = new api.cos_sdk.raw_type.time_point_sec();
                                time.setUtcSeconds(data.post.created.utcSeconds);
                                lastInfo.setCreated(time);
                                lastInfo.setPostId(data.post.postId);
                                info.post = lastInfo;
                            }
                            list.push(info);
                        }
                        this.postPageInfo = list;
                    }
                    this.loadData();
                    if (this.currentPage == 1) {
                        this.lastPost = null;
                        // this.loadData();
                    }else if (this.currentPage >= 2 && this.postPageInfo.length >= this.currentPage){
                        let lastInfo = this.postPageInfo[this.currentPage-2];
                        this.postListStart = lastInfo.start;
                        this.postListEnd = lastInfo.end;
                        this.lastPost = lastInfo.post;
                    }
                }else {
                    this.loadData()
                }
            },
            getUserPostObjFromCache(data) {
                if  (data) {
                    let obj = new api.cos_sdk.multi_id.user_post_create_order();
                    if (data.create) {
                        let createTime = new api.cos_sdk.raw_type.time_point_sec();
                        createTime.setUtcSeconds(data.create);
                        obj.setCreate(createTime);
                    }
                    if (data.author) {
                        let accountName = new api.cos_sdk.raw_type.account_name();
                        accountName.setValue(data.author);
                        obj.setAuthor(accountName);
                    }
                    return obj
                }
                return null;
            },
        },

        mounted() {
            // this.loadData();
            this.getCacheData();
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
