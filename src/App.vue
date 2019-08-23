<template>
    <div id="app">
        <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
            <!--顶部栏-->
            <el-header style="height: 40px;padding: 0px">
                <div class=”header_logo”>
                    <p style="color: white;margin:0 10px">自动化测试平台</p>
                </div>
                <div>
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                             @select="handleSelect" style="height: 40px;line-height: 40px;">
                        <el-menu-item index="1" style="height: 40px;line-height: 40px;">测试需求</el-menu-item>
                        <el-menu-item index="2" style="height: 40px;line-height: 40px;">用例执行</el-menu-item>
                        <el-menu-item index="3" style="height: 40px;line-height: 40px;">日志管理</el-menu-item>
                    </el-menu>
                </div>
            </el-header>
            <el-container>
                <!--左侧侧边栏-->
                <el-aside style="width: 180px">
                    <div style="padding-left: 10px">
                        <i class="el-icon-edit" style="margin: 0;padding: 10px"></i>
                        <i class="el-icon-share" style="margin: 0;padding: 10px"></i>
                        <i class="el-icon-delete" style="margin: 0;padding: 10px"></i>
                    </div>
                    <div class="req-tree">
                        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </div>
                </el-aside>
                <!--主要区域容器-->
                <el-main>
                    主要区域容器
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'app',
        components: {},
        data() {
            return {
                }
            },
        methods: {
            getdata: function () {
                var url = "http://127.0.0.1:8000/atf/testapi/";
                // 发送请求:将数据返回到一个回到函数中
                var that = this;
                // 并且响应成功以后会执行then方法中的回调函数
                axios.get(url, {
                    params: {
                        rqid: 0
                    }
                }).then(response => (that.info = response.data));


            }
        }
    }
</script>

<style>
    body {
        margin: 0;
        padding: 0;
    }

    .el-header {
        background-color: #2b303b;
        color: #333;
        text-align: left;
        line-height: 20px;
        display: flex;
        align-items: center;
    }

    .el-aside {
        background-color: #E9EEF3;
        color: #333;
        /*text-align: center;*/
        /*line-height: 160px;*/
    }

    .el-main {
        background-color: white;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    .el-menu-item {
    }

</style>
