<template>  
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item" 
                :class="{'current': currentIndex === index}" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type > 0" class="icon" 
                            :class="classMap[item.type]"></span>{{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook" >
                    <h1 class="title">{{ item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item border-1px">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span><span  class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
</template>
<script>
    import BScroll from "better-scroll"
    import shopcart from "../shopcart/shopcart"
    const ERR_OK = 0;
    export default{
        props:{
            seller:{
                type:Object
            }
        },
        data(){
            return {
                goods: [],
                listHeight: [],
                scrollY: 0
            }
        },
        computed: {
            currentIndex(){
                // 计算scrollY 在那个区间
                for(let i=0; i<this.listHeight.length; i++){
                    let height1 = this.listHeight[i]
                    // 最后的时候   height2 会为 undefined  所以判断有处理一下
                    let height2 = this.listHeight[i+1]
                    if(!height2 || ( this.scrollY >= height1 && this.scrollY<height2)){
                        return i
                    }
                }
                return 0
            }
        },
        created(){
            this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"];

            this.$http.get("/api/goods").then((response) => {
                response = response.body;
                if(response.errno === ERR_OK){
                    this.goods = response.data
                    // console.log(this.goods)
                    // https://cn.vuejs.org/v2/api/#Vue-nextTick
                    this.$nextTick( () => {
                        this._initScroll()
                        this._calculateHeight();
                    })
                }
            })
        },
        methods: {
            _initScroll(){
               //  https://cn.vuejs.org/v2/api/#选项-DOM
               // http://www.jianshu.com/p/728f03674444  资料   Vue 1.X 获取DOM是v-el
                // console.log(this.$refs.menuWrapper )
                this.menuScroll = new BScroll(this.$refs.menuWrapper,{
                    click: true
                })
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    probeType: 3
                })

                this.foodsScroll.on("scroll", (pos)=>{
                   // 获取 滚动的距离
                    this.scrollY = Math.abs( Math.round(pos.y));

                })
            },
            _calculateHeight(){
                let foodList = this.$refs.foodsWrapper.getElementsByClassName(" food-list-hook")
                // console.log( foodList )
                let height = 0;
                this.listHeight.push(height);
                for(let i = 0; i < foodList.length; i++){
                    let item = foodList[i]
                    // 可以获取某一段的区间
                    height += item.clientHeight;
                    this.listHeight.push(height)
                }
            },
            selectMenu(index, e){
                // 原生的阻止掉  PC会有两次 显示
                if(!e._constructed){
                    return;
                }
                let foodList = this.$refs.foodsWrapper.getElementsByClassName(" food-list-hook")
                let el = foodList[index]
                this.foodsScroll.scrollToElement(el, 300)
                // console.log(index)
            }
        },
        components:{
            shopcart
        }
    }
</script>
<style lang="scss">
    @import "../../common/sass/mixin";
    
.goods{
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper{
        flex: 0 0 80px;
        width: 80px;
        background: #f3f5f7;
        .menu-item{
            display: table;
            width: 56px;
            height: 54px;
            padding:0 12px;
            line-height: 14px;
            &.current{
                position: relative;
                z-index: 10;
                background:#fff ;
                font-weight: 700;
                .text{
                   @include border-none(); 
                }
            }
            .icon{
                display: inline-block;
                vertical-align: top;
                width: 12px;
                height: 12px;
                margin-right: 2px;
                background-size: 12px 12px;
                background-repeat: no-repeat;
                &.decrease {
                    @include bg-image("decrease_3");
                }
                &.discount {
                    @include bg-image("discount_3");
                }
                &.guarantee {
                    @include bg-image("guarantee_3");
                }
                &.invoice {
                    @include bg-image("invoice_3");
                }
                &.special {
                    @include bg-image("special_3");
                }
            }
            .text{
                display: table-cell;
                width:56px;
                vertical-align: middle;
                @include border-1px(rgba(7,17,27,.1))
                font-size: 12px;
            }
        }
    }
    .foods-wrapper{
        flex: 1;
        .title{
            padding-left: 14px;
            height: 26px;
            line-height: 26px;
            border-left: 2px solid #d9ddee;
            font-size: 12px;
            color:rgb(147, 153, 159);
            background: #f3f5f7;
        }
        .food-item{
            display: flex;
            margin: 18px;
            padding-bottom: 18px;
            @include border-1px(rgba(7,17,27,.1));
            &:last-child{
               @include border-none()
               margin-bottom: 0;
            }
            .icon{
                flex: 0 0 57px;
                margin-right: 10px;
            }
            .content{
                flex:1;
                .name{
                    margin: 2px 0 8px 0;
                    height: 14px;
                    line-height: 14px;
                    font-size: 14px;
                    color: rgb(7,17,27)
                }
                .desc, .extra{
                   color:rgb(147,153,159);
                   font-size: 10px; 
                   line-height: 10px;
                }
                .desc{
                   margin-bottom: 8px;
                   line-height: 12px;
                }
                .extra{
                    line-height: 10px;
                    .count{
                        margin-right: 12px;
                    }
                }
                .price{
                    font-weight: 700;
                    line-height: 24px;
                    .now{
                        margin-right: 18px;
                        font-size: 14px;
                        color: rgb(240, 20,20);
                    }
                    .old{
                        text-decoration: line-through;
                        font-size: 10px;
                        color:rgb(147,153,159);
                    }
                }
            }
        }
    }
}
</style>