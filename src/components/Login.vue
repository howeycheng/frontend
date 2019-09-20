<template>
    <div>
        <div class="login_form">
            <img src="../assets/title.png" alt="" class="icon">
            <div class="text">
                自动化测试平台
            </div>
            <div class="login_text">
                <input type="text" class="username" placeholder="用户名" v-model="userName">
                <input type="text" class="password" placeholder="密码" v-model="password">
                <el-button class="login_btn" @click.native="login" type="primary" round :loading="isBtnLoading">登录
                </el-button>

            </div>
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
<style slot-scope="">
    .login_form {
        text-align: center;
        margin-top: 180px;
    }

    .text {
        margin-top: 10px;
        font-size: 30px;
    }

    .login_text{
        margin-top: 10px;
    }

</style>