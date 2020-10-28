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
                            <el-button style="float: right; padding: 3px 0" type="text">新建项目</el-button>
                        </div>
                        <div v-for="o in projects" :key="o" class="text item">
                            <el-button style="float: left; padding: 3px 0" type="text">{{ '项目： ' + o }}</el-button>
                        </div>
                    </el-card>
                </div>
                <div>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>成员管理</span>
                            <el-button style="float: right; padding: 3px 0" type="text">新建项目</el-button>
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
            projects: ['融资融券2.0']
        }
    },
    methods: {
        logout() {
            let url = this.GLOBAL.httpUrl + "loginOut/";
            this.$axios.post(url, {}).then(
                response => {
                    // eslint-disable-next-line no-console
                    console.log(response.data);
                    if (response.data['status'] === '0') {
                        this.$message('已退出登录');
                        this.$router.push({path: '/'});
                    }
                }
            )
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