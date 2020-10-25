<template>
    <div id="login">
        <div class="login_form">
            <img src="../assets/main.png" alt="" class="icon">
            <div class="text">
                自动化测试平台
            </div>
            <el-tabs type="border-card" class="login_tab">
                <el-tab-pane label="登录">
                    <div>
                        <el-input placeholder="请输入用户名" v-model="userName" clearable
                                  class="input_style"></el-input>
                        <span v-if="error.userName" class="err-msg">{{ error.userName }}</span>
                    </div>
                    <div>
                        <el-input placeholder="请输入密码" v-model="password" show-password
                                  class="input_style"></el-input>
                        <span v-if="error.password" class="err-msg">{{ error.password }}</span>
                    </div>
                    <div>
                        <el-button type="primary" @click="login" class="login_style">登录</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="注册">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0px"
                             class="ruleForm">
                        <el-form-item label="" prop="name">
                            <el-input type="text" v-model="ruleForm.name" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="pass">
                            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="checkPass">
                            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"
                                      placeholder="请确认密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="register('ruleForm')" class="login_style">提交</el-button>
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
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            userName: '',
            password: '',
            isBtnLoading: false,
            error: {
                userName: '',
                password: ''
            },
            ruleForm: {
                pass: '',
                checkPass: '',
                name: ''
            },
            rules: {
                pass: [
                    {validator: validatePass, trigger: 'blur'}
                ],
                checkPass: [
                    {validator: validatePass2, trigger: 'blur'}
                ],
                name: [
                    {validator: checkName, trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        login() {
            this.$router.push({path: '/home'})
        },
        register(formName) {
            // eslint-disable-next-line no-console
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // eslint-disable-next-line no-console
                    console.log(this.ruleForm.name);
                    // eslint-disable-next-line no-console
                    console.log(this.ruleForm.pass);
                    let url = this.GLOBAL.httpUrl + "register/";
                    let data = new FormData();
                    data.append('name',this.ruleForm.name);
                    data.append('password',this.ruleForm.pass);
                    this.$axios.post(url,data
                    ).then(
                        response => {
                            // eslint-disable-next-line no-console
                            console.log(response.data);
                        }
                    )
                    alert('submit!');
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
}

.login_form {
    text-align: center;
    margin-top: 500px;
    width: 100%;
    height: 280px;
}


.text {
    margin-top: 10px;
    font-size: 14px;
    color: #E9EEF3;
    margin-bottom: 10px;
}

.input_style {
    width: 180px;
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