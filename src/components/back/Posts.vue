<template>
  <div class="posts">
    <Table border :columns="columns" :data="dataList">
      <template slot-scope="{ row }" slot="name">
        <strong :name="row.aid">{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <router-link
          :to="{ name: 'Editor', query: { aid: row.aid } }"
          style="display: inline-block"
          ><Button type="primary" size="small" style="margin-right: 5px"
            >Edit</Button
          ></router-link
        >
        <Button
          type="error"
          size="small"
          @click="remove(row.aid, index, row.year)"
          >Delete</Button
        >
      </template>
    </Table>
    <div class="add_article">
      <br />
      <router-link :to="{ name: 'Editor' }"
        ><Button type="info" style="display: inline-block"
          >Add Article</Button
        ></router-link
      >
    </div>
    <div class="page">
      <br />
      <br />
      <Page :total="total" :page-size="5" @on-change="getData" />
    </div>
  </div>
</template>
<script>
import less from "less";
import axios from "axios";
import { Table, Button, Page } from "view-design";
import "view-design/dist/styles/iview.css";
export default {
  components: {
    Table,
    Button,
    Page,
  },
  data() {
    return {
      columns: [
        {
          title: "Name",
          slot: "name",
        },
        {
          title: "Tag",
          key: "tag",
        },
        {
          title: "Date",
          key: "date",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      dataList: [],
      total: 1,
    };
  },
  methods: {
    async remove(aid, index, year) {
      await axios({
        method: "post",
        url: "/api/removeone",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: { aid: aid, date: year },
      })
        .then((res) => {
          this.$Message.success(res.data);
          this.dataList.splice(index, 1); //客户端视觉删除数据
        })
        .catch((err) => {
          console.log("删除数据失败");
        });
    },
    jumpDetail() {},
    //获取分页数据
    async getData(currentPage) {
      var that = this;
      that.dataList = [];
      await axios({
        method: "get",
        url: "/api/articlesdata",
        params: {
          currentPage: currentPage,
          currentpath: this.$route.path,
        },
      })
        .then((res) => {
          var doc = res.data.doc;
          for (let i = 0; i < doc.length; i++) {
            var obj = {
              name: doc[i].title,
              tag: doc[i].tags[0],
              date: that.formatDate(new Date(doc[i].date_detail)),
              aid: doc[i].aid,
              year:(new Date(doc[i].date)).getFullYear()
            };
            that.dataList.push(obj);
          }
          that.total = res.data.total;
        })
        .catch((error) => {
          console.log("fail");
        });
    },
    //格式化时间
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    async checkToken() {
      var token = localStorage.getItem("token");
      await axios({
        method: "get",
        url: "/api/checktoken",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
        .then((res) => {
          console.log("校验成功");
        })
        .catch((err) => {
          console.log("校验失败");
          localStorage.removeItem("token");
          this.$router.push({ name: "Login" });
        });
    },
  },
  mounted() {
    this.getData();
    document.getElementsByTagName("body")[0].style.backgroundColor = "#ffffff"; //解决登陆进来背景颜色没有发生更改的bug...
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.checkToken();
    });
  },
};
</script>

<style scoped lang="less">
.add_article {
  position: relative;
}
.add_article button {
  position: absolute;
  right: 30px;
}
.page {
  text-align: center;
}
</style>
