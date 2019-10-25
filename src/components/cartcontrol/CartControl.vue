<template>
    <div class="cartcontrol">
      <div class="cart-decrease icon-remove_circle_outline" @click.stop.prevent="decreaseCart" v-show="food.count > 0"></div>
      <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>

<script>
  import Vue from 'vue'
    export default {
        name: "CartControl",
        props:{
            food:{
                type:Object,
            }
        },
        methods:{
            addCart(event) {
                if(!event._constructed)
                    return;
                if (!this.food.count)
                    Vue.set(this.food,'count',1);
                else
                    this.food.count ++;

                // this.$parent._drop(event.target);
            },
            decreaseCart(event) {
                if(!event._constructed)
                    return;
                if(this.food.count)
                    this.food.count --;
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol
    font-size :0
    .cart-decrease
      display :inline-block
      padding :6px
      line-height :24px
      font-size :24px
      color :rgb(0,160,220)
    .cart-count
      display :inline-block
      vertical-align :top
      width :12px
      padding-top :6px
      line-height :24px
      text-align :center
      font-size :10px
      color :rgb(147,153,159)
    .cart-add
      display :inline-block
      padding :6px
      line-height :24px
      font-size :24px
      color :rgb(0,160,220)
</style>
