import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import WebsiteManage from '@/components/WebsiteManage'
import ViewManage from '@/components/ViewManage'
import ViewManageHome from '@/components/ViewManageHome'
import ExpertManage from '@/components/ExpertManage'
import StaffOut from '@/components/StaffOut'
import ResourceLibrary from '@/components/ResourceLibrary'
import CDLibrary from '@/components/CDLibrary'
import JurisdictionManage from '@/components/JurisdictionManage'
import IntegratedMachine from '@/components/screen/integratedMachine'
import Bidding from '@/components/screen/Bidding'
import BiddingMoudle1 from '@/components/screen/bidding/Moudle1'
import BiddingMoudle2 from '@/components/screen/bidding/Moudle2'

Vue.use(Router)
let router=new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            children: [
                //默认跳转网站管理
                {
                    path: '/',
                    redirect: 'websiteManage'
                },
                //网站管理路由
                {
                    path: 'websiteManage',
                    name: 'websiteManage',
                    component: WebsiteManage
                },
                //ViewMange  视图配置路由
                {
                    path: 'viewManage',
                    name: 'viewManage',
                    component: ViewManage,
                    children: [
                        //默认跳转网站管理
                        {
                            path: '/',
                            redirect: 'viewManageHome'
                        },
                        //  视图配置主页面 路由
                        {
                            path: 'viewManageHome',
                            name: 'viewManageHome',
                            component: ViewManageHome
                        },
                         // 视图配置 招投标 路由
                        {
                            path: 'bidding',
                            name: 'bidding',
                            component: Bidding
                        },
                        // 视图配置 招投标 路由
                        {
                            path: 'integratedMachine',
                            name: 'integratedMachine',
                            component: IntegratedMachine
                        },

                    ]
                },
                //  专家考勤 路由
                {
                    path: 'expertManage',
                    name: 'expertManage',
                    component: ExpertManage
                },
                //  权限管理 路由
                {
                    path: 'jurisdictionManage',
                    name: 'jurisdictionManage',
                    component: JurisdictionManage
                },
                //  资源库 路由
                {
                    path: 'resourceLibrary',
                    name: 'resourceLibrary',
                    component: ResourceLibrary
                },
                //  员工外出 路由
                {
                    path: 'staffOut',
                    name: 'staffOut',
                    component: StaffOut
                },
                //  光盘库 路由
                {
                    path: 'cdLibrary',
                    name: 'cdLibrary',
                    component: CDLibrary
                },
                //  权限管理 路由
                {
                    path: 'cdLibrary',
                    name: 'cdLibrary',
                    component: CDLibrary
                }
            ]
        },
        {
            path: '/integratedMachine',
            name: 'integratedMachine',
            component: IntegratedMachine
        },
        {
            path: '/bidding/moudle1',
            name: 'moudle1',
            component: BiddingMoudle1
        },
        {
            path: '/bidding/moudle2',
            name: 'moudle2',
            component: BiddingMoudle2
        },

    ]
})

//路由拦截
router.beforeEach((to, from, next) => {
    if(to.path!='/'&&to.path!='/login'){
        if(!sessionStorage.getItem('userName')){
          next('/');
        }else{
            next();
        }
    }else{
        next();
    }
})
export default router
