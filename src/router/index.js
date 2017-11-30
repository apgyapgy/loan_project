import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * [异步组件加载函数]
 * @param  {[string]} name [组件名称]
 * @return {[promise]}      [组件]
 */
const asyncComponent = (name) => {
    return resolve => require([`@/components/${name}`], resolve)
}

//异步加载组件
const Index = asyncComponent('index/index'),
    List = asyncComponent('list/list'),
    Detail = asyncComponent('detail/detail'),
    toLoan = asyncComponent('toLoan/toLoan');
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },{
      path:'/index',
      name:'Index',
      component:Index
    },{
      path:'/list',
      name:'List',
      component:List
    },{
      path:'/detail',
      name:'Detail',
      component:Detail
    },{
      path:'/toLoan',
      name:'toLoan',
      component:toLoan
    }
  ]
})
