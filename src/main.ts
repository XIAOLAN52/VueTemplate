import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//axios vue-axios
import axios from './axios'
import VueAxios from 'vue-axios'

// require("./mock.js")
const app = createApp(App)
app.use(store).use(router).mount('#app')
app.use(ElementPlus)
app.use(VueAxios,axios)
