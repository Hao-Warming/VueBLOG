<template>
  <div class="home">
    <Layout>
      <Header
        :style="{
          position: 'fixed',
          width: '100%',
          background: 'rgba(67,61,62,0.7)',
        }"
        id="header"
      >
        <Menu mode="horizontal" theme="dark" :active-name="activemenu">
          <MenuItem
            name="/"
            class="home-page"
            @click.native="changePage($event)"
            ><i class="bg-home"></i><span>首页</span></MenuItem
          >
          <MenuItem
            name="/sort"
            class="sort-page"
            @click.native="changePage($event)"
            ><i class="bg-sort"></i><span>分类</span>
            <div class="submenu">
              <p @click="tagSort($event)">前端基础</p>
              <p @click="tagSort($event)">关于Vue</p>
              <p @click="tagSort($event)">日常杂谈</p>
            </div>
          </MenuItem>
          <MenuItem
            name="/archives"
            class="archives-page"
            @click.native="changePage($event)"
            ><i class="bg-archives"></i>归档</MenuItem
          >
          <MenuItem
            name="/about"
            class="about-page"
            @click.native="changePage($event)"
            ><i class="bg-about"></i>关于</MenuItem
          >
          <li class="right-head">
            <span class="web-font">纸上得来终觉浅，绝知此事要躬行</span>
          </li>
        </Menu>
      </Header>
      <div class="background">
        <h2>Warming's Blog</h2>
      </div>
      <div id="content">
        <div class="layout">
          <!-- 使用keep-alive:避免反复重渲染导致的性能问题 -->
          <keep-alive include="home,archives"
            ><router-view></router-view
          ></keep-alive>

          <div class="diy-info">
            <div class="location">
              <div class="p-info">
                <div class="avatar"  @click="clearCss()">
                  <router-link to="/about"
                    ><Avatar src="http://localhost:8080/Avatar.jpg" size="78"
                      >W</Avatar
                    ></router-link
                  >
                </div>
                <div class="relate">
                  <ul>
                    <li>
                      <Poptip content="2644162761@qq.com">
                        <i class="bg-email"></i>
                        <span>QQ邮箱</span>
                      </Poptip>
                    </li>
                    <li>
                      <Poptip trigger="hover" content="点击跳转到我的github"
                        ><a
                          href="https://github.com/Hao-Warming?tab=repositories"
                          target="_blank"
                          style="display: inline-block; color: inherit"
                          ><i class="bg-github"></i> <span>Github</span></a
                        >
                      </Poptip>
                    </li>
                    <li>
                      <Poptip trigger="hover" content="点击跳转到我的知乎">
                        <a
                          href="https://www.zhihu.com/people/warming-87-97"
                          target="_blank"
                          style="display: inline-block; color: inherit"
                          ><i class="bg-zhihu"></i> <span>知乎</span></a
                        >
                      </Poptip>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="hot-news">
                <List header="文章推荐" border size="small">
                  <ListItem v-for="item in list" :key="item.aid"
                    ><i class="bg-article"></i>
                    <span @click="detail($event)" :name="item.aid">{{
                      item.title
                    }}</span>
                  </ListItem>
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        class="footer"
        :style="{
          height: '140px',
          background: '#282828',
          textAlign: 'center',
        }"
      >
        <p>DESIGNED BY FOXING | WARMING's BLOG</p>
        <p>作者： Warming</p>
      </Footer>
    </Layout>
  </div>
</template>

<script>
import less from "less";
import "../assets/css/reset.css";
import axios from "axios";
import {
  Layout,
  Header,
  Menu,
  MenuGroup,
  MenuItem,
  Submenu,
  Content,
  Avatar,
  Icon,
  Input,
  Tag,
  Poptip,
  List,
  Page,
  Footer,
  Dropdown,
  DropdownMenu,
} from "view-design";
import "view-design/dist/styles/iview.css";
export default {
  name: "Home",
  components: {
    Header,
    Input,
    Icon,
    Layout,
    Menu,
    MenuGroup,
    MenuItem,
    Submenu,
    Content,
    Avatar,
    Header,
    Tag,
    Poptip,
    List,
    Page,
    Footer,
    Dropdown,
    DropdownMenu,
  },
  data() {
    return {
      mark: 0,
      sort: 0,
      activemenu: "/",
      list: {},
    };
  },
  created() {
    this.$nextTick(() => {
      //根据当前路径激活导航菜单
      this.activemenu = this.$route.path;
    });
  },
  methods: {
    //切换指定路由页面
    changePage(e) {
      let ul = e.target;
      let li = e.target;
      let div = document.getElementsByClassName("diy-info")[0];
      while (ul.tagName != "UL") {
        ul = ul.parentNode;
      }
      while (li.tagName != "LI") {
        li = li.parentNode;
      }
      let lists = Array.from(ul.querySelectorAll("li"));
      this.mark = lists.indexOf(li); //返回索引
      console.log(this.mark);
      switch (this.mark) {
        case 0:
          div.style.display = "block";
          this.$router.push("/");
          break;
        case 1:
          div.style.display = "block";
          break;
        case 2:
          div.style.display = "block";
          this.$router.push("/archives");
          break;
        case 3:
          div.style.display = "none";
          this.$router.push("/about");
          break;
      }
    },
    tagSort(e) {
      let div = e.target;
      let p = e.target;
      while (div.tagName != "DIV") {
        div = div.parentNode;
      }
      let list = Array.from(div.querySelectorAll("p"));
      this.sort = list.indexOf(p);
      switch (this.sort) {
        case 0:
          this.$router.push("/sort/basic");
          break;
        case 1:
          this.$router.push("/sort/aboutVue");
          break;
        case 2:
          this.$router.push("/sort/life");
          break;
      }
    },
    async detail(e) {
      let target = e.target;
      let blogId = target.getAttribute("name");
      this.$router.push("/article/" + blogId);
      console.log(blogId);
    },
    async getData() {
      await axios({
        method: "get",
        url: "/api/recommends",
      })
        .then((res) => {
          this.list = res.data;
        })
        .catch((err) => {
          console.log("获取文章推荐失败");
        });
    },
    clearCss(){
      let div = document.getElementsByClassName("diy-info")[0];
      div.style.display = "none";
    }
  },
  mounted() {
    if (this.$route.path === "/about") {
      let div = document.getElementsByClassName("diy-info")[0];
      div.style.display = "none";
    }
    this.getData();
  },
  
};
</script>
<style lang='less' scoped>
#header {
  z-index: 1;
}
/deep/ .ivu-menu-dark {
  background-color: rgba(67, 61, 62, 0);
}
/deep/ .ivu-menu-item {
  font-size: 16px;
  margin-right: 46px;
}
.home-page a,
.sort-page a,
.archives-page a,
.about-page a {
  color: #ffffff;
}

.submenu {
  font-size: 14px;
  background-color: rgba(67, 61, 62, 0.7);
  position: absolute;
  width: 7em;
  text-align: center;
  top: 61px;
  left: 7px;
  animation: fade 1s;
  display: none;
  color: rgba(255, 255, 255, 0.7);
}
.submenu p {
  border-bottom: 1px solid;
}
//二级菜单动画
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.ivu-menu-item:hover > .submenu {
  display: block;
}
.submenu p:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.7);
}
.right-head {
  float: right;
  font-size: 16px;
  color: #ffffff;
  padding-right: 20px;
  cursor: context-menu;
}

.right-head span {
  font-family: "bamboo";
  font-size: 20px;
}
.background {
  background: url("~@/assets/images/background.jpg") 0 0;
  background-size: cover;
  background-position: center center;
  height: 400px;
}
.background h2 {
  text-align: center;
  line-height: 400px;
  font-size: 40px;
  color: #fff;
  font-weight: bold;
}

#content {
  background-color: #433d3e;
}
#content .layout {
  width: 100%;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}

//右边
#content .layout .diy-info {
  position: relative;
}
#content .layout .diy-info .p-info {
  background: url("~@/assets/images/p-info-bg.jpg");
  width: 392px;
  height: 220px;
  position: relative;
  margin-bottom: 30px;
}
#content .layout .diy-info .p-info .avatar {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 188px;
}
#content .layout .diy-info .p-info .avatar span {
  cursor: pointer;
}
#content .layout .diy-info .p-info .relate {
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 100%;
}
#content .layout .diy-info .p-info .relate ul {
  display: flex;
  justify-content: space-between;
  &:before,
  &:after {
    content: "";
    display: block;
  }
}
#content .layout .diy-info .p-info .relate li {
  width: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
}
#content .layout .diy-info .p-info .relate li span {
  font-size: 12px;
}
/deep/ .ivu-list-bordered .ivu-list-item {
  border-color: #999999;
}
#content .layout .diy-info .hot-news {
  background-color: #ebe9e9;
  margin-bottom: 35px;
}
#content .layout .diy-info .hot-news li:hover {
  cursor: pointer;
  color: #6699cc;
}
/deep/.ivu-list-bordered.ivu-list-small .ivu-list-header {
  display: inline-block;
  border-bottom: 2px solid #0459b0;
}

@media screen and (max-width: 1200px) {
  #content .layout .diy-info .p-info,
  #content .layout .diy-info .hot-news,
  /deep/ .web-font {
    display: none;
  }
  #content .layout {
    justify-content: center;
  }
}
@media screen and (min-width: 1200px) and (max-width: 1389px) {
}
@media screen and (min-width: 1390px) {
  #content .layout {
    width: 1300px;
  }
}
@media screen and (max-width: 1870px) {
}
</style>
