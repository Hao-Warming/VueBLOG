<template>
  <div class="c-cards">
    <div class="c-card" v-for="item in lists" :key="item.aid" :name="item.aid">
      <div class="card-main">
        <div class="card-main-img">
          <img src="~@/assets/images/home.jpg" alt="" />
        </div>
        <div class="card-main-inner">
          <h1 @click="detailJump($event)">{{ item.title }}</h1>
          <div v-for="(i, index) in item.tags" :key="index">
            <Tag type="border" color="primary" class="tag">{{ i }}</Tag>
          </div>
          <p v-text="ToText(item.html_content)"></p>
        </div>
      </div>
      <div class="card-other">
        <ul>
          <li>
            <i class="bg-time"></i>
            <span>{{ formateDate(item.date_detail) }}</span>
          </li>
          <li>
            <i class="bg-like"></i>
            <span class="likes" @click="takeLike($event)"
              ><i>{{ item.like_n }}</i
              >人点赞</span
            >
            <i style="display: none">{{ item.aid }}</i>
          </li>
          <li>
            <i class="bg-reads"></i>
            <span class="reads">{{ item.reads_n }}次阅读</span>
          </li>
          <li>
            <i class="bg-letter"></i>
            <span>Warming</span>
          </li>
          <li>
            <span class="read" @click="detailJump($event)">阅读原文</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="page">
      <Page
        :total="total"
        :page-size="5"
        prev-text="Previous"
        next-text="Next"
        @on-change="getData"
      />
    </div>
  </div>
</template>

<script>
import less from "less";
import axios from "axios";
import "../assets/css/reset.css";
import { Tag, Page } from "view-design";
import "view-design/dist/styles/iview.css";
export default {
  name: "home",
  components: {
    Tag,
    Page,
  },
  data() {
    return {
      lists: [], //当前页的数据
      total: 1, //总条数
      whichOne: 0, //第几条（用于cookie）
    };
  },
  methods: {
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
    //获取分页数据
    async getData(currentPage) {
      var that = this;
      let resp = await axios({
        method: "get",
        url: "/api/articlesdata",
        params: {
          currentPage: currentPage,
          currentpath: this.$route.path,
        },
      })
        .then((res) => {
          that.lists = res.data.doc;
          that.total = res.data.total;
          console.log(this.total);
          console.log(res);
        })
        .catch((error) => {
          console.log("fail");
        });
    },
    //将html字符串转化成纯文本
    ToText(HTML) {
      var input = HTML;
      return input
        .replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, "")
        .replace(/<[^>]+?>/g, "")
        .replace(/\s+/g, " ")
        .replace(/ /g, " ")
        .replace(/>/g, " ");
    },
    //点赞状态
    async takeLike(e) {
      let div = e.target;
      while (div.className !== "c-card") {
        div = div.parentNode;
      }
      let cookieName = "like_" + div.getAttribute("name");
      if (this.getCookie(cookieName) === -1) {
        this.setCookie({ [cookieName]: div.getAttribute("name") }, 730);
        div.children[1].children[0].children[1].children[1].children[0].innerText =
          parseInt(
            div.children[1].children[0].children[1].children[1].children[0]
              .innerText
          ) + 1; //更改数量
        this.$Message.info("点赞成功");
        //向后台发送数据
        // await axios({
        //   method:"get",
        //   url:"/api/updateLike",
        //   params:{
        //     id:cookieName
        //   }
        // }).then((res)=>{

        // }).catch(error=>{
        //   console.log("fail");
        // })
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
    detailJump(e) {
      let div = e.target;
      while (div.className !== "c-card") {
        div = div.parentNode;
      }
      let blogId = div.getAttribute("name");
      this.$router.push("/article/" + blogId);
      // axios({
      //   method: "get",
      //   url: "/article/" + blogId,
      // })
      //   .then((res) => {
      //     console.log(res);
      //     this.$router.push("/article/" + blogId);
      //   })
      //   .catch((error) => {
      //     console.log("fail");
      //   });
    },
  },
  mounted() {
     this.getData();
  },
 
};
</script>

<style lang='less' scoped>
.c-cards .c-card {
  width: 720px;
  height: 220px;
  background: #ffffff;
  transition: all 0.6s;
  margin-bottom: 30px;
}
.c-cards .c-card:hover {
  box-shadow: 0 0 13px rgba(204, 204, 255, 1);
  transition: all 0.6s;
}
.c-card .card-main {
  padding-top: 18px;
  display: flex;
  // justify-content: space-evenly;
  justify-content: space-between;
  &:before,
  &:after {
    content: "";
    display: block;
  }
  padding-bottom: 11px;
  border-bottom: 1px solid rgba(153, 153, 153, 0.5);
}
.c-card .card-main .card-main-img img {
  width: 238px;
  height: 157px;
}
.c-card .card-main .card-main-inner h1 {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  letter-spacing: 0px;
  font-stretch: normal;
  height: 25px;
}
.c-card .card-main .card-main-inner h1:hover,
.c-card .card-main .card-main-inner .tag:hover {
  cursor: pointer;
}
.c-card .card-main .card-main-inner .tag {
  margin: 14px 0;
}
.c-card .card-main .card-main-inner p {
  width: 375px;
  height: 69px;
  font-size: 15px;
  letter-spacing: 0px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -moz-box; /* Firefox 17- */
}
.c-card .card-other {
  height: 27px;
  line-height: 27px;
}
.c-card .card-other ul {
  display: flex;
  padding: 0 40px;
  justify-content: space-between;
  font-size: 12px;
}
.c-card .card-other li span {
  padding-left: 8px;
  color: #333333;
}
.c-card .card-other li .likes:hover,
.c-card .card-other li .read:hover {
  cursor: pointer;
  color: #6699cc;
}
.c-cards .page {
  text-align: center;
  margin-bottom: 35px;
}
</style>