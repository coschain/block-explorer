<style>
    .vue-contracts {
        background-color: white;
    }

    .vue-contracts .info-and-pagination .info a {
        color: inherit;
    }

    .vue-contracts td,
    .vue-contracts th {
        border-top-color: #ddd;
    }

    .vue-contracts .hash {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: center;
        white-space: nowrap;
    }

    .vue-contracts .hash>* {
        display: inline;
    }

    .vue-contracts .block {
        margin-right: 8px;
    }

    @media (max-width: 767.98px) {
        .vue-contracts .title {
            font-size: 20px;
        }
    }

</style>
<template>
    <!-- https://etherscan.io/txs -->
    <div class="vue-contracts fullfill">
        <vue-bread title="Posted Articles"></vue-bread>

        <div v-if="postList" class="container mt20">
            <!--<div class="align-items-center info-and-pagination mt20 row">-->
                <!--<div class="col info font-color-000000 font-24 font-bold title">{{ numberAddComma(totalCts) }} articles found</div>-->
                <!--&lt;!&ndash;(showing the last {{ maxDisplayCnt }} records)&ndash;&gt;-->
            <!--</div>-->

            <div class="explorer-table-container font-14">
                <table class="mt20 explorer-table list-table">
                    <tr class="list-header font-12 font-bold font-color-000000">
                        <th style="padding-left: 24px;">Author</th>
                        <!--<th v-if="$route.params.api === 'testnet'">Title</th>-->
                        <th >Title</th>
                        <th>Id</th>
                        <th class=text-right style="padding-right: 24px; width: 120px">Date Created</th>
                    </tr>

                    <tr v-for="(post, i) in postList" :key="i">
                        <td style="padding-left: 24px;" class="hash">
                            <vue-blockies v-bind:address='post.getAuthor().getValue()'></vue-blockies>
                            <router-link v-bind:to='fragApi + "/address/" + post.getAuthor().getValue()'>
                                <span class="hash-normal monospace">{{ post.getAuthor().getValue() }}</span>
                            </router-link>
                        </td>
                         <span class="hash-normal monospace">{{ post.getTitle() }}</span>
                        <td class="font-color-000000">{{ post.getPostId()}} </td>
                        <td class="text-right font-color-555555" style="padding-right: 24px;">{{ new Date(post.getCreated().getUtcSeconds()*1000).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
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
                postList:[],
                postPageType:0,
                postPageInfo:[],
                postListStart: null,
                postListEnd: null,
                lastPost: null,
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
                let isNextPage = true;
                let lastPost = this.lastPost;
                if (this.postPageType === 1) {
                    if (this.currentPage === 2 ) {
                        start = null;
                        lastPost= null;
                    }else {
                        let infoLen = this.postPageInfo.length;
                        if (infoLen >= 3 && infoLen >= this.currentPage ) {
                            let info = this.postPageInfo[this.currentPage-3];
                            start = info.start;
                            lastPost = info.post;
                        }
                    }
                    isNextPage = false;
                }
                api.fetchArticleListByCreateTime(start,null,lastPost,postList => {
                    if (postList.length) {
                        this.postList = postList;
                        this.lastPost = postList[postList.length-1];
                        this.postListStart = this.lastPost.getCreated();
                        if (this.currentPage === 0 && isNextPage) {
                            this.postListEnd = null;
                        }else {
                            this.psotListEnd = postList[0].getCreated();
                        }
                        if (isNextPage) {
                            if (this.currentPage + 1 === this.totalPage) {
                                this.totalPage += 1;
                                let curPageLen = this.postPageInfo.length;
                                let info = {start:this.postListStart,post:this.lastPost};
                                if (curPageLen === 0) {
                                    info.end = this.psotListEnd;
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
                    console.log("Get Post list fail,error code is %s,msg is %s",errCode,msg);
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
                BigNumber.config({ DECIMAL_PLACES: 18 })
                var amount = BigNumber(n);
                var decimals = BigNumber('1e+18');
                return amount.div(decimals).toFormat().shortAmount();
            }
        },
        mounted() {
            this.nthPage();
        },
        watch: {
            $route() {
                this.nthPage();
            }
        }
    };
</script>
