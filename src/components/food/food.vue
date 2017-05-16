<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="img-header">
                    <img :src="food.image">
                    <div class="back" @click="back">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <div class="title">{{food.name}}</div>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">
                        商品评价
                    </h1>
                    <ratingselect v-on:ratingtypeSelect="changeType" v-on:contentToggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings">
                    </ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType === 0,
                                          'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length"></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import Vue from "vue";
    import BScroll from "better-scroll";
    import cartcontrol from "../cartcontrol/cartcontrol"
    import split from "../split/split"
    import ratingselect from "../ratingselect/ratingselect"


    // const POSITIVE = 0;
    // const NEGATIVE = 1;
    const ALL = 2
    export default {
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: "全部",
                    positive: "推荐",
                    negative: "吐槽"
                }
            }
        },
        methods: {
            
            changeType(type){
                this.selectType = type
                // 修改以上 DOM  并不会立马更新  会在一个队列中  之后执行
                this.$nextTick(()=>{
                    this.scroll.refresh();
                })
                 
            },
            toggleContent(onlyContent){
                this.onlyContent = onlyContent;
                this.$nextTick(()=>{
                    this.scroll.refresh();
                })
            },
            show() {
                this.showFlag = true;
                this.selectType = ALL;
                this.onlyContent = true;
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        })
                    } else {
                        this.scroll.refresh();
                    }
                })
            },
            back() {
                this.showFlag = false;
            },
            addFirst(e) {
                if (!e._constructed) {
                    return;
                }
                // console.log("click")
                Vue.set(this.food, "count", 1)
            },
            needShow(type,text){
                if(this.onlyContent && !text){
                    return false
                }

                if(this.selectType === ALL){
                    return true;
                }else{
                    return type === this.selectType;
                }
            }
        },
        components: {
            cartcontrol,
            split,
            ratingselect
        }
    }

</script>
<style lang="scss">
    @import "../../common/sass/mixin";
    .food {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 48px;
        z-index: 9;
        width: 100%;
        background: #fff;
        transition: all 0.2s linear;
        transform: translate3d(0, 0, 0);
        &.move-enter,
        &.move-leave-active {
            transform: translate3d(100%, 0, 0);
        }
        .img-header {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 100%;
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .back {
                position: absolute;
                top: 10px;
                /*需要处理的样式*/
                left: 10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(0, 0, 0, .7);
                .icon-arrow_lift {
                    display: block;
                    padding: 10px;
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
        .content {
            position: relative;
            padding: 18px;
            .title {
                line-height: 14px;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
            }
            .detail {
                margin-bottom: 18px;
                line-height: 10px;
                font-size: 0;
                .sell-count,
                .rating {
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .sell-count {
                    margin-right: 12px;
                }
            }
            .price {
                font-weight: 700;
                line-height: 24px;
                .now {
                    margin-right: 8px;
                    font-size: 14px;
                    color: rgb(240, 20, 20);
                }
                .old {
                    text-decoration: line-through;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
            }
        }
        .cartcontrol-wrapper {
            position: absolute;
            right: 12px;
            bottom: 12px;
        }
        .buy {
            position: absolute;
            right: 18px;
            bottom: 18px;
            z-index: 10;
            height: 24px;
            line-height: 24px;
            padding: 0 12px;
            box-sizing: border-box;
            font-size: 10px;
            border-radius: 12px;
            color: #fff;
            background: rgb(0, 160, 220);
            transition: all 0.2s;
            opacity: 1;
            &.fade-enter,
            &.fade-leave-active {
                opacity: 0;
            }
        }
        .info {
            padding: 18px;
            h1.title {
                line-height: 14px;
                margin-bottom: 16px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .text {
                line-height: 24px;
                padding: 0 8px;
                font-size: 12px;
                color: rgb(77, 85, 93);
            }
        }
        .rating {
            padding-top: 18px;
            .title {
                line-height: 14px;
                margin-left: 16px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .rating-wrapper{
                padding: 0 18px;
                .rating-item{
                    position: relative;
                    padding: 16px 0;
                    @include border-1px(rgba(7,17,27,.1));
                    .user{
                        position: absolute;
                        right: 0;
                        top: 16px;
                        line-height: 12px;
                        font-size: 0;
                        .name{
                            display: inline-block;
                            margin-right: 6px;
                            vertical-align:top;
                            font-size: 10px;
                            color: rgb(147,153,159);
                        }
                        .avatar{
                            border-radius: 50%;
                        }
                    }
                    .time{
                        margin-bottom: 6px;
                        line-height: 12px;
                        font-size: 10px;
                        color: rgb(147,153,159);
                    }
                    .text{
                        line-height: 16px;
                        font-size: 12px;
                        color: rgb(7,17,27);
                        .icon-thumb_up,.icon-thumb_down{
                            margin-right: 4px;
                            line-height: 16px;
                        }
                        .icon-thumb_up{
                            color: rgb(0,160,220);
                        }
                        .icon-thumb_down{
                            color: rgb(147,153,159);
                        }
                    }
                }
            }
        }
    }
</style>