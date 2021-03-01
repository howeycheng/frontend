<template>
    <div id="login">
        <div class="login_form">
            <img src="../assets/main.png" alt="" class="icon">
            <div class="text">
                自动化测试平台
            </div>
            <el-tabs type="border-card" v-model="activeName" class="login_tab">
                <el-tab-pane label="登录" name="login">
                    <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginRuleForm"
                             label-width="0px">
                        <el-form-item label="" prop="name">
                            <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="pass">
                            <el-input type="password" v-model="loginForm.password" autocomplete="off"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="login('loginRuleForm')" class="login_style">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="注册" name="register">
                    <el-form :model="registerForm" status-icon :rules="registerRules" ref="registerRuleForm"
                             label-width="0px">
                        <el-form-item label="" prop="name">
                            <el-input type="text" v-model="registerForm.name" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="pass">
                            <el-input type="password" v-model="registerForm.pass" autocomplete="off"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="checkPass">
                            <el-input type="password" v-model="registerForm.checkPass" autocomplete="off"
                                      placeholder="请确认密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="register('registerRuleForm')" class="login_style">提交
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>

export default {
    data() {
        let checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('用户名不能为空'));
            } else {
                callback();
            }
        };
        let validateLoginPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.loginForm.checkPass !== '') {
                    this.$refs.loginRuleForm.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.registerForm.checkPass !== '') {
                    this.$refs.registerRuleForm.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePassConfirm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            activeName: 'login',
            // 登录表单
            loginForm: {
                username: '',
                password: ''
            },
            // 注册表单
            registerForm: {
                pass: '',
                checkPass: '',
                name: ''
            },
            // 登录表单验证规则
            loginRules: {
                password: [
                    {validator: validateLoginPass, trigger: 'blur'}
                ],
                username: [
                    {validator: checkName, trigger: 'blur'}
                ]
            },
            // 注册表单验证规则
            registerRules: {
                pass: [
                    {validator: validatePass, trigger: 'blur'}
                ],
                checkPass: [
                    {validator: validatePassConfirm, trigger: 'blur'}
                ],
                name: [
                    {validator: checkName, trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        // login() {
        //     this.$router.push({path: '/home'})
        // },
        register(formName) {
            // eslint-disable-next-line no-console
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let url = "manager/user/create";
                    let data = new FormData();
                    data.append('username', this.registerForm.name);
                    data.append('password', this.registerForm.pass);
                    this.$axios.post(url, data
                    ).then(
                        response => {
                            // eslint-disable-next-line no-console
                            console.log(response.data);
                            if (response.data['status']  === '400') {
                                this.$message('用户名已存在');
                            } else {
                                this.$message('注册成功');
                                this.activeName = "login";
                            }
                        }
                    )
                } else {
                    // eslint-disable-next-line no-console
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        login(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch("Login", this.loginForm).then(() => {
                        this.$router.push({path: '/',params:{'redirect':'manager'}}).catch(() => {
                        });
                    }).catch(() => {
                        // this.loading = false;
                    });

                } else {
                    // eslint-disable-next-line no-console
                    console.log('error submit!!');
                    return false;
                }
            });
        }

    }
}
</script>
<style>
#login {
    background-size: 100% 100%;
    /*background: url("../assets/bank.jpg");*/
    height: 100%;
    position: fixed;
    width: 100%;
    align-content: center;
    line-height: 100%;
}

.login_form {
    position: absolute;
    top: 30%;
    text-align: center;
    /*margin-top: 500px;*/
    width: 100%;
    height: 280px;
}


.text {
    margin-top: 10px;
    font-size: 14px;
    color: #E9EEF3;
    margin-bottom: 10px;
}

.login_style {
    width: 200px;
    margin-bottom: 10px;
}

.login_tab {
    width: 240px;
    margin: 0 auto;
}


</style>