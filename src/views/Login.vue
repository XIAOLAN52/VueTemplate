<template>
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :xl="6" :lg="10">
            <h2>欢迎来到VueAdmin管理系统</h2>
            <el-image :src="require('@/assets/logo.png')"></el-image>
            <p>关注公众号AIDI</p>
            <p>回复VueAdmin获取登录密码</p>
        </el-col>

        <el-col :span="1">
            <el-divider direction="vertical" />
        </el-col>
        <!--表单区-->
        <el-col :xl="6" :lg="10">
            <el-form
                ref="ruleFormRef"
                :model="loginForm"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="用户的名" prop="username" style="width: 380px">
                    <el-input v-model="loginForm.username" />
                </el-form-item>
                <el-form-item label="用户密码" prop="password" style="width: 380px">
                    <el-input v-model="loginForm.password" type="password"/>
                </el-form-item>
                <el-form-item label="验证码" prop="code" style="width: 380px">
                    <el-input v-model="loginForm.code" style="width: 300px;float: left" />
                    <el-image :src="captchaImg" @click="getCaptcha" style="width: 100px;float: left display:flex"></el-image>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">Create</el-button>
                    <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { FormInstance } from 'element-plus'
import axios from 'axios'
import { onBeforeMount } from 'vue'
import qs from 'qs'


//引入vue-router和vuex
import { useRouter } from 'vue-router'
import { useStore } from "vuex";

const router = useRouter()
const store = useStore();


const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({
    username: '',
    password: '',
    code: '',
    token: ''
})
const captchaImg = ref(null)
const getCaptcha = () => {
    axios.get('/captcha').then(res => {
        console.log(res)
        //因为 Result： code，msg，data（这里面有token）
        loginForm.token = res.data.data.token
        captchaImg.value = res.data.data.captchaImg
        loginForm.code=''
    })
}
onBeforeMount(() => {
    getCaptcha()
})


const rules = reactive({
    username: [
        { required: true, message: '请不要忘了输入用户名~', trigger: 'blur' },
    ],
    password: [
        {
            required: true,
            message: '还没输入密码~',
            trigger: 'blur',
        },
    ],
    code: [
        { required: true, message: '验证码~', trigger: 'blur' },
        { min: 5, max: 5, message: '长度应为5', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            axios.post('/login?' + qs.stringify(loginForm) ).then(res => {
                const jwt = res.headers['authorization']
                store.commit('SET_TOKEN', jwt)
                router.push("/index")
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>
<style scoped>
.el-row {
    background-color: #fafafa;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}
.captchaImg {
    float: left;
    margin-left: 4px;
    border-radius: 4px;
}
</style>