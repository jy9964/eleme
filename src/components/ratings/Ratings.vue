<template>
    <div class="ratings" ref="ratings">
      <div class="ratings-content">
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overview-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <Star :score="seller.serviceScore" :size="36"></Star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <Star class="star" :score="seller.foodScore" :size="36"></Star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <Split></Split>
        <RatingSelect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings" :event-name="eventName"></RatingSelect>
        <div class="rating-wrapper">
          <ul>
            <li v-for="rating in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item">
              <div class="avatar">
                <img :src="rating.avatar" width="28" height="28">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <Star :size="24" :score="rating.score" class="star"></Star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                </div>
                <p class="text">{{rating.text ? rating.text : '该用户未作出评价'}}</p>
                <div class="recomment" v-show="rating.recommend && rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span v-for="item in rating.recommend" class="rec-item">{{item}}</span>
                </div>
                <div class="time">
                  {{rating.rateTime | formatDate}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  import Star from '../../components/star/star';
  import RatingSelect from "../ratingselect/RatingSelect";
  import Split from '../split/split';
  import {formatDate} from "../../common/js/Date";
  import BScroll from 'better-scroll';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2 ;
  const ERR_OK = 0;

    export default {
        name: "Ratings",
        data(){
            return {
                ratings:[],
                selectType: ALL,
                onlyContent: false,
                desc:{
                    all:'全部',
                    positive:'满意',
                    negative: '不满意'
                },
                eventName:['ratings.select','ratings.onlycontent']
            }
        },
        props:{
            seller:{
                type:Object
            }
        },
        components:{
            Star,
            RatingSelect,
            Split
        },
        created() {
            this.$axios.get('/api/ratings').then((response) => {
                response = response.data;
                if(response.errno === ERR_OK){
                    this.ratings = response.data;
                    this.$nextTick(() => {
                        this._initScroll();
                    });
                }
            }).catch((err)=> {

            });
        },
        methods:{
            _initScroll() {
                if(!this.scroll){
                    this.scroll = new BScroll(this.$refs.ratings,{
                        click:true
                    })
                }
            },
            needShow(type,text) {
                if(this.onlyContent && !text)
                    return false;
                if(this.selectType === ALL)
                    return  true;
                else
                    return type === this.selectType;
            }
        },
        mounted() {
            this.bus.$on(this.eventName[0],(type) =>{
                this.selectType = type;
                if(scroll())
                  this.scroll.refresh();
            });
            this.bus.$on(this.eventName[1] ,(onlyContent) => {
                this.onlyContent = onlyContent;
                if(scroll())
                    this.scroll.refresh();
            });
        },
        filters:{
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date,'yyyy-MM-dd hh:mm')
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .ratings
    position :absolute
    top :174px
    bottom :0
    left :0
    width :100%
    overflow :hidden
    .overview
      display :flex
      padding :18px 0
      .overview-left
        flex :0 0 137px
        padding :6px 0
        width :137px
        border-right :1px solid rgba(7,17,27,0.1)
        text-align :center
        @media only screen and (max-width :320px)
          flex 0 0 120px
          width :120px
        .score
          margin-bottom :6px
          line-height :28px
          font-size :24px
          color :rgb(255,153,0)
        .title
          margin-bottom :6px
          font-size :12px
          line-height :12px
          color :rgb(7,17,27)
        .rank
          line-height :10px
          font-size :10px
          color :rgb(147,153,159)
      .overview-right
        flex :1
        padding :6px 0 6px 24px
        @media only screen and (max-width :320px)
          padding-left :6px
        .score-wrapper
          margin-bottom :8px
          font-size :0
          .title
            display :inline-block
            vertical-align :top
            line-height :18px
            font-size :12px
            color :rgb(7,17,27)
          .star
            display :inline-block
            margin :0 12px
            vertical-align :top
          .score
            display :inline-block
            vertical-align :top
            line-height :18px
            font-size :12px
            color :rgb(255,153,0)
        .delivery-wrapper
          font-size :0
          .title
            line-height :18px
            font-size :12px
            color :rgb(7,17,27)
          .delivery
            margin-left :12px
            font-size :12px
            color :rgb(147,153,159)
    .rating-wrapper
      padding :0 18px
      .rating-item
        display :flex
        position :relative
        padding :18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex :0 0 28px
          width :28px
          margin-right:12px
          img
            border-radius :50%
        .content
          position :relative
          flex :1
          .name
            margin-bottom :4px
            font-size :10px
            line-height :12px
            color :rgb(7,17,27)
          .star-wrapper
            font-size :0
            margin-bottom :6px
            .star
              display :inline-block
              vertical-align :top
            .delivery
              display :inline-block
              vertical-align :top
              margin-left :6px
              line-height 12px
              font-size :10px
              font-weight :200
              color :rgb(147,153,159)
          .text
            margin-bottom :8px
            line-height :18px
            font-size :12px
            color :rgb(7,17,27)
          .recomment
            line-height :16px
            font-size :0
            .icon-thumb_up
              display :inline-block
              vertical-align :top
              line-height :16px
              font-size :12px
              color :rgb(0,160,220)
            .rec-item
              display :inline-block
              vertical-align :top
              margin-left :8px
              padding :0 6px
              font-size :9px
              color :rgb(147,153,159)
              border :1px solid rgba(7,17,27,0.1)
              border-radius :2px
              background :#fff
          .time
            position :absolute
            top :0px
            right :0
            line-height :12px
            font-size :10px
            font-weight :200
            color :rgb(147,153,159)
</style>
