<template>
  <div class="login">
    <h2 class="admin">管理员登陆</h2>
    <br />
    <Form ref="formInline" :model="formInline" :rules="ruleInline">
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input
          type="password"
          v-model="formInline.password"
          placeholder="Password"
        >
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" ghost @click="handleSubmit()">登陆</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { Form, FormItem, Input, Icon, Button } from "view-design";
import "view-design/dist/styles/iview.css";
import axios from "axios";
export default {
  components: {
    Form,
    FormItem,
    Input,
    Icon,
    Button,
  },
  data() {
    return {
      formInline: {
        user: "",
        password: "",
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // handleSubmit(name) {
    //   this.$refs[name].validate((valid) => {
    //     if (valid) {
    //       this.$Message.success("Success!");
    //     } else {
    //       this.$Message.error("Fail!");
    //     }
    //   });
    // },
    async handleSubmit() {
      await axios({
        method: "post",
        url: "/api/login",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: this.formInline,
      })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          this.$router.push({ name: "Posts" });
          console.log(res);
        })
        .catch((err) => {
          console.log("登陆失败");
        });
    },
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.backgroundColor = "#99cccc";
  },
};
</script>

<style>
.login {
  width: 350px;
  margin: 0 auto;
  position: relative;
  top: 15em;
  text-align: center;
}
.admin {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>