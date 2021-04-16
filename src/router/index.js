import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewUI from 'view-design';

Vue.use(VueRouter)
Vue.use(ViewUI);

const routes = [{
        path: '/',
        name: 'Index',
        component: () =>
            import ('../views/Index.vue'),
        children: [{
                path: "",
                name: "Home",
                component: () =>
                    import ("../views/Home"),
                meta: { title: "首页" }
            },
            {
                path: "sort",
                component: () =>
                    import ("../views/Sort"),
                children: [{
                    path: "basic",
                    component: () =>
                        import ("../components/Basic"),
                    meta: { title: 'F2E-basic' }
                }, {
                    path: "aboutVue",
                    component: () =>
                        import ("../components/AboutVue"),
                    meta: { title: '关于Vue' }
                }, {
                    path: "life",
                    component: () =>
                        import ("../components/Life"),
                    meta: { title: '生活杂谈~' }
                }]
            }, {
                path: 'archives',
                name: 'Archives',
                component: () =>
                    import ('../views/Archives'),
                meta: { title: "归档" }
            },
            {
                path: 'article/:id',
                name: 'Article',
                component: () =>
                    import ('../views/Article'),
                meta: { title: "文章" }
            },
            {
                path: '/about',
                name: 'About',
                component: () =>
                    import ('../views/About.vue'),
                meta: { title: "关于" },
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../components/back/Login.vue'),
        meta: { title: "登陆" }
    },
    {
        path: '/admin',
        name: 'Admin',
        redirect: '/admin/posts',
        meta: { requireAuth: true }, //访问需要登陆验证
        component: () =>
            import ('../views/backend.vue'),
        children: [{
            path: 'posts',
            name: 'Posts',
            meta: { requireAuth: true, title: '博客文章' },
            component: () =>
                import ('../components/back/Posts.vue')
        }, {
            path: 'editor',
            name: 'Editor',
            meta: { requireAuth: true, title: '编辑文章' },
            component: () =>
                import ('../components/back/Editor.vue')
        }]
    },

]

const router = new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        routes
    })
    // 动态更改title，还有加载进度条
    //登陆验证
router.beforeEach((to, from, next) => {
        ViewUI.LoadingBar.start();
        var token = localStorage.getItem("token")
        document.title = to.meta.title
        if (!token && to.meta.requireAuth) {
            console.log("进来了")
            next({ name: 'Login' })
        } else if (token && to.name === 'Login') {
            next({ name: 'Posts' })
        } else {
            next()
        }
    })
    //全局后置守卫
router.afterEach(route => {
    ViewUI.LoadingBar.finish();
});
export default router