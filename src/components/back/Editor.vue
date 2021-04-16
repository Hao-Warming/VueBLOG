<template>
  <div class="editor">
    <div class="title">
      <input type="text" placeholder="文章标题" v-model="content.title" />
    </div>
    <RadioGroup v-model="content.tag">
      <Radio label="前端基础"></Radio>
      <Radio label="关于Vue"></Radio>
      <Radio label="生活杂谈"></Radio>
    </RadioGroup>
    <mavon-editor
      style="height: 90%"
      ref="md"
      v-model="content.content"
    ></mavon-editor>
    <button class="post-article" @click="editArticle">发布文章</button>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { RadioGroup, Radio } from "view-design";
import "view-design/dist/styles/iview.css";
import less from "less";
import axios from "axios";
export default {
  components: {
    mavonEditor,
    RadioGroup,
    Radio,
  },
  data() {
    return {
      content: {
        title: "",
        tag: "",
        content: "",
      },
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
    async editArticle() {
      if (
        this.content.title.length == 0 ||
        this.content.tag.length == 0 ||
        this.content.content.length == 0
      ) {
        this.$Message.error("检查一下哪还没有填？");
        return;
      } else {
        var time = new Date();
        await axios({
          method: "post",
          url: "/api/editone",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            title: this.content.title,
            tag: this.content.tag,
            mdContent: this.$refs.md.d_value,
            htmlContent: this.$refs.md.d_render,
            aid: this.$route.query,
            detailtime: time.toISOString(),
            date: time.getFullYear(),
            formaldate:this.formateDate(time.toISOString())
          },
        })
          .then((res) => {
            this.$Message.success(res.data);
            this.$router.push("/admin/posts");
          })
          .catch((err) => {
            console.log("err");
          });
      }
    },
    //假如是编辑文章，需要获取文章数据
    async getArticleByAid() {
      var that = this;
      await axios({
        method: "get",
        url: "/api/article",
        params: this.$route.query, //查询参数
      })
        .then((res) => {
          console.log(res);
          that.content.title = res.data.title;
          that.content.tag = res.data.tags[0];
          that.content.content = res.data.content;
        })
        .catch((err) => {
          console.log("获取文章失败");
        });
    },
    //校验token
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
  created() {
    if (this.$route.query.aid) {
      this.getArticleByAid();
    }
  },
  mounted() {
    console.log(this.$route.query);
    // console.log(this.$refs.md.d_render); //html
    // console.log(this.$refs.md.d_value); //普通文本
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.checkToken();
    });
  },
};
</script>

<style scoped lang="less">
.editor {
  margin: auto;
  width: 80%;
  height: 700px;
  position: relative;
}

.editor .title input {
  width: 100%;
  text-align: center;
  margin-bottom: 3em;
  height: 50px;
  font-size: 24px;
  border: 0;
  outline: none;
  border-bottom: 1px solid #cccccc;
}
.editor .post-article {
  position: absolute;
  top: 5em;
  right: 0;
  width: 95px;
  height: 36px;
  border-radius: 6px;
  border: 0;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  color: #999999;
}
.editor .post-article:hover {
  color: #000000;
}
/deep/ .ivu-radio-group {
  position: absolute;
  top: 5em;
  left: 0;
}
</style>