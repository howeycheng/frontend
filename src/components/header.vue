<template>
    <div id="headers">
        <div class="title">
            <img class="title-img" src="../assets/title.png" alt="">
            <span class="title-text">自动化测试平台</span>
        </div>
        <div>
            <el-menu
                    :default-active="activeIndex"
                    class="el-menu"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="white"
                    text-color="black"
                    active-text-color="#00A4FF"
                    router>
                <el-menu-item index="/requirement">测试需求</el-menu-item>
                <el-menu-item index="/run">用例执行</el-menu-item>
                <el-menu-item index="/log">日志管理</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'headers',
        props:[
            'activeIndex'
        ],
        data() {
            return {
            };
        },
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

    .el-menu-item{
        font-size: 16px;
    }
</style>
