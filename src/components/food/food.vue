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
                </div>
                <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                </div>
                <transition name="fade">
                    <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
                </transition>
            </div>
        </div>
    </transition>
</template>
<script>
    import Vue from "vue";
    import BScroll from "better-scroll";
    import cartcontrol from "../cartcontrol/cartcontrol"
    export default {
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false
            }
        },
        methods: {
            show() {
                this.showFlag = true;
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
            }
        },
        components: {
            cartcontrol
        }
    }

</script>
<style lang="scss">
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
            &.fade-enter, &.fade-leave-active{
                opacity: 0;
            }
        }
    }
</style>