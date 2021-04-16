<template>
  <div class="archives">
    <div class="archives-head">
      <h2>文章归档</h2>
      <p>共发表 {{total}} 篇文章</p>
      <span>归档</span>
    </div>
    <div class="archives-content" v-for="(item,index) in records" :key="index">
      <h2 class="title">{{item.date}}(共{{item.data.length}}篇文章)</h2>
      <div class="main">
        <Timeline>
          <TimelineItem color="#999999" v-for="(i,j) in item.data" :key="j">
            <p class="c-time">{{i.creatAt}}</p> 
            <div class="c-title" :name="i.aid" @click="hrefJump($event)">
              {{i.title}}
            </div>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import less from "less";
import "../assets/css/reset.css";
import { Timeline, TimelineItem } from "view-design";
import "view-design/dist/styles/iview.css";
export default {
  name:"archives",
  components: { Timeline, TimelineItem },
  data() {
    return {
      total:0,
      records:[],
      nameId:"1"
    };
  },
  created(){
     this.getCurrentData();
  },
  methods: {
    async hrefJump(e) {
      let target = e.target;
      let url = "/article/" + target.getAttribute("name");
      await axios({
        method: "get",
        url: "/api/article",
        params:{
          aid:target.getAttribute("name")
        }
      })
        .then((res) => {
          this.$router.push(url);
          console.log(res);
        })
        .catch((error) => {
          console.log("fail");
        });
    },
    async getCurrentData(){
      await axios({
        method:"get",
        url:"/api/archives"
      }).then(res=>{
        this.records = res.data;
        for(var i in res.data){
          this.total+=res.data[i].data.length;
        }
        // this.total = res.data.total;
        // this.records = res.data.records
        console.log(this.records)
      }).catch(error=>{
        
      })
    },
    // async test() {
    //   var that = this;
    //   let resp = await axios({
    //     method: "get",
    //     url: "/api/archives",
    //   })
    //     .then((res) => {
    //       // that.lists = res.data.records;
    //       // that.total = res.data.total;
    //       console.log(res)
    //     })
    //     .catch((error) => {
    //       console.log("fail");
    //     });
    // },
  },
  mounted() {

  },
  // beforeRouteEnter(to,from,next){
  //   next((vm)=>{
  //     vm.getCurrentData()
  //   })
  // }
};
</script>

<style lang="less" scoped>
.archives {
  width: 706px;
  background-color: #ebe9e9;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.45);
  padding-bottom: 5em;
  margin-bottom: 3em;
}
.archives .archives-head {
  width: 686px;
  border-bottom: 1px solid #999999;
  margin: 0 auto;
  margin-top: 1em;
  position: relative;
}
.archives .archives-head h2 {
  width: 300px;
  height: 32px;
  background-color: #433d3e;
  font-size: 24px;
  color: #ffffff;
  letter-spacing: 0px;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
  margin: 0 auto;
}
.archives .archives-head p {
  width: 200px;
  height: 16px;
  font-size: 16px;
  letter-spacing: 0px;
  color: #333333;
  margin: 1em auto;
  text-align: center;
}
.archives .archives-head span {
  position: absolute;
  font-size: 18px;
  color: #333333;
  font-weight: bold;
  bottom: -2em;
  left: 2em;
}
.archives .archives-content {
  margin-top: 3em;
  position: relative;
  left: 5em;
}
.archives .archives-content .title {
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  font-weight: bold;
  margin-top: 1em;
}
.archives .archives-content .main {
  margin-top: 1em;
}
.archives .archives-content .main .c-time {
  font-size: 10px;
  color: #333333;
}
.archives .archives-content .main .c-title {
  width: 300px;
  height: 30px;
  background-color: #ebe9e9;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.31);
  border-radius: 9px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  top: -4px;
  left: 8em;
  cursor: pointer;
}
.archives .archives-content .main .c-title:hover {
  color: #000000;
}
/deep/ .ivu-timeline-item-tail {
  border-left: 5px solid #999999;
  left: 4px;
}
/deep/ .ivu-timeline-item-head {
  border: 2px solid transparent;
}
/deep/ .ivu-timeline-item-content {
  margin-bottom: 1em;
}
</style>