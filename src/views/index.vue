<template>
    <el-container style="height: 100%">
        <el-header>
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
        </el-header>
        <el-container>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: "index.vue",
    data() {
        return {
        }
    },
    methods:{
        logout() {
            this.$store.dispatch("LogOut").then(() => {
                location.href = '/index';
            }).catch(() => {

            });
        },
        switchProject(){
            this.$router.push({path: '/manager'});
        }
    }
}
</script>

<style scoped>
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
</style>