<template>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
                    </div>
                    <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliverPrice}}</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass">{{payDesc}}</div>
            </div>
        </div>
        <transition name="fold" class="tansition-wrapper" tag="div">
            <div class="shopcart-list" v-show="listShow" key="item">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty">清空</span>
                    </div>
                    <div class="list-content">
                        <ul>
                            <li class="food" v-for="food in selectFoods">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price * food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import cartcontrol from "../cartcontrol/cartcontrol"
    export default {
        props: {
            selectFoods: {
                type: Array,
                default() {
                    return [];
                }
            },
            deliverPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                fold: true
            }
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count
                })

                return total
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count
                })

                return count
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元`
                } else {
                    return "去结算"
                }
            },
            payClass() {
                // 计算class 
                if (this.totalPrice < this.minPrice) {
                    return "not-enough"
                } else {
                    return "enough"
                }
            },
            listShow() {
                if(!this.totalCount){
                    this.fold = true;
                    return false
                }
                let show = !this.fold
                return show
            }
        },
        components: {
            cartcontrol
        },
        methods:{
            toggleList(){
                if(!this.totalCount){
                    return
                }
                this.fold = !this.fold;
            }
        }
    }

</script>
<style lang="scss">
    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        width: 100%;
        height: 48px;
        .content {
            display: flex;
            background: #141d27;
            font-size: 0;
            .content-left {
                flex: 1;
                .logo-wrapper {
                    display: inline-block;
                    position: relative;
                    top: -10px;
                    margin: 0 12px;
                    padding: 6px;
                    width: 56px;
                    height: 56px;
                    box-sizing: border-box;
                    vertical-align: top;
                    border-radius: 50%;
                    background: #141d27;
                    .logo {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #2b343c;
                        text-align: center;
                        &.highlight {
                            background: rgb(0, 160, 220);
                        }
                        .icon-shopping_cart {
                            font-size: 24px;
                            color: #80858a;
                            line-height: 44px;
                            &.highlight {
                                color: #fff;
                            }
                        }
                    }
                    .num {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 24px;
                        height: 16px;
                        line-height: 16px;
                        text-align: center;
                        border-radius: 16px;
                        font-size: 9px;
                        font-weight: 700;
                        color: #fff;
                        background: rgb(240, 20, 20);
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
                    }
                }
                .price {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 24px;
                    margin-top: 12px;
                    padding-right: 12px;
                    box-sizing: border-box;
                    border-right: 1px solid rgba(255, 255, 255, .1);
                    font-size: 16px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, .4);
                    &.highlight {
                        color: #fff;
                    }
                }
                .desc {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 24px;
                    margin: 12px 0 0 12px;
                    font-size: 10px;
                    color: rgba(255, 255, 255, .4);
                }
            }
            .content-right {
                flex: 0 0 105px;
                width: 105px;
                .pay {
                    height: 48px;
                    line-height: 48px;
                    text-align: center;
                    font-size: 12px;
                    color: rgba(255, 255, 255, .4);
                    background: #2b333b;
                    &.not-enough {
                        background: #2b333b;
                    }
                    &.enough {
                        background: #00b43c;
                        color: #fff;
                    }
                }
            }
        }
        /*.tansition-wrapper{
            position: relative;
            left: 0;
            bottom: 0;
            height: 48px;
        }*/
        .shopcart-list{
            position: absolute;
            /*top:0;*/
            left:0;
            z-index:-1;
            width: 100%;
            transition: all 0.5s;
            transform: translate3d(0,-100%,0);
            /*&.fold-transition{
                transition: all 0.5s;
                transform: translate3d(0,-100%,0);
            }*/
            &.fold-enter, &.fold-leave-active{
                transform: translate3d(0,0,0);
            }
            .list-header{
                height: 40px;
                line-height: 40px;
                padding: 0 18px;
                background: #f3f5f7;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                .title{
                    float: left;
                    font-size: 14px;
                    color: rgb(7,17,27);
                }
                .empty{
                    float: right;
                    font-size: 12px;
                    color: rgb(0,160,220);
                }
            }
            .list-content{
                padding: 0 18px;
                max-height: 217px;
            }
        }
    }
</style>