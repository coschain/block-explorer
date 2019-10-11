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
        <div v-if="postList.length" class="container mt20">
            <div class="maxPageTips">Display the latest {{maxUsrArticlesPageNum}} pages of data</div>
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
                        <td  class="font-color-000000 tagAndContent">
                            <router-link v-bind:to='fragApi + "/article-detail/" + post.getPostId()' target="_blank">
                                <span class="hash-normal monospace">{{ post.getPostId()}}</span>
                            </router-link>
                        </td>
                        <td class="font-color-000000 tagAndContent">{{ getTitleOfArticle(post) }}</td>
                        <td class="font-color-000000 tagAndContent ">{{ getContentOfArticle(post)}} </td>
                        <td class="font-color-000000 tagAndContent">{{fetchArticleTag(post.getTagsList())}}</td>
                        <td  class="ont-color-000000 tagAndContent">{{post.getVoteCnt()}}</td>
                    </tr>
                </table>
            </div>

            <div v-if="isShowLoadMore" class="loadMore-container">
                <button type="button" class="loadMoreBtn" @click="onClickLoadNextUsrArticles()">Load More</button>
            </div>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility"),
        BigNumber = require("bignumber.js");
    import {cos_sdk} from "../../src/assets/api"

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
                maxDisplayCnt: 0,
                totalPage: 1,
                totalCts: 0,
                postList: [],
                postPageInfo:[],
                postListStart: null,
                postListEnd: null,
                lastPost: null,
                firstPageStart: null,
                firstPageEnd: null,
                createdPageIndex:null,
                isShowLoadMore: true,
                isFetching: false,
                maxUsrArticlesPageNum: 50,
            };
        },
        methods: {
            nthPage(p) {
                if (p < this.currentPage || p > this.maxUsrArticlesPageNum) {
                    return;
                }
                this.$root.showModalLoading = true;
                let start = this.postListStart;
                let end = this.postListEnd;
                let lastPost = this.lastPost;

                api.fetchArticleListByName(start,this.firstPageEnd,30,lastPost,postList => {
                    if (postList.length) {
                        this.postList = this.postList.concat(postList);
                        this.lastPost = postList[postList.length-1];
                        let listStart = new cos_sdk.multi_id.user_post_create_order();
                        listStart.setCreate(this.lastPost.getCreated());
                        listStart.setAuthor(this.lastPost.getAuthor());
                        this.postListStart = listStart;
                        if (this.currentPage === 0) {
                            this.postListEnd = this.firstPageEnd;
                        }else {
                            let listEnd = new cos_sdk.multi_id.user_post_create_order();
                            listEnd.setCreate(postList[0].getCreated());
                            listEnd.setAuthor(postList[0].getAuthor());
                            this.postListEnd = listEnd;
                        }
                        let curPageLen = this.postPageInfo.length;
                        let info = {start:this.postListStart,post:this.lastPost};
                        if (curPageLen === 0) {
                            info.end = this.firstPageEnd;
                        } else {
                            if (curPageLen >= 1) {
                                info.end = this.postPageInfo[curPageLen - 1].start;
                            }

                        }
                        this.postPageInfo.push(info);
                        this.currentPage = parseInt(p);
                    }

                    this.$root.showModalLoading = false;
                    this.isFetching = false;
                    this.isShowLoadMore = this.currentPage < this.maxUsrArticlesPageNum;
                },(errCode,msg) => {
                    console.log("Get user's Post list fail,error code is %s,msg is %s",errCode,msg);
                    this.isFetching = false;
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                });
            },

            updateUserArticleInfo(index,info) {
                if (info && index >= 0 && index < this.postPageInfo.length) {
                     this.postPageInfo.splice(index,1,info);
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
            fetchArticleTag(tagsArray) {
                let tag = "";
                if (tagsArray.length > 0) {
                    tag = tagsArray.join(",");
                    tag = utility.filterXSS(tag)
                }

                return tag;
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

            getTitleOfArticle(info) {
                if (info != null && typeof info != "undefined") {
                    let pId = info.getParentId();
                    if (pId.length > 0 && BigNumber(pId).comparedTo(0) === 1) {
                        //if the parentId exist,indicate is reply
                        return "Reply";
                    }
                    return utility.filterXSS(info.getTitle())
                }
                return ""
            },

            getContentOfArticle(info) {
                if (utility.judgeIsNotEmpty(info)) {
                    return utility.filterXSS(info.getBody())
                }
                return ""
            },

            onClickLoadNextUsrArticles() {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = true;
                this.nthPage(this.currentPage + 1);
            }
        },

        mounted() {
            // this.loadData();
            this.loadData();
            this.nthPage(1);
        },
        watch: {
            $route() {
                this.nthPage();
            }
        },
    };
</script>
