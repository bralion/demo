import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import StartCamera from '@/components/StartCamera'
import Handle from '@/components/HandlePicture'
import PictureResult from '@/components/PictureResult'

Vue.use(Router)
let router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: Index
        },
        {
            path: '/startCamera',
            name: 'startCamera',
            component: StartCamera
        },
        {
            path: '/handle',
            name: 'handle',
            component: Handle
        },
        {
            path: '/picResult',
            name: 'picResult',
            component: PictureResult
        }]
})

// 路由拦截
router.beforeEach((to, from, next) => {
    if (to.path != '/' && to.path != '/index') {
        // if (!sessionStorage.getItem('userName')) {
        //     next('/')
        // } else {
        //     next()
        // }
	    next()
    } else {
        next()
    }
})
export default router
