<template>
  <div class="shopcart-wrapper">
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount > 0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount > 0}"></span>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalCount > 0}">￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" :class="{'dopay': totalPrice >= this.minPrice} " @click.stop.prevent="pay()">
          <div class="pay" :class="{'dopay': totalPrice >= this.minPrice}">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls" v-show="ball.show" class="ball" :key="ball.id"></div>
        <div class="inner inner-hook"></div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" :class="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listcontent">
            <ul>
              <li class="food" v-for="food in selectedFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"></CartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <div class="list-mask" :class="listShow" @click="hideList"></div>
  </div>

</template>

<script>
  import BScroll from 'better-scroll';
  import CartControl from "../cartcontrol/CartControl";
    export default {
        name: "shopcart-wrapper",
        data(){
          return {
              balls: [
                  {
                      id:1,
                      show:false
                  },
                  {
                      id:2,
                      show:false
                  },
                  {
                      id:3,
                      show:false
                  },
                  {
                      id:4,
                      show:false
                  },
                  {
                      id:5,
                      show:false
                  }
                  ],
              dropBall: [],
              fold :true
          }
        },
        props:{
            selectedFoods:{
                type: Array,
                default(){
                    return [
                        {
                            price:0,
                            count:0
                        }];
                }
            },
            deliveryPrice:{
                type: Number,
                default: 0
            },
            minPrice:{
                type: Number,
                default: 0
            }
        },
        computed:{
            totalPrice() {
                let total=0;
                this.selectedFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectedFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0){
                   return `￥${this.minPrice}元起送`;
                }
                else if(this.totalPrice < this.minPrice){
                    let diff = this.minPrice - this.totalPrice;
                    return `还差${diff}元起送`;
                }
                else{
                    return '去结算';
                }

            },
            listShow() {
                if(!this.totalCount){
                    this.fold = true;
                    return 'hide';
                }
                let show = !this.fold;
                if(show){
                    this.$nextTick(() => {
                       if(!this.scroll)
                         this.scroll = new BScroll(this.$refs.listcontent,{
                             click:true
                         })
                        else
                            this.scroll.refresh();
                    });
                }
                return show?'show':'hide';
            }
        },
        methods:{
            // drop(el) {
            //     for(let i = 0;i < this.balls.length; i++){
            //         let ball = this.balls[i];
            //         if(!ball.show){
            //             ball.show = true;
            //             ball.el = el;
            //             this.dropBall.push(ball);
            //             return;
            //         }
            //     }
            // },
            // beforeEnter(el){
            //     let count = this.balls.length;
            //     while(count--){
            //         let ball = this.balls[count];
            //         if(ball.show){
            //             let rect = ball.el.getBoundingClientRect();
            //             let x = rect.left - 32;
            //             let y = -(window.innerHeight - rect.top - 22);
            //             el.style.display = '';
            //             // el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            //             el.style.transform = `translate3d(0,${y}px,0)`;
            //             let inner = el.getElementsByClassName('inner-hook')[0];
            //             inner.style.transform = `translate3d(${x}px,0,0)`;
            //         }
            //     }
            // },
            // enter(el){
            //     /**/
            //     let rf = el.offsetHeight;
            //     this.$nextTick(() => {
            //         // // el.style.webkitTransform = `translate3d(0,0,0)`;
            //         // el.style.transform = 'translate3d(0,0,0)';
            //         // let inner = el.getElementsByClassName('inner-hook')[0];
            //         // // inner.style.webkitTransform = `translate3d(0,0,0)`;
            //         // inner.style.transform = 'translate3d(0,0,0)';
            //     });
            // },
            // afterEnter(el){
            //     let ball = this.dropBall.shift();
            //     if(ball){
            //         ball.show = false;
            //         el.style.display = 'none';
            //     }
            // }
            toggleList() {
                if(!this.totalCount) {
                    return;
                }
                this.fold = !this.fold;
            },
            empty() {
                this.selectedFoods.forEach( (food) =>{
                    food.count = 0;
                })
            },
            hideList() {
                this.fold = true;
            },
            pay() {
                if(this.totalPrice < this.minPrice){
                    return
                }
                window.alert(`支付${this.totalPrice}`);
                this.empty();
            }
        },
        components:{
            CartControl
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  .shopcart
    position :fixed
    left :0
    bottom :0
    z-index :50
    width :100%
    height :48px
    background :#000
    .content
      display :flex
      background :#141d27
      font-size :0
      .content-left
        flex :1
        .logo-wrapper
          display :inline-block
          position :relative
          top :-10px
          margin :0 12px
          padding :6px
          width :56px
          height :56px
          box-sizing :border-box
          vertical-align :top
          border-radius :50%
          background :#141d27
          .logo
            width :100%
            height :100%
            border-radius :50%
            background :#2b343c
            text-align :center
            &.highlight
              background :rgb(0,160,220)
            .icon-shopping_cart
              line-height :44px
              font-size :24px
              color :#80858a
              &.highlight
                color :#fff
          .num
            position :absolute
            top :0
            right :0
            width :24px
            height :16px
            line-height :16px
            text-align :center
            border-radius :16px
            font-size :9px
            font-weight :700
            color :#fff
            background :rgb(240,20,20)
            box-shadow :0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display :inline-block
          vertical-align :top
          line-height :24px
          margin-top :12px
          box-sizing :border-box
          padding-right :12px
          border-right :1px solid rgba(255,255,225,0.1)
          font-size :16px
          font-weight :700
          color :rgba(255,255,255,0.4)
          &.highlight
            color :#fff
        .desc
          display :inline-block
          vertical-align :top
          line-height :24px
          margin :12px 0 0 12px
          font-size :10px
          color :rgba(255,255,255,0.4)
      .content-right
        flex :0 0 105px
        width :105px
        &.dopay
          background :#00b43c
        .pay
          height :48px
          line-height :48px
          text-align :center
          font-size :12px
          font-weight :700
          color :rgba(255,255,255,0.4)
          background :#2b33b
          &.dopay
            color :#fff
    .ball-container
      .ball
        position :fixed
        left :32px
        bottom :22px
        z-index :200
        &.drop-transition
          transition :all 0.4s
          .inner
            width :16px
            height :16px
            border-radius :50%
            background :rgb(0,160,220)
            transition :all 0.4s
    .shopcart-list
      position :absolute
      left :0
      top :0
      z-index :-1
      width :100%
      &.show
        transform :translate3d(0,-100%,0)
      &.hide
        display :none
      .list-header
        height :40px
        line-height :40px
        padding :0 18px
        background :#f3f5f7
        border-bottom :1px solid rgba(7,17,27,0.1)
        .title
          float :left
          font-size :14px
          color :rgb(7,17,27)
        .empty
          float :right
          font-size :12px
          color :rgb(0,160,220)

      .list-content
        padding :0 18px
        max-height :217px
        background :#fff
        overflow :hidden
        .food
          position :relative
          padding :12px 0
          box-sizing :border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height :24px
            font-size :14px
            color :rgb(7,17,27)
          .price
            position :absolute
            right :90px
            bottom :12px
            line-height :24px
            font-size :14px
            font-weight :700
            color :rgb(240,20,20)
          .cartcontrol-wrapper
            position :absolute
            right :0
            bottom :6px


  .list-mask
    position :fixed
    top :0
    left :0
    width :100%
    height :100%
    z-index :40
    opacity :1
    background :rgba(7,17,27,0.6)
    backdrop-filter :blur(10px)
    &.show
      display :block
    &.hide
      display :none
</style>
