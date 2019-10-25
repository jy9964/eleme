<template>
  <div id="app">
    <v-header class="header" :seller="seller">
    </v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods"exact>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller" />
    </keep-alive>

  </div>
</template>

<script>
  import Header from "./components/header/Header.vue";
  import {urlParse} from './common/js/util.js'

export default {
  name: 'App',
    data(){
      return{
          seller:{
              id:(() => {
                  let queryParm = urlParse();
                  console.log(queryParm)
                  return queryParm.id;
              })
          }
      }
    },
    components:{
      'v-header':Header
    },
    created() {
      this.$axios.get('/api/seller').then(response=>{
          response = response.data;
          if(response.errno === 0)
              this.seller = response.data;

      }).catch(error=>{
          console.log(error);
      });
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display:block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:rgb(240,20,20)
</style>
