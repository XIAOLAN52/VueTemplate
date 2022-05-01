interface MenuList {

}
export default ({
  state: {
    menuList: [
      {
        name: 'SysManage',
        title: '系统管理',
        path: '',
        component: '',
        children: [
          {
            name: 'SysUser',
            title: '用户管理',
            path: '/sys/user',
            component: 'sys/User',
            children: []
          },
          {
            name: 'SysRole',
            title: '角色管理',
            path: '/sys/role',
            component: 'sys/Role',
            children: []
          },
          {
            name: 'SysMenu',
            title: '菜单管理',
            path: '/sys/menu',
            component: 'sys/Menu',
            children: []
          }
        ]
      },
      {
        name: 'SysTools',
        title: '系统工具',
        path: '',
        component: '',
        children: [
          {
            name: 'SysDict',
            title: '数字字典',
            path: '/sys/dicts',
            component: '',
            children: []
          }
        ]
      }
    ],
    permList: []
  },
  getters: {
  },
  mutations: {
    setMenuList(state: { menuList: any },menu: any){
      state.menuList = menu
    },
    setPermList(state: { permList: any },perm: any){
      state.permList = perm
    }
  },
  actions: {
  },

})
