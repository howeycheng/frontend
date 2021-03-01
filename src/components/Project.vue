<template>
    <div>
        <el-menu
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
        <router-view></router-view>
    </div>

</template>

<script>
export default {
    name: "project",
    methods:{
    }
}
</script>

<style scoped>

</style>