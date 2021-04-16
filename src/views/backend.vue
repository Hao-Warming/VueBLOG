<template>
  <div class="backend">
    <Menu mode="horizontal" active-name="1">
      <MenuItem name="1">
        <Icon type="ios-paper" />
        <router-link to="/admin/posts" class="router-link" 
          >文章管理</router-link
        >
      </MenuItem>
      <MenuItem name="2" @click.native="logout">
        <Icon type="ios-people" />
        退出登陆
      </MenuItem>
    </Menu>
    <br /><br /><br />
    <router-view> </router-view>
  </div>
</template>

<script>
import less from "less";
import "../assets/css/reset.css";
import { Menu, MenuGroup, MenuItem, Icon } from "view-design";
import "view-design/dist/styles/iview.css";
export default {
  components: {
    Menu,
    MenuGroup,
    MenuItem,
    Icon,
  },
  data() {
    return {};
  },
  methods: {
    logout(){
      localStorage.removeItem("token");
      this.$router.push({name:"Home"})
    }
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.router-link {
  color: inherit;
}
</style>