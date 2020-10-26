<template>
    <div id="login">
        <div class="login_form">
            <img src="../assets/main.png" alt="" class="icon">
            <div class="text">
                自动化测试平台
            </div>
            <el-tabs type="border-card" v-model="activeName" class="login_tab">
                <el-tab-pane label="登录" name="login">
                    <el-form :model="loginRuleForm" status-icon :rules="loginRules" ref="loginRuleForm"
                             label-width="0px">
                        <el-form-item label="" prop="name">
                            <el-input type="text" v-model="loginRuleForm.name" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="pass">
                            <el-input type="password" v-model="loginRuleForm.pass" autocomplete="off"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="login('loginRuleForm')" class="login_style">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="注册" name="register">
                    <el-form :model="registerRuleForm" status-icon :rules="registerRules" ref="registerRuleForm"
                             label-width="0px">
                        <el-form-item label="" prop="name">
                            <el-input type="text" v-model="registerRuleForm.name" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="pass">
                            <el-input type="password" v-model="registerRuleForm.pass" autocomplete="off"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="checkPass">
                            <el-input type="password" v-model="registerRuleForm.checkPass" autocomplete="off"
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
                if (this.loginRuleForm.checkPass !== '') {
                    this.$refs.loginRuleForm.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.registerRuleForm.checkPass !== '') {
                    this.$refs.registerRuleForm.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePassConfirm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerRuleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            activeName: 'login',
            userName: '',
            password: '',
            // 登录表单
            loginRuleForm: {
                userName: '',
                password: ''
            },
            // 注册表单
            registerRuleForm: {
                pass: '',
                checkPass: '',
                name: ''
            },
            // 登录表单验证规则
            loginRules: {
                pass: [
                    {validator: validateLoginPass, trigger: 'blur'}
                ],
                name: [
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
                    let url = this.GLOBAL.httpUrl + "register/";
                    let data = new FormData();
                    data.append('name', this.registerRuleForm.name);
                    data.append('password', this.registerRuleForm.pass);
                    this.$axios.post(url, data
                    ).then(
                        response => {
                            // eslint-disable-next-line no-console
                            console.log(response.data);
                            if (response.data === '用户名已存在') {
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
                    let url = this.GLOBAL.httpUrl + "login/";
                    let data = new FormData();
                    data.append('name', this.loginRuleForm.name);
                    data.append('password', this.loginRuleForm.pass);
                    this.$axios.post(url, data
                    ).then(
                        response => {
                            // eslint-disable-next-line no-console
                            console.log(response.data);
                            if (response.data === '登录成功') {
                                this.$message('登录成功');
                                this.$router.push({path: '/home'})
                            } else if (response.data === '用户名不存在'){
                                this.$message('用户不存在');
                            }else {
                                this.$message('验证失败');
                            }
                        }
                    )
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
    background: url("../assets/bank.jpg");
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