<template>
  <div class="article">
    <div class="title">
      <h2>{{ mainContent.title }}</h2>
      <div class="other">
        <ul>
          <li>
            <i class="bg-time"></i>
            <span>{{ date }}</span>
          </li>
          <li>
            <i class="bg-like"></i>
            <span class="likeCount">{{ mainContent.like_n }} </span> 个赞
          </li>
          <li>
            <i class="bg-reads"></i>
            <span class="readCount">{{ mainContent.reads_n }}</span> 次阅读
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="outer">
        <div class="display">
          <div class="left-top"></div>
          <div class="right-top"></div>
          <div class="left-bottom"></div>
          <div class="right-bottom"></div>
        </div>
        <div class="inner">
          <div class="inner-main typo" v-html="mainContent.html_content"></div>
          <div class="inner-footer">
            <p></p>
            <div v-for="(item, index) in mainContent.tags" :key="index">
              <Tag type="border" color="primary" class="tag">{{ item }}</Tag>
            </div>

            <ul>
              <li @click="takeLike()">
                <i class="bg-like"></i>
                <span>点赞</span>
              </li>
              <li>
                <Poptip placement="top">
                  <i class="bg-award"></i>
                  <span>打赏</span>
                  <div slot="content">
                    <img
                      src="~@/assets/images/reward.png"
                      alt=""
                      style="width: 200px; height: 200px"
                    />
                  </div>
                </Poptip>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="page-change">
        <button class="prev" @click="prevPage()">上一篇</button>
        <button class="next" @click="nextPage()">下一篇</button>
      </div>
    </div>
  </div>
</template>

<script>
import less from "less";
import axios from "axios";
import "../assets/css/reset.css";
import "typo.css/typo.css";
import { Tag, Poptip } from "view-design";
import "view-design/dist/styles/iview.css";

export default {
  components: {
    Tag,
    Poptip,
  },
  data() {
    return {
      currentPage: 1, //当前页
      mainContent: {}, //文章数据
      date: "",
    };
  },
  created() {
    this.getCurrentPage();
  },
  watch: {
    $route: "getCurrentData",
  },
  methods: {
    //path赋值
    getCurrentPage(path) {
      const routePath = path || this.$route.path;
      this.currentPage = parseInt(
        routePath.substr(routePath.indexOf("article/")).split("/")[1]
      );
    },
    //转变时间格式
    formateDate(datetime) {
      function addDateZero(num) {
        return num < 10 ? "0" + num : num;
      }
      let d = new Date(datetime);
      let formatdatetime =
        d.getFullYear() +
        "-" +
        addDateZero(d.getMonth() + 1) +
        "-" +
        addDateZero(d.getDate());
      return formatdatetime;
    },
    //获取‘第几篇’文章
    getUrlParam(url) {
      if (url.indexOf("article/")) {
        let params = url.substr(url.indexOf("article/")).split("/");
        return params[1];
      } else {
        return -1;
      }
    },
    //上一篇
    async prevPage() {
      if (this.currentPage === 1) {
        this.$Message.warning("前面已经没有啦");
        return;
      } else {
        this.currentPage--;
        this.$router.push("/article/" + this.currentPage);
        this.getCurrentData();
      }
    },
    //下一篇
    async nextPage() {
      //判断是否为最后一页(TODO)
      this.currentPage++;
      this.$router.push("/article/" + this.currentPage);
      this.getCurrentData();
    },
    //获取当前页数据
    async getCurrentData() {
      //当前页
      await axios({
        method: "get",
        url: "/api/article",
        params: {
          aid: this.currentPage,
        },
      })
        .then((res) => {
          this.mainContent = res.data;
          this.date = this.formateDate(res.data.date_detail);
          this.isread()
        })
        .catch((error) => {
          console.log("fail");
        });
    },
    //点赞状态
    async takeLike() {
      let cookieName = "like_" + this.currentPage;
      if (this.getCookie(cookieName) === -1) {
        this.setCookie({ [cookieName]: this.currentPage }, 730);
        document.getElementsByClassName("likeCount")[0].innerText =
          this.mainContent.like_n + 1; //更改数量
        this.$Message.info("点赞成功");
        //向后台发送数据;
        await axios({
          method: "post",
          url: "/api/takelike",
          headers:{ "Content-Type": "multipart/form-data"},
          data: {
            aid: this.currentPage,
          },
        })
          .then((res) => {
            console.log("点赞成功");
          })
          .catch((error) => {
            console.log("fail");
          });
      } else {
        this.$Message.warning("你已经点过赞了");
      }
      // console.log(likesCount);
    },
    //获取cookie
    getCookie(attr) {
      var cookie_str = document.cookie;
      //在cookie_str末尾加上分号
      if (!/;\s*$/.test(cookie_str)) {
        cookie_str += ";";
      }
      var reg = new RegExp(attr + "=([\\w\\W]*?);");
      var result = reg.exec(cookie_str);
      if (result === null) {
        return -1;
      } else {
        return 1;
      }
    },
    //设置cookie
    setCookie(json, time) {
      var date = new Date(
        new Date().getTime() + time * 24 * 60 * 60 * 1000
      ).toUTCString();
      for (var key in json) {
        document.cookie = key + "=" + json[key] + ";expires=" + date;
      }
    },
    //是否阅读过，没有的话阅读数加1
    async isread(){
      let cookieName = "read_" + this.currentPage;
      if(this.getCookie(cookieName)===-1){
        this.setCookie({[cookieName]:this.currentPage},730);
        document.getElementsByClassName("readCount")[0].innerText = this.mainContent.reads_n+1;
        await axios({
          method: "post",
          url: "/api/takeread",
          headers:{ "Content-Type": "multipart/form-data"},
          data: {
            aid: this.currentPage,
          },
        })
          .then((res) => {
            console.log("阅读数+1");
          })
          .catch((error) => {
            console.log("fail");
          });
      }else{
        console.log("看过了")
      }
    }
  },
  mounted() {
    this.getCurrentData();
    
    
  },
  //进入前的导航守卫
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getCurrentData();
    });
  },
  //组件内导航
  beforeRouteUpdate(to, from, next) {
    this.getCurrentPage(to.path);
    // console.log(this.currentPage+ " "+to.path)
    this.getCurrentData();
    next();
  },
};
</script>

<style lang='less' scoped>
/deep/ .bg-email {
  display: inline-block;
  top: 12px;
}
.article {
  width: 710px;
  min-height: 1400px;
  background-color: #ebe9e9;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.45);
  margin-bottom: 3em;
  position: relative;
  padding-bottom: 5em;
}

.title {
  text-align: center;
  margin: 20px 0;
}
.title h2 {
  font-size: 24px;
  color: #000000;
  margin-bottom: 12px;
  font-weight: bold;
}
.left-top {
  width: 45px;
  height: 32px;
  border-top: 8px solid #334b6f;
  border-left: 10px solid #334b6f;
  position: absolute;
  left: 0;
  top: 0;
}
.right-top {
  width: 45px;
  height: 32px;
  border-top: 8px solid #334b6f;
  border-right: 10px solid #334b6f;
  position: absolute;
  right: 0;
  top: 0;
}
.left-bottom {
  width: 45px;
  height: 32px;
  border-bottom: 8px solid #334b6f;
  border-left: 10px solid #334b6f;
  position: absolute;
  left: 0;
  bottom: -2em;
}
.right-bottom {
  width: 45px;
  height: 32px;
  border-bottom: 8px solid #334b6f;
  border-right: 10px solid #334b6f;
  position: absolute;
  right: 0;
  bottom: -2em;
}
.content {
  height: 59%;
}
.outer {
  width: 652px;
  // height: 100%;
  position: relative;
  margin: 0 auto;
  padding-top: 2em;
}
.outer .inner {
  width: 564px;
  height: 95%;
  border: solid 4px #334b6f;
  margin: 0 auto;
  border-top: 48px solid #334b6f;
  position: relative;
}
.outer .inner .inner-main {
  padding: 1em;
}
.outer .inner .inner-footer {
  position: relative;
  bottom: 0;
  width: 100%;
}
.outer .inner .inner-footer p {
  width: 540px;
  height: 2px;
  background-color: #334b6f;
  margin: 0 auto;
}
.outer .inner .inner-footer .tag {
  margin: 7px;
  cursor: pointer;
}
.outer .inner .inner-footer ul {
  display: flex;
  justify-content: center;
  padding: 13px 0;
}
.outer .inner .inner-footer ul li:nth-child(1) {
  margin-right: 5em;
}
.outer .inner .inner-footer ul li {
  font-size: 14px;
  color: #000000;
  letter-spacing: 0px;
  cursor: pointer;
}
.outer .inner .inner-footer ul li span {
  margin-left: 5px;
  display: inline-block;
}
.other ul {
  display: flex;
  justify-content: center;
  &:before,
  &:after {
    content: "";
    display: block;
  }
  padding: 0 20px;
  font-size: 12px;
}
.other ul li {
  display: inline-block;
  width: 120px;
}
.other ul li span {
  display: inline-block;
  margin-left: 5px;
}

//切换详情页
.page-change {
  display: flex;
  justify-content: center;
  margin: 4em 0 3em 0;
}
.page-change button {
  width: 86px;
  height: 36px;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px;
  color: #333333;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  transition: 0.5s;
}
.page-change button:nth-child(1) {
  margin-right: 2em;
}
.page-change button:hover {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.31);
  transition: 0.5s;
}
.user-content {
  margin-top: 23px;
  position: relative;
  bottom: 11px;
}
</style>