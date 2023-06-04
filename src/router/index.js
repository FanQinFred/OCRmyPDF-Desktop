import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'OCR',
        component: () => import('@/components/ocr/ocr.vue'),
        children:[{
            path: '',
            name: 'Task',
            component: () => import('@/components/ocr/task/task.vue')
        },{
            path: '/setting',
            name: 'Setting',
            component: () => import('@/components/ocr/setting/setting.vue')
        },{
            path: '/sponsor',
            name: 'Sponsor',
            component: () => import('@/components/ocr/sponsor/sponsor.vue')
        }]
    },{
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

// 路由拦截
router.beforeEach((to, from, next) => {
    next();
})

router.afterEach(() => {
    document.querySelector("body").setAttribute("style", "overflow: auto !important;");
    window.scrollTo(0, 0);
});

export default router