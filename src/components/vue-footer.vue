<style>
    .vue-footer {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 0px 0px rgba(221, 221, 221, 1);
        /* margin-top: 30px; */
        font-size: 16px;
        color: black;
    }

    .vue-footer a {
        color: black;
        vertical-align: bottom;
    }

    .vue-footer a .icon24 {
        vertical-align: middle;
    }

    .vue-footer .twitter {
        display: inline-block;
        background-image: url(../../static/img/ic_twitter.png);
        background-size: 24px;
        background-repeat: no-repeat;
    }

    .vue-footer .github {
        margin-left: 8px;
        display: inline-block;
        background-image: url(../../static/img/ic_github.png);
        background-size: 24px;
        background-repeat: no-repeat;
    }

    .vue-footer a:hover .twitter {
        background-image: url(../../static/img/ic_twitter_blue.png);
    }

    .vue-footer a:hover .github {
        background-image: url(../../static/img/ic_github_blue.png);
    }

    .vue-footer a:hover {
        color: #0057FF;
    }

    @media (min-width: 768px) {
        .vue-footer .row {
            align-items: center;
            height: 82px;
        }

        .vue-footer .row>div:nth-of-type(1) {
            text-align: left;
        }

        .vue-footer .row>div:nth-of-type(2) {
            text-align: center;
        }

        .vue-footer .row>div:nth-of-type(3) {
            text-align: right;
        }
    }

    @media (max-width: 767.98px) {
        .vue-footer .row {
            align-items: center;
            height: 182px;
        }

        .vue-footer .row>div {
            text-align: center;
        }
    }

    .vue-footer .safe-bottom {
        height: env(safe-area-inset-bottom);
    }

</style>
<template>
    <div class=vue-footer>
        <div class=container>
            <div class="row">
                <div class="col-xs-12 col-md-4">
                    <a target=_blank href=https://www.contentos.io/>
                        <img style="height: 56px; width: 56px;display: inline; vertical-align: middle;" src="../../static/img/contentos-logo2.png"/>
                    </a>
                </div>

                <div class="col-xs-12 col-md-4">
                    <div>{{getVersionDesc()}}</div>
                </div>

                <div class="col-xs-12 col-md-4">
                    <div>
                        <a target=_blank href=https://twitter.com/contentosio>
                            <div class="icon24 twitter" src="../../static/img/ic_twitter.png"></div>
                        </a>
                        <a target=_blank href=https://github.com/coschain/contentos-go/issues>
                            <div class="icon24 github" src="../../static/img/ic_github.png"></div>
                            Submit an issue
                        </a>
                    </div>
                </div>
            </div>
            <div class="safe-bottom"></div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        methods: {
            getVersionDesc() {
                var mainNetVersion = 'v2.0.0 MainNet'
                var testNetVersion = 'v0.5 Jupiter'
                var copyright = 'Copyright © 2018 - ' + new Date().getFullYear() + ' Contentos.io'
                var ver = (process.env.NODE_ENV === 'production')? mainNetVersion : testNetVersion
                return copyright + ' ' + ver
            }
        }
    }
</script>
