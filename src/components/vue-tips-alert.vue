<template>
    <transition name="fade">
        <div v-if="isShow" class="alert-bg">
            <div class="alert-card">
                <slot name="title" v-if="judgeHasTitle()">
                    <div class="alert-title">{{title}}</div>
                </slot>
                <slot name="content">
                    <div class="alert-content">{{content}}</div>
                </slot>
                <div class="alert-btnItem">
                    <slot name="btn">
                        <button class="btn btn-primary" @click="handle(2)">Confirm</button>
                        <button class="btn btn-danger" v-if="btnType === 2" @click="handle(1)">Cancel</button>
                    </slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "vue-tips-alert",
        props:[],
        data() {
            return {
                title: null,
                content: "",
                isShow: false,
                confirmHandler:null,
                cancelHandler:null,
                btnType:1, //1:show confirm 2:show confirm and cancel
            }
        },

        methods: {
            judgeHasTitle() {
                return this.title != null && this.title.length > 0;
            },

            handle(type) {
                this.isShow = false;
                if (type === 1 ) {
                    //confirm
                    if (this.confirmHandler && typeof this.confirmHandler == "function") {
                        this.confirmHandler()
                    }
                }else if (type === 2) {
                    //cancel
                    if (this.cancelHandler && typeof this.cancelHandler == "function") {
                        this.cancelHandler()
                    }
                }
                document.body.removeChild(this.$el);
                this.$destroy();
            },

            showCommonAlert(config) {
                this.isShow = true;
                this.title = config.title;
                this.content = config.content;
                this.confirmHandler = config.confirmHandler;
                this.cancelHandler = config.cancelHandler;
                this.btnType = config.btnType;

                this.$mount();
                document.body.appendChild(this.$el);
            }

        }
    }
</script>

<style scoped>
   .alert-bg {
       position: fixed;
       top: 0;
       left: 0;
       right: 0;
       bottom: 0;
       display: flex;
       align-items: center;
       justify-content: center;
       z-index: 2000;
       background-color: rgba(55,55,55,.6);;
   }

   .alert-card {
       box-sizing: border-box;
       border-radius: 6px;
       width: 400px;
       background-color: white;
       padding: 20px;
   }

   .alert-title {
       font-size: 18px;
       margin-bottom: 15px;
       color: black;
       font-weight: bold;
       text-align: center;
       word-wrap: break-word;
       word-break: break-word;
   }

   .alert-content {
       font-size: 18px;
       color: black;
       text-align: center;
       word-wrap: break-word;
       word-break: break-word;
   }

   .alert-btnItem {
       margin-top: 25px;
       display: flex;
       flex-direction: row;
       justify-content: space-around;
       justify-items: center;
   }

   @media (max-width: 640px) {
       .alert-card{
           width: 100%;
           margin: 0 30px;
       }
   }

   .fade-enter-active, .fade-leave-active {
       transition: opacity .5s;
   }
   .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
       opacity: 0;
   }

</style>
