import axios from 'axios'
import router from "./router"
import { ElMessage } from "element-plus";

axios.defaults.baseURL = "http://localhost:8081"

const request = axios.create({
	timeout: 5000,
	headers: {
		'Content-Type': "application/json; charset=utf-8"
	}
})

//每次发起请求拦截一下 然后给请求的headers附带一个Authorization
request.interceptors.request.use(config => {
	config.headers['Authorization'] = localStorage.getItem("token")
	return config
})
//对请求结果的处理
request.interceptors.response.use(
	response => {
		console.log("response ->" + response)

		let res = response.data

		if (res.code === 200) {
			return response
		} else {
			ElMessage.error(!res.msg ? '系统异常' : res.msg)
			return Promise.reject(response.data.msg)
		}
	},
	error => {

		console.log(error)

		if (error.response.data) {
			error.massage = error.response.data.msg
		}

		if (error.response.status === 401) {
			router.push("/login")
		}

		ElMessage.error(error.massage)
		return Promise.reject(error)
	}
)

export default request