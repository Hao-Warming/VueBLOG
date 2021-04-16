<template>
  <div class="comment-list">
    <p class="comment-count">共有{{ total }}条留言</p>
    <div v-if="isEmpty" class="empty-content">
      <h3>空空如也~</h3>
    </div>
    <div v-else>
      <div class="list-item" v-for="(item,index) in datalist" :key="item.order">
        <div class="user">
          <img src="~@/assets/images/message.jpg" alt="" class="list-img" />
          <p class="user-name">{{ item.name }}</p>
          <p class="user-time">{{ item.date }}</p>
        </div>
        <div class="con">
          <p class="text">
            {{ item.content }}
          </p>
          <div class="action" @click="reply(item.name, item.order)">回复</div>
        </div>

        <!-- 回复的容器 -->
        <div class="reply-box">
          <div class="reply-item" v-for="i in item.replyBox">
            <div class="reply-user">
              <img
                src="~@/assets/images/message.jpg"
                alt=""
                class="reply-img"
              />
              <p class="reply-user-name">
                <span>{{ i.reply_name }}</span>
                <span class="told">@{{ i.told }}</span>
              </p>
              <p class="reply-user-time">{{ i.reply_creatAt }}</p>
            </div>
            <div class="reply-on">
              <p class="reply-text">
                {{ i.reply_text }}
              </p>
              <div class="reply-action" @click="reply(i.reply_name, item.order)">
                回复
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import less from "less";
import "../assets/css/reset.css";
import axios from "axios";
export default {
  props: ["datalist", "total"],
  data() {
    return {
      isEmpty: false, //判断评论列表是否为空
    };
  },
  methods: {
    reply(name, index) {
      document.getElementById("reply-href").scrollIntoView({behavior: "smooth"});
      this.$emit("change", name, index);
    
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.comments .comment-list {
  width: 1119px;
  background-color: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.48);
  border-radius: 15px;
  margin-top: 3em;
  margin-bottom: 3em;
  color: #000000;
  padding-bottom: 3em;
}
.comments .comment-list .comment-count {
  width: 1100px;
  border-bottom: 1px solid #999999;
  margin: 0 auto;
  font-size: 14px;
  color: #000000;
  padding-top: 1em;
  text-indent: 1em;
  padding-bottom: 4px;
}
.comments .comment-list .empty-content {
  height: 300px;
  text-align: center;
  line-height: 300px;
  font-size: 30px;
  font-family: "bamboo";
}
.comments .comment-list .list-item {
  position: relative;
  width: 1100px;
  margin: 0 auto;
  margin-top: 1em;
  padding-bottom: 1em;
  border-bottom: 1px solid #999999;
}
.comments .comment-list .list-item .user,
.comments .comment-list .reply-box .reply-item .reply-user {
  font-size: 14px;
  position: relative;
}
.comments .comment-list .list-item .user .user-name {
  position: absolute;
  left: 50px;
  top: 5px;
}

.comments .comment-list .list-item .user .user-time {
  position: absolute;
  top: 22px;
  left: 50px;
  color: #999999;
}
.comments .comment-list .list-item .con {
  position: relative;
  padding: 1em 0;

  padding-left: 2em;
}
.comments .comment-list .list-item .con .action {
  position: absolute;
  right: 17px;
  width: 55px;
  height: 25px;
  line-height: 25px;
  letter-spacing: 1px;
  border-radius: 5px;
  background-color: #3f6db2;
  color: #ffffff;
  top: 14px;
  cursor: pointer;
}
.comments .comment-list .list-item .con .text,
.comments .comment-list .reply-box .reply-item .reply-on .reply-text {
  width: 690px;
  letter-spacing: 2px;
  text-indent: 2em;
  font-size: 20px;
}
.comments .comment-list .list-item .con .action,
.comments .comment-list .reply-box .reply-item .reply-on .reply-action {
  text-align: center;
}
//评论盒子
.comments .comment-list .reply-box {
  margin-left: 3em;
}
.comments .comment-list .reply-box .reply-item .reply-user {
  position: relative;
}
.comments .comment-list .reply-box .reply-item .reply-user .reply-user-name {
  font-size: 13px;
  position: absolute;
  top: -1px;
  left: 38px;
}
.comments
  .comment-list
  .reply-box
  .reply-item
  .reply-user
  .reply-user-name
  .told {
  color: #3f6db2;
  font-size: 14px;
  margin-left: 5px;
}
.comments .comment-list .reply-box .reply-item .reply-user .reply-user-time {
  font-size: 13px;
  color: #999999;
  position: absolute;
  top: 15px;
  left: 38px;
}
.comments .comment-list .reply-box .reply-item .reply-on {
  position: relative;
  padding: 1em 0;
  padding-left: 1em;
}
.comments .comment-list .reply-box .reply-item .reply-on .reply-action {
  position: absolute;
  right: 17px;
  width: 55px;
  height: 25px;
  line-height: 25px;
  letter-spacing: 1px;
  border-radius: 5px;
  background-color: #3f6db2;
  color: #ffffff;
  top: 14px;
  cursor: pointer;
}
.comments .list-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
  left: 1px;
}
.comments .reply-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
}
</style>