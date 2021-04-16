<template>
  <div class="comment-form">
    <form action="">
      <div class="user-mail">
        <i class="bg-email"></i>
        <input type="text" placeholder="*邮箱" v-model="formMess.userMail" />
      </div>

      <div class="user-name">
        <i class="bg-name"></i>
        <input type="text" placeholder="*昵称" v-model="formMess.userName" />
      </div>

      <div class="user-judge">
        <i class="bg-safety"></i>
        <input type="text" :placeholder="judge" v-model="formMess.userJudge" />
      </div>
      <div class="user-content">
        <i class="bg-comment"></i>
        <textarea
          :placeholder="placeholder"
          v-model="formMess.userContent"
        ></textarea>
      </div>
      <button @click="onSubmit($event)">发表</button>
    </form>
  </div>
</template>

<script>
import less from "less";
import "../assets/css/reset.css";
import axios from "axios";

export default {
  props: ["placeholder", "comId", "chosedIndex","told"],
  data() {
    return {
      judge: "", //显示算式
      judgeCode: 0, //存储验证结果
      formMess: {
        userMail: "",
        userName: "",
        userJudge: "",
        userContent: "",
      },
    };
  },
  methods: {
    //上传评论
    async onSubmit(e) {
      e.preventDefault();
      let mailReg = /^([0-9a-zA-Z_\.\-])+\@([0-9a-zA-Z _\.\-])+\.([A-Za-z]{2,4})$/; //校验邮箱格式
      //检验格式
      for (let i in this.formMess) {
        if (this.formMess[i] === "") {
          this.$Message.warning("检查一下还有哪没填呗");
          return;
        } else if (i === "userMail") {
          if (!mailReg.test(this.formMess[i])) {
            this.$Message.error("邮箱格式错啦");
            return;
          }
        } else if (i === "userJudge") {
          if (Number(this.formMess[i]) !== this.judgeCode) {
            this.$Message.error("啊这~算错数了");
            return;
          }
        }
      }
      var time = new Date();
      await axios({
        method: "post",
        url: "/api/postComment",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          formData: this.formMess,
          articleId: this.comId,
          chosedIndex: this.chosedIndex,
          told:this.told,
          time: time.toISOString(),
        },
      })
        .then((res) => {
          console.log(res);
          this.$emit("submit", this.formMess);
          for (var key in this.formMess) {
            this.formMess[key] = "";
          }
          this.mathTest();
          this.isEmpty = false;
        })
        .catch((error) => {
          console.log("fail");
        });
    },
    //算术验证
    mathTest() {
      var num1 = Math.floor(Math.random() * 100);
      var num2 = Math.floor(Math.random() * 100);
      this.judge = "*智能验证：" + num1 + "+" + num2 + "=?";
      this.judgeCode = num1 + num2;
    },
  },
  mounted() {
    this.mathTest();
  },
};
</script>

<style lang="less" scoped>
.comments .comment-form {
  width: 650px;
  height: 236px;
  background-color: #ffffff;
  border-radius: 15px;
  font-size: "bamboo";
  margin-top: 1em;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.48);
}
.comments .comment-form form {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;
  height: 93%;
  padding-left: 2em;
  padding-top: 1em;
}
.comments .comment-form .user-mail input {
  width: 180px;
  height: 26px;
  text-indent: 7px;
  margin-right: 9em;
  outline: none;
}
.comments .comment-form .user-name input {
  width: 180px;
  height: 26px;
  text-indent: 7px;
  outline: none;
}
.comments .comment-form .user-judge input {
  width: 308px;
  height: 26px;
  text-indent: 7px;
  outline: none;
}
.comments .comment-form .user-content textarea {
  width: 540px;
  height: 76px;
  background-color: #ffffff;
  text-indent: 7px;
  outline: none;
}
.comments .comment-form button {
  width: 69px;
  height: 26px;
  background-color: #3f6db2;
  border-radius: 7px;
  color: #ffffff;
  text-decoration: none;
  outline: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 2em;
  bottom: -9px;
}
.user-content {
  margin-top: 23px;
  position: relative;
  bottom: 11px;
}
.comments .comment-form .user-mail input:focus,
.comments .comment-form .user-content textarea:focus,
.comments .comment-form .user-name input:focus,
.comments .comment-form .user-judge input:focus {
  border: 2px solid #3f6db2;
}
/deep/ .bg-email {
  display: inline-block;
  top: 12px;
}
</style>