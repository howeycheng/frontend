<template>
    <div id="headers">
        <div class="title">
            <img class="title-img" src="../assets/title.png" alt="">
            <span class="title-text">自动化测试平台</span>
            <el-dropdown style="float: right">
                <Icon type="ios-contact-outline" size="35" color="white" style=""/>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="logout">
                        注销
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="switchProject">
                        切换项目
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div>
            <el-menu
                :default-active="activeIndex"
                class="el-menu"
                mode="horizontal"
                background-color="white"
                text-color="black"
                active-text-color="#00A4FF"
                router>
                <el-menu-item index="/requirement">测试需求</el-menu-item>
                <el-menu-item index="/run">用例执行</el-menu-item>
                <el-menu-item index="/job">任务管理</el-menu-item>
                <el-menu-item index="/log">日志查询</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
export default {
    name: 'headers',
    props: [
        'activeIndex'
    ],
    data() {
        return {};
    },
    methods:{
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
        switchProject(){
            this.$router.push({path: '/manage'});
        }
    }
}
</script>

<style>
.title {
    height: 35px;
    width: 100%;
    background-color: #2b303b;
    padding-left: 20px;


}

.title .title-img {
    height: 35px;
    vertical-align: middle;
    display: inline-block;
}

.title .title-text {
    font-size: 18px;
    color: white;
    line-height: 35px;
    display: inline-block;
    vertical-align: middle;
    padding-left: 6px;
}

.el-menu {
    padding-left: 120px;
}

.el-menu-item {
    font-size: 16px;
}
</style>
