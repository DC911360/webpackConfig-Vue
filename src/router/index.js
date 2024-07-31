import { createRouter,createWebHistory } from 'vue-router'

const Home =  ()=> import(/* webpackChunkName:'home' */ '../views/Home')
const About =  ()=> import(/* webpackChunkName:'about' */ '../views/About')
// const Home =  ()=> import('../views/Home') //http://localhost:3000/static/js/src_views_Home_index_vue.chunk.js
// const About =  ()=> import('../views/About') //http://localhost:3000/static/js/src_views_About_index_vue.chunk.js 
export default  createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:"/",
            redirect:'/home'
        },
        {
            path:'/home',
            component:Home
        },
        {
            path:'/about',
            component:About
        },
    ]
})