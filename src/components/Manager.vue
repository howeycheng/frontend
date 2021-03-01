<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>项目管理</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="dialogVisible = true">
                    新建项目
                </el-button>
            </div>
            <el-dialog title="新建项目" :visible.sync="dialogVisible" width="30%">
                <el-form :inline="true" :model="projectInfo" class="demo-form-inline">
                    <el-form-item label="项目名称">
                        <el-input v-model="projectInfo.name" placeholder="项目名称"></el-input>
                    </el-form-item>
                    <el-form-item label="项目描述">
                        <el-input v-model="projectInfo.description" placeholder="项目描述"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="newProject">新建</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <div v-for="project in projectList" class="text item" v-bind:key="project.name">
                <el-button style="float: left; padding: 3px 0" type="text"
                           @click="jumpToProject(project.project_id,project.name)">{{
                        project.name
                    }}
                </el-button>
                <el-button style="float: right; padding: 3px 0;margin-right: 20px ;color: #ff0000" type="text"
                           @click.native="delProject(project.project_id)">删除
                </el-button>
                <el-button style="float: right; padding: 3px 0;margin-right: 20px ;color: red" type="text"
                           @click="editProject(project.project_id)">编辑
                </el-button>
                <br>
            </div>
        </el-card>
    </div>
</template>

<script>


import {addProject, delProject, getProjectList} from "@/api/system/project";

export default {
    name: "manage",
    data() {
        return {
            dialogVisible: false,
            projectInfo: {
                name: '',
                description: ''
            },
            projectList: []
        }
    },
    mounted() {
        this.getProject();
    },
    methods: {
        newProject() {
            addProject(this.projectInfo).then(
                res => {
                    if (res.data['status'] === '201') {
                        this.$message('创建项目成功');
                        this.getProject();
                    } else if (res.data['status'] === '400') {
                        this.$message('项目名称重复');
                    }
                    this.dialogVisible = false
                }
            ).catch()
        },
        getProject() {
            getProjectList().then(res => {
                this.projectList = res.data;
            })
        },
        delProject(project_id) {
            this.$confirm('此操作将永久删除该执行记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delProject(project_id).then(res => {
                    if (res.data['status'] === '204') {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getProject();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        editProject(project_id) {
            // eslint-disable-next-line no-console
            console.log(project_id);
        },
        jumpToProject(project_id, name) {
            this.$store.dispatch("SelectProject", project_id).then(() => {
                this.$message('当前项目 ' + name);
                this.$router.push("/project")
            }).catch(() => {
            });
        }
    }
}
</script>

<style scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

</style>