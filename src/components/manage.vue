<template>
    <el-container style="height: 100%">
        <el-header>
            <div class="title">
                <img class="title-img" src="../assets/title.png" alt="">
                <span class="title-text">自动化测试平台</span>
                <el-dropdown style="float: right" @command="logout">
                    <Icon type="ios-contact-outline" size="35" color="white" style=""/>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            注销
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-container>
            <el-aside width="36%">
            </el-aside>
            <el-main>
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
                            <el-button style="float: right; padding: 3px 0;margin-right: 20px ;color: red" type="text"
                                       @click.native="deleteProject(project.project_id)">删除
                            </el-button>
                            <el-button style="float: right; padding: 3px 0;margin-right: 20px ;color: red" type="text"
                                       @click="editProject(project.project_id)">编辑
                            </el-button>
                            <br>
                        </div>
                    </el-card>
                </div>
                <div>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>成员管理</span>
                            <el-button style="float: right; padding: 3px 0" type="text">添加成员</el-button>
                        </div>
                        <div v-for="o in 4" :key="o" class="text item">
                            {{ '列表内容 ' + o }}
                        </div>
                    </el-card>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>


export default {
    name: "manage",
    data() {
        return {
            projects: ['融资融券2.0'],
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
        logout() {
            let url = "manager/user/loginout";
            this.$axios.post(url, {}).then(
                response => {
                    // eslint-disable-next-line no-console
                    console.log(response.data);
                    if (response.data['status'] === '200') {
                        this.$message('已退出登录');
                        this.$router.push({path: '/'});
                    }
                }
            )
        },
        newProject() {
            let data = new FormData();
            data.append("name", this.projectInfo.name);
            data.append("description", this.projectInfo.description);
            this.$axios.post("manager/project/user", data).then(response => {
                // eslint-disable-next-line no-console
                console.log(response.data);
                this.dialogVisible = false;
                if (response.data['status'] === '201') {
                    this.$message('创建项目成功');
                    this.getProject();
                } else if (response.data['status'] === '400') {
                    this.$message('项目名称重复');
                }
            })
        },
        getProject() {
            this.$axios.get("manager/project/user", {}).then(response => {
                // eslint-disable-next-line no-console
                console.log(response.data);
                this.projectList = response.data;
            })
        },
        deleteProject(project_id) {
            // eslint-disable-next-line no-console
            console.log(project_id);
            this.$confirm('此操作将永久删除该执行记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = {project_id: project_id}
                this.$axios.delete("manager/project/user/one", {data: param}).then(response => {
                    // eslint-disable-next-line no-console
                    console.log(response.data['status'])
                    if (response.data['status'] === '204') {
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
        jumpToProject(project_id,name) {
            // eslint-disable-next-line no-console
            let data = new FormData();
            data.append("project_id", project_id);
            this.$axios.post("manager/project/user/current", data).then(response => {
                // eslint-disable-next-line no-console
                if (response.data['status'] === '201') {
                    this.$message('当前项目 ' + name);
                    this.$router.push({path: '/home'})
                }
            })
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

.box-card {
    margin-top: 20px;
    margin-left: 20px;
    width: auto;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

</style>