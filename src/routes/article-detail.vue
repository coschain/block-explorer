<style>
    .vue-article-detail {
        width: 100%;
        background-color: white;
    }

    .vue-article-detail .detailInfo {
        font-size: 16px;
        font-weight: 600;
        word-wrap: break-word;
        padding-bottom: 12px;
    }

    .vue-article-detail .detailInfo:last-child {
        margin-bottom: 0;
    }

    .vue-article-detail .detailInfo > div:nth-of-type(odd) {
        background: rgba(247, 247, 247, 1);
    }

    .vue-article-detail .detailInfo > div:nth-of-type(event) {
        background: rgba(255, 255, 255, 1);
    }

    .vue-article-detail .infoCell {
        display: flex;
        flex-direction: row;
        padding-top: 11px;
        padding-bottom: 11px;
    }

    .vue-article-detail .proDesc {
        margin-left: 15px;
        width: 10%;
        text-align: left;
        font-size: 14px;
        word-wrap: normal;
    }

    .vue-article-detail .listItem {
        display: flex;
        flex-direction: row;
    }

    .vue-article-detail .listBtn {
        color: black;
        font-size: 20px;
        border-width: 1px;
        border-color: black;
        background-color: rgba(247, 247, 247, 1);
        outline-style: none;
    }

    .vue-article-detail .listBtn:nth-of-type(2) {
        margin-left: 15px;
    }

    .vue-article-detail .listBtnSelectState {
        border-color: #2a88ff;
        color: #2a88ff;
    }

    .vue-article-detail .proValue {
        text-align: left;
        width: 90%;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 14px;
    }

    .vue-article-detail .voterListHeader {
        margin-top: 20px;
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: rgba(247, 247, 247, 1);
        font-size: 14px ;
    }

    .vue-article-detail .voterListHeader .headerCol {
        width: 50%;
        padding-left: 15px;
    }

    .vue-article-detail .listBg {
       background-color: white;
    }

    .vue-article-detail .voterListContent {
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 50px;
        font-size: 14px ;
    }

    .vue-article-detail .voterListContent .voterListContentCol {
        width: 50%;
        padding-left: 15px;
        color: rgba(85, 85, 85, 1);
    }

    .vue-article-detail .listBg:nth-of-type(odd) {
        background: rgba(247, 247, 247, 1);
    }

    .vue-article-detail .listBg:nth-of-type(event) {
        background: rgba(255, 255, 255, 1);
    }


    .vue-article-detail .replyListHeader {
        margin-top: 20px;
        display:flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: center;
        align-items: center;
        height: 46px;
        background-color: rgba(247, 247, 247, 1);
        font-size: 14px ;
    }

    .vue-article-detail .replyListHeader .headerCol {
        width: calc(100%/3);
        padding-left: 15px;
    }

    .vue-article-detail .replyListContent {
        display:flex;
        flex-direction: row;
        min-height: 50px;
        font-size: 14px ;
        word-wrap: break-word;
        word-break: break-all;
        align-items: center;
    }

    .vue-article-detail .replyListContent .replyListContentCol {
        width: calc(100%/3);
        padding-left: 15px;
        color: rgba(85, 85, 85, 1);
    }

    .vue-article-detail .replyListContent .replyListContentCol:nth-of-type(1) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    @media (max-width: 576px) {
        .vue-article-detail .proDesc {
            width: 30%;
        }

        .vue-article-detail .proValue {
            width: 70%;
        }
    }

    @media  (min-width:576px ) and (max-width: 992px) {
        .vue-article-detail .proDesc {
            width: 15%;
        }

        .vue-article-detail .proValue {
            width: 85%;
        }
    }

</style>

<template>
    <div class="vue-article-detail fullfill" v-bind:triggerComputed=loadData>
        <vue-bread title='Article Detail of:' :subtitle='$route.params.pId'></vue-bread>
        <div v-if="articleInfo"  class="container">
            <div class="font-24 font-bold font-color-000000 table-title">
                Overview
            </div>
            <div class="detailInfo">
                <!--post id-->
                <div class="infoCell">
                    <div class="proDesc font-color-555555">Id:</div>
                    <div class="proValue font-color-000000">{{$route.params.pId}}</div>
                </div>
                <!--title or parentId-->
                <div class="infoCell">
                    <div class="proDesc font-color-555555">{{getTitleDesc(articleInfo)}}:</div>
                    <div class="proValue font-color-000000">{{getTitleByPostInfo(articleInfo)}}</div>
                </div>
                <!--vote count-->
                <div class="infoCell">
                    <div class="proDesc font-color-555555">Vote Count:</div>
                    <div class="proValue font-color-000000">{{articleInfo.getVoteCnt()}}</div>
                </div>
                <div class="infoCell">
                    <div class="proDesc font-color-555555">Power:</div>
                    <div class="proValue font-color-000000">{{articleInfo.getWeightedVp()}}</div>
                </div>
                <!--Tag List-->
                <div v-if="getPostType(articleInfo) === 0" class="infoCell">
                    <div class="proDesc font-color-555555">Tag:</div>
                    <div class="proValue font-color-000000">{{getArticleTags(articleInfo.getTagsList())}}</div>
                </div>
                <!--Reward-->
                <div class="infoCell">
                    <div class="proDesc font-color-555555">Reward:</div>
                    <div class="proValue font-color-000000">{{getArticleReward(articleInfo)}}</div>
                </div>
                <!--content-->
                <div class="infoCell">
                    <div class="proDesc font-color-555555">Content:</div>
                    <div class="proValue font-color-000000">{{articleInfo.getBody()}}</div>
                </div>
            </div>

            <!--Voter and Reply List button-->
            <div class="listItem">
                <!--voter list button-->
                <button  :class='[selectedList === 1 ? "listBtnSelectState listBtn" :"listBtn"]'  @click="switchToVoterList()">Voter List</button>
                <!--reply list button-->
                <button  :class='[selectedList === 2 ? "listBtnSelectState listBtn" :"listBtn"]' @click="switchToReplyList()">Reply List</button>
            </div>

            <!--voter List-->
            <div v-if="voterListInfo">
              <div v-if="selectedList === 1 && voterListInfo.length > 0">
                <!--header-->
                <div class="voterListHeader font-bold font-color-000000">
                    <div class="headerCol">Account</div>
                    <div class="headerCol">Power</div>
                </div>
                <!--content-->
                <div v-for="account in voterListInfo" class="listBg">
                  <div class="voterListContent">
                      <div class="voterListContentCol">{{account.getAccountName().getValue()}}</div>
                      <div class="voterListContentCol">{{account.getWeightedVp()}}</div>
                  </div>
                </div>
              </div>
            </div>
            <!--reply list-->
            <div v-if="replyListInfo">
              <div v-if="selectedList === 2 && replyListInfo.length > 0">
                <!--header-->
                <div class="replyListHeader font-bold font-color-000000">
                    <div class="headerCol">Id</div>
                    <div class="headerCol">Account</div>
                    <div class="headerCol">Content</div>
                </div>
                <!--content-->
                <div v-for="reply in replyListInfo" class="listBg">
                    <div class="replyListContent">
                        <div class="replyListContentCol">
                            <router-link v-bind:to='fragApi + "/article-detail/" + reply.getPostId()'>
                                <span class="hash-normal monospace">{{ reply.getPostId()}}</span>
                            </router-link>
                        </div>
                        <div class="replyListContentCol">{{reply.getAuthor().getValue()}}</div>
                        <div class="replyListContentCol">{{reply.getBody()}}</div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BigNumber from "bignumber.js";
    import api from "../assets/api";
    module.exports = {
        data() {
            return {
                articleInfo: null,
                selectedList: 0, //current selected list 0:select none 1:select voter list 2:select reply list
                voterListInfo: null,
                replyListInfo: null,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
            };
        },

         components: {
             "vue-bread": require("@/components/vue-bread").default,
         },
         computed: {
             loadData() {
                 api.fetchArticleDetailInfoById(this.$route.params.pId,100,100,info => {
                     if (info != null && typeof info != "undefined") {
                         if (info.hasPostInfo()) {
                             this.articleInfo = info.getPostInfo();
                         }
                         this.voterListInfo = info.getVoterListList();
                         this.replyListInfo = info.getReplyListList();

                         if (this.voterListInfo.length > 0) {
                             this.selectedList = 1;
                         }else if (this.voterListInfo.length > 0) {
                             this.selectedList = 2;
                         }else {
                             this.selectedList = 0;
                         }
                     }
                 },(errCode,msg) => {
                     console.log("Get Post Detail info fail,error code is %s,msg is %s",errCode,msg);
                     this.$root.showModalLoading = false;
                     this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404");
                 });
             },
         },
         methods: {
             getTitleDesc(info) {
                let type = this.getPostType(info);
                if (type === 1) {
                    return "Parent Id"
                }
                return "Title";
             },

             /*
              * get type of post  0:post article 1:reply article
              */
             getPostType(info) {
                 if (info != null && typeof info != "undefined") {
                     let pId = info.getParentId();
                     if (pId.length > 0 && BigNumber(pId).comparedTo(0) === 1) {
                         //if the parentId exist,indicate is reply
                         return 1;
                     }
                 }
                 return 0;
             },

             getTitleByPostInfo(info) {
                 if (info != null && typeof info != "undefined") {
                     let pId = info.getParentId();
                     if (pId.length > 0 && BigNumber(pId).comparedTo(0) === 1) {
                         //if the parentId exist,indicate is reply
                         return pId;
                     }
                     return info.getTitle();
                 }
                 return "";
             },

             switchToVoterList() {
                 if (this.selectedList !== 1) {
                     this.selectedList = 1;
                 }
             },

             switchToReplyList() {
                 if (this.selectedList !== 2) {
                     this.selectedList = 2;
                 }
             },

             getArticleTags(tagsArray) {
                 let tag = "";
                 if (tagsArray.length > 0) {
                     tag = tagsArray.join(",");
                 }

                 return tag;
             },

             getArticleReward(info) {
                 if (info != null && typeof info != "undefined") {
                     if (info.hasRewards()) {
                         return info.getRewards().getValue();
                     }
                     return 0
                 }
                 return 0
             }

         }
    };
</script>
