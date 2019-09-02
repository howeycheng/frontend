<template>
    <div>
        <div class="icon">
            自动化测试平台
        </div>
        <div class="login_form">
            <input type="text"  class="username"  placeholder="用户名" v-model="userName">
            <input type="text"  class="password"  placeholder="密码" v-model="password">
            <el-button class="login_btn" @click.native="login" type="primary" round :loading="isBtnLoading">登录</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                userName: '',
                password: '',
                isBtnLoading: false
            }
        },
        methods: {
            login() {
                // if (!this.userName) {
                //     this.$message.error('请输入用户名');
                //     return;
                // }
                // if (!this.password) {
                //     this.$message.error('请输入密码');
                //     return;
                // }
                // if (this.userName&&this.password) {
                    this.$router.push({path: '/home'})
                // }
            }
        }
    }
</script>
<style>
    .icon{
        text-align: center;
        margin-top: 200px;
    }
    .login_form{
        text-align: center;
        margin-top: 30px;
    }

</style>