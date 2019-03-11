<style>
    .vue-user-article {
        background-color: white;
    }

    .vue-user-article .info-and-pagination .info a {
        color: inherit;
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
                   v-bind:subtitlemonospaced="!!$route.params.author"
                   v-bind:blockies="$route.params.author">
        </vue-bread>
        <div v-if="postList" class="container mt20">

            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table list-table">
                    <tr class="list-header font-12 font-bold font-color-000000">
                        <th style="padding-left: 24px;">Author</th>
                        <th >Title</th>
                        <th>Id</th>
                        <th class=text-right style="padding-right: 24px; width: 120px">Date Created</th>
                    </tr>

                    <tr v-for="(post, i) in postList" :key="i">
                        <td style="padding-left: 24px;" class="hash">
                            <vue-blockies v-bind:account='post.getAuthor().getValue()'></vue-blockies>
                            <router-link v-bind:to='fragApi + "/account/" + post.getAuthor().getValue()'>
                                <span class="hash-normal monospace">{{ post.getAuthor().getValue() }}</span>
                            </router-link>
                        </td>
                        <span class="hash-normal monospace">{{ post.getTitle() }}</span>
                        <td class="font-color-000000">{{ post.getPostId()}} </td>
                        <td v-if="post.getCreated()" class="text-right font-color-555555" style="padding-right: 24px;">{{ post.getCreated()?new Date(post.getCreated().getUtcSeconds()*1000).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }): "" }}</td>

                    </tr>
                </table>
            </div>

            <vue-pagination v-bind:current=currentPage right=1 v-bind:total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                            v-on:prev=onPrev ></vue-pagination>
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
                postPageType:0,
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
                var query = JSON.parse(window.JSON.stringify(this.$route.query));

                query.p = n;
                this.$router.push({ path: this.$route.path, query });
            },
            nthPage() {
                this.$root.showModalLoading = true;
                let start = this.postListStart;
                let end = this.postListEnd;
                let isNextPage = true;
                let lastPost = this.lastPost;
                if (this.postPageType === 1) {
                    if (this.currentPage === 2 ) {
                        start = this.firstPageStart;
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
                    isNextPage = false;
                }
                api.fetchArticleListByName(start,end,lastPost,postList => {
                    if (postList.length) {
                        this.postList = postList;
                        this.lastPost = postList[postList.length-1];
                        let listStart = new cos_sdk.multi_id.user_post_create_order();
                        listStart.setCreate(this.lastPost.getCreated());
                        listStart.setAuthor(this.lastPost.getAuthor());
                        this.postListStart = listStart;
                        if (this.currentPage === 0 && isNextPage) {
                            this.postListEnd = this.firstPageEnd;
                        }else {
                            let listEnd = new cos_sdk.multi_id.user_post_create_order();
                            listEnd.setCreate(postList[0].getCreated());
                            listEnd.setAuthor(postList[0].getAuthor());
                            this.postListEnd = listEnd;
                        }
                        if (isNextPage) {
                            if (this.currentPage + 1 === this.totalPage) {
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
                        }else {
                            this.currentPage -= 1;
                        }
                    }
                    this.$root.showModalLoading = false;
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
                this.postPageType = 1;
                // this.nav(1);
                this.nav(this.currentPage - 1);
            },
            onLast() {
                this.postPageType = 0;
                // this.nav(this.totalPage);
                this.nav(this.currentPage + 1);
            },
            onNext() {
                this.postPageType = 0;
                this.nav(this.currentPage + 1);
            },
            onPrev() {
                this.postPageType = 1;
                this.nav(this.currentPage - 1);
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
            }
        },
        mounted() {
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
            this.nthPage();
        },
        watch: {
            $route() {
                this.nthPage();
            }
        }
    };
</script>
