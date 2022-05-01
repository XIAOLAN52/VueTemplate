<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData1"
            style="width: 100%"
            row-key="id"
            border
            lazy
            stripe
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="name" label="名称" width="180" sortable />
            <el-table-column prop="perms" label="权限编码" width="180" sortable />
            <el-table-column prop="icon" label="图标" width="180"></el-table-column>
            <el-table-column prop="type" label="类型" width="180">
                <template #default="scoped">
                    <!--注意这里 element-plus可能变化了写法-->
                    <el-tag size="small" v-if="scoped.row.type === 0">目录</el-tag>
                    <el-tag size="small" v-if="scoped.row.type === 1" type="success">菜单</el-tag>
                    <el-tag size="small" v-if="scoped.row.type === 2" type="info">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="path" label="菜单URL" width="180" />
            <el-table-column prop="component" label="菜单组件" width="180" />
            <el-table-column prop="orderNum" label="排序号" width="180" />
            <el-table-column prop="status" label="状态" width="180">
                <template #default="scoped">
                    <el-tag size="small" v-if="scoped.row.status === 0">正常</el-tag>
                    <el-tag size="small" v-else-if="scoped.row.status === 1" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="do" label="操作" width="180">
                <template #default="scoped">
                    <el-button type="text" @click="editHandle(scoped.row.id)">编辑</el-button>
                    <el-divider direction="vertical" />
                    <el-popconfirm
                        title="Are you sure to delete this?"
                        @confirm="delHandle(scoped.row.id)"
                    >
                        <template #reference>
                            <el-button type="text">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!--新增对话框-->
        <el-dialog v-model="dialogVisible" title="Tips" width="30%" :before-close="handleClose">
            <el-form
                ref="editFormRef"
                :model="editForm"
                :rules="editFormRules"
                label-width="120px"
            >
                <el-form-item label="上级菜单" prop="parentID">
                    <el-select v-model="editForm.parentID" placeholder="请选择上级菜单">
                        <template v-for="item in tableData1">
                            <el-option :label="item.name" :value="item.id"></el-option>
                            <template v-for="child in item.children">
                                <el-option :label="child.name" :value="child.id">
                                    <span>{{ "- " + child.name }}</span>
                                </el-option>
                            </template>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="权限编码" prop="perms" label-width="100px">
                    <el-input v-model="editForm.perms" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="icon" label-width="100px">
                    <el-input v-model="editForm.icon" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单URL" prop="path" label-width="100px">
                    <el-input v-model="editForm.path" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单组件" prop="component" label-width="100px">
                    <el-input v-model="editForm.component" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type" label-width="100px">
                    <el-radio-group v-model="editForm.type">
                        <el-radio :label="0">目录</el-radio>
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="状态" prop="status" label-width="100px">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum" label-width="100px">
                    <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
                </el-form-item>

                <el-button type="primary" @click="submitForm(editFormRef)">创建</el-button>
                <el-button @click="resetForm(editFormRef)">重置</el-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'
import axios from 'axios'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const delHandle = ((id) => {
    axios.post('/sys/menu/delete/' + id).then(res => {
        ElMessage({
            showClose: true,
            message: 'this is a success message.',
            type: 'success',
            onClose: () => {
                getMenuTree()
            }
        })
    })
})
const editHandle = (id: string) => {
    axios.get('/sys/menu/info/' + id).then(res => {
        dialogVisible.value = true
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// interface User {
//     id: number
//     date: string
//     name: string
//     status: number
//     type: number
//     hasChildren?: boolean
//     children?: User[]
// }

// let tableData1: User[] = [

// ]

let tableData1 = reactive([

])
let editFormRef = ref<FormInstance>()
//这里的submitForm集成了【新增】【编辑】俩种提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            //   console.log('submit!')
            axios.post('/sys/menu/' + (editForm.id === undefined ? 'update' : 'save'), editForm).then(res => {
                ElMessage({
                    showClose: true,
                    message: 'this is a success message.',
                    type: 'success',
                    onClose: () => {
                        getMenuTree()
                    }
                })
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
const getMenuTree = () => {
    axios.get('/sys/menu/list').then((res) => {
        // console.log(res.data.data)//这里已经能看到mock的数据了
        // tableData1 = res.data.data//(不能这样赋值)
        tableData1.length = 0;
        for (let i = 0; i < res.data.data.length; i++) {
            tableData1.push(res.data.data[i])
        }  
        // console.log(tableData1)//也没问题

    })
}
getMenuTree()


const dialogVisible = ref(false)
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

let editForm = reactive({

})

const editFormRules = reactive({
    parentId: [
        { required: true, message: '请选择上级菜单', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    perms: [
        { required: true, message: '请输入权限编码', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ],
    orderNum: [
        { required: true, message: '请填入排序号', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ]
})




</script>
<style scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>