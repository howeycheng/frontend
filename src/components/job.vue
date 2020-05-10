<template>
    <div>
        <headers activeIndex='/job'></headers>
        <el-card class="box-card">
            <!--            <div slot="header" class="clearfix">-->
            <!--                <span>卡片名称</span>-->
            <!--                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            <!--            </div>-->
            <div>
                <el-progress type="circle" :percentage="percentage"></el-progress>
                <el-progress type="circle" :percentage="25"></el-progress>
                <el-progress type="circle" :percentage="80" color="#8e71c7"></el-progress>
                <el-progress type="circle" :percentage="100" status="success"></el-progress>
                <el-progress type="circle" :percentage="50" status="exception"></el-progress>
            </div>
        </el-card>
    </div>
</template>

<script>
    import headers from './header'

    export default {
        name: "job",
        components: {
            headers,
        },
        data() {
            return {
                percentage: this.GLOBAL.jobPercentage[0],

            }


        }
    }
</script>

<style scoped>

</style>