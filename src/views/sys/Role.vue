<template>
    <div>
        <!--行内表单-->
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="searchForm.name" placehoder="名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getRoleList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>

            <el-form-item>
                <el-popconfirm title="确定批量删除吗?" @confirm="delHandle(null)">
                    <template #reference>
                        <el-button type="danger" :disabled="delBtlStatu">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </el-form-item>
        </el-form>

        <!---表格区--->
        <el-table
            ref="multipleTableRef"
            :data="tableData"
            style="width: 100%"
            border
            stripe
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column property="name" label="名称" width="120" />
            <el-table-column property="code" label="唯一编码" width="120" />
            <el-table-column property="remark" label="描述" show-overflow-tooltip />

            <el-table-column prop="status" label="状态" width="180">
                <template #default="scoped">
                    <el-tag size="small" v-if="scoped.row.status === 0">正常</el-tag>
                    <el-tag size="small" v-else-if="scoped.row.status === 1" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="do" label="操作" width="180">
                <template #default="scoped">
                    <el-button type="text" @click="editHandle(scoped.row.id)">分配权限</el-button>
                    <el-divider direction="vertical" />
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

        <!--分页区-->
        <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />

        <!--对话框-->
        <el-dialog v-model="dialogVisible" title="Tips" width="30%" :before-close="handleClose">
            <!--对话框里的表单-->
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="ruleForm.name" />
                </el-form-item>
                <el-form-item label="唯一编码" prop="code">
                    <el-input v-model="ruleForm.code" />
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input v-model="ruleForm.remark" />
                </el-form-item>

                <el-form-item label="状态" prop="statu">
                    <el-radio-group v-model="ruleForm.statu">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">Create</el-button>
                    <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { ElTable } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import axios from 'axios'
import { ElMessage } from 'element-plus'
//dialog对话框里的Form表单
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({

})
const rules = reactive({
    name: [
        { required: true, message: 'Please input name', trigger: 'blur' }
    ]
})
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            //   console.log('submit!')
            axios.post('/sys/role/' + (ruleForm.id === undefined ? 'update' : 'save'), ruleForm).then(res => {
                ElMessage({
                    showClose: true,
                    message: '提交成功',
                    type: 'success',
                    onClose: () => {
                        getRoleList()
                    }
                })
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
const getRoleList = () => {
    axios.get('/sys/role/list', {
        // params: {
        //     name: searchForm.name,
        //     currentPage: currentPage.value,
        //     pageSize: pageSize.value
        // }
    }).then((res) => {
        tableData.length = 0
        for (let i = 0; i < res.data.data.records.length; i++) {
            tableData.push(res.data.data.records[i])
            pageSize.value = res.data.data.size
            currentPage.value = res.data.data.current
            total.value = res.data.data.total
        }
    })
}
getRoleList()
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
//dialog对话框
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

//Table表格区
let multipleTableRef = ref<InstanceType<typeof ElTable>>()
let multipleSelection = ref([])
let handleSelectionChange = (val: never[]) => {
    // console.log(val)
    multipleSelection.value = val
    delBtlStatu.value = val.length === 0
}
let tableData = reactive([

])

const editHandle = (id: string) => {
    axios.get('/sys/role/info/' + id).then(res => {
        dialogVisible.value = true
    })
}
const delHandle = ((id: any) => {
    let ids = []

    if (id) {
        ids.push(id)
    } else {
        multipleSelection.value.forEach(row => {
            ids.push(row.id)
        })
    }
    // console.log(ids)
    axios.post('/sys/role/delete/', ids).then(res => {
        ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
            onClose: () => {
                getRoleList()
            }
        })
    })
})
//分页区
const currentPage = ref(1)
const pageSize = ref(10)
let total = ref(0)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}


//行内表单
let searchForm = reactive({

})
let delBtlStatu = ref(true)
let dialogVisible = ref(false)
</script>
<style scoped>
.el-pagination {
    float: right;
    margin-top: 22px;
}
</style>