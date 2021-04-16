<template>
  <div class="about">
    <div class="about-content">
      <div class="diy">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="main-content">
        <div class="m-head">
          <Avatar src="http://localhost:8080/Avatar.jpg" size="100"></Avatar>
          <h2 class="m-name">Warming</h2>
        </div>
        <div class="m-relate">
          <ul>
            <li>
              <Poptip content="2644162761@qq.com">
                 <i class="bg-email"></i>
              </Poptip>
            </li>
            <li>
               <Poptip trigger="hover" content="点击跳转到我的github"><a href="https://github.com/Hao-Warming?tab=repositories" target="_blank" style="display: inline-block; color: inherit"><i class="bg-github"></i></a> </Poptip>
            </li>
            <li>
               <Poptip trigger="hover" content="点击跳转到我的知乎">
                 <a href="https://www.zhihu.com/people/warming-87-97"
                          target="_blank"
                          style="display: inline-block; color: inherit"><i class="bg-zhihu"></i></a>
               </Poptip>
            </li>
          </ul>
        </div>
        <div class="m-other">
          <div class="identity">
            <h3 class="title">身份</h3>
            <p>99后，一名默默无闻的前端学习者，正在努力让自己变得更好</p>
          </div>
          <div class="favor">
            <h3 class="title">爱好</h3>
            <p>爱生活，爱编程，爱旅游（虽然我也没有去过几个城市~）</br>不想运动的电竞业余选手不是一个好的攻城狮!</p>
          </div>
          <div class="skill">
            <h3 class="title">技能</h3>
            <p>熟悉使用JavaScript、Vue及其相关的技术，了解ES6常用语法、git常用指令</p>
          </div>
        </div>
      </div>
    </div>
    <div class="comments">
      <div class="comment-header">
        <h2 id="reply-href">留言</h2>
        <span></span>
      </div>
     
     <postCom v-on:submit="addCom" v-bind:placeholder="placeholder" v-bind:comId="comId" v-bind:chosedIndex="chosedIndex" v-bind:told="oldCommer"></postCom>
     <comList v-on:change="changeComment"  v-bind:datalist="datalist"  v-bind:total="total"></comList>
     
    </div>
  </div>
</template>

<script>
import less from "less";
import "../assets/css/reset.css";
import axios from "axios";
import postCom from "../components/PostComment.vue";
import comList from "../components/CommentList.vue";
import { Avatar, Poptip } from "view-design";
import "view-design/dist/styles/iview.css";

export default {
  components: { Avatar, Poptip, postCom, comList },
  data() {
    return {
      type: 0, //0表示一级评论，1表示二级评论
      oldCommer: null,
      chosedIndex: -1, //被选中的评论的index
      datalist: [], //评论列表容器
      total: 0, //留言数
      placeholder: "*跟我聊聊天呗",
      comId: "9999", //评论标识
    };
  },
  created() {},
  methods: {
    //添加评论数据
    addCom(data) {
      if (this.type === 0) {
        //一级评论
        var time = this.getTime();
        var data = {
          name: data.userName,
          date: time,
          content: data.userContent,
          replyBox: [],
        };
        this.datalist.unshift(data);
        this.total++;
        this.placeholder = "*跟我聊聊天呗";
      } else if (this.type === 1) {
        //二级评论
        var time = this.getTime();
        var data = {
          reply_name: data.userName,
          told: this.oldCommer,
          reply_creatAt: time,
          reply_text: data.userContent,
        };
        this.getDataList();
        this.chosedIndex = -1;
        this.type = 0;
        this.total++;
        this.placeholder = "*跟我聊聊天呗";
      }
    },
    //判断为二级评论
    changeComment(name, index) {
      this.oldCommer = name;
      this.placeholder = "@" + name;
      this.chosedIndex = index;
      this.type = 1;
    },
    //转换格式
    getTime() {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
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
        addDateZero(d.getDate()) +
        " " +
        addDateZero(d.getHours()) +
        ":" +
        addDateZero(d.getMinutes()) +
        ":" +
        addDateZero(d.getSeconds());
      return formatdatetime;
    },
    //判断列表是否为空
    judgeIsEmpty() {
      if (this.datalist.length > 0) {
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
        console.log(this.datalist.length);
      }
    },
    //加载评论数据
    async getDataList() {
      await axios({
        method: "get",
        url: "/api/getComments",
        params: {
          articleId: this.comId,
        }, //真正的文章id
      })
        .then((res) => {
          console.log(res);
          var that = this;
          that.total = res.data.count;
          that.datalist = res.data.comments;
          //转换时间格式...
          for (var i = 0; i < that.datalist.length; i++) {
            that.datalist[i].date = that.formateDate(that.datalist[i].date);
            if (that.datalist[i].replyBox) {
              for (var j = 0; j < that.datalist[i].replyBox.length; j++) {
                that.datalist[i].replyBox[j].reply_creatAt = that.formateDate(
                  that.datalist[i].replyBox[j].reply_creatAt
                );
              }
            }
          }
          sessionStorage.setItem("cmts", JSON.stringify(res.data.comments));
        })
        .catch((error) => {
          console.log("error");
        });
      this.judgeIsEmpty();
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>

<style lang="less" scoped>
.about {
  font-family: "bamboo";
}
.about-content {
  width: 1122px;
  height: 747px;
  background-color: #ffffff;
  border-radius: 40px;
  position: relative;
  margin-top: 2em;
}
.about-content .diy div {
  width: 158px;
  height: 145px;
  position: absolute;

  background: url(~@/assets/images/css_sprites.png) -14px -319px;
  background-size: 789px;
}
.about-content .diy div:nth-child(1) {
  left: -53px;
  top: -39px;
  /* Rotate div */
  transform: rotate(-1deg);
  -ms-transform: rotate(-1deg); /* IE 9 */
  -webkit-transform: rotate(-1deg); /* Safari and Chrome */
}
.about-content .diy div:nth-child(2) {
  right: -52px;
  top: -39px;
  transform: rotate(96deg);
  -ms-transform: rotate(96deg);
  -webkit-transform: rotate(96deg);
}
.about-content .diy div:nth-child(3) {
  left: -34px;
  bottom: -27px;
  transform: rotate(94deg);
  -ms-transform: rotate(94deg);
  -webkit-transform: rotate(94deg);
}
.about-content .diy div:nth-child(4) {
  right: -35px;
  bottom: -27px;
  transform: rotate(-1deg);
  -ms-transform: rotate(-1deg);
  -webkit-transform: rotate(-1deg);
}
.about-content .main-content {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  font-family: "bamboo";
  position: relative;
  top: 8em;
}
.about-content .main-content .m-head {
  text-align: center;
}
.about-content .main-content .m-head .m-name {
  font-size: 29px;
}
.about-content .main-content .m-relate ul {
  display: flex;
  justify-content: space-between;
  margin: 1em auto;
  width: 600px;
  &::before,
  &::after {
    content: "";
    display: block;
  }
}
.about-content .main-content .m-relate ul li {
  cursor: pointer;
}
.about-content .main-content .title {
  font-size: 24px;
}
.about-content .main-content .m-other {
  text-align: center;
}
.about-content .main-content .m-other p {
  font-size: 20px;
}
.about-content .main-content .m-other div {
  margin-bottom: 1em;
}
//评论
.comments {
  margin-top: 88px;
}
.comments .comment-header {
  position: relative;
}
.comments .comment-header h2 {
  font-size: 24px;
  color: #ffffff;
  font-weight: bold;
}
.comments .comment-header span {
  width: 60px;
  height: 10px;
  background-color: #ffffff;
  display: block;
}
</style>