<template>
    <div>
        <headers activeIndex='/log'></headers>
        <div>
            <el-table
                :data="run"
                border
                style="align-content: center;width:auto;font-size: 0.6vw;margin:0;line-height: 0.6vw"
                highlight-current-row
                @row-dblclick="rowDblClick">
                <el-table-column
                    prop=run_name
                    label="执行名称">
                </el-table-column>
                <el-table-column
                    prop=start
                    label="开始时间">
                </el-table-column>
                <el-table-column
                    prop=finish
                    label="结束时间">
                </el-table-column>
            </el-table>
        </div>
        <el-drawer
            title="执行记录!"
            :visible.sync="drawer"
            size="50%"
            :with-header="false">
            <el-table :data="runData">
                <el-table-column
                    prop=case_clazz
                    label="用例名称">
                </el-table-column>
            </el-table>
        </el-drawer>
    </div>


</template>

<script>
import headers from './header'

export default {
    name: "Log",
    components: {
        headers,
    },
    data() {
        return {
            value1: false,
            run: [],
            drawer: false,
            runData: [],
        }
    },
    mounted: function () {
        this.getRun();
    },
    methods: {
        getRun() {
            let url = this.GLOBAL.httpUrl + "runLog/";
            this.$axios.get(url, {
                params: {}
            }).then(
                response => {
                    // eslint-disable-next-line no-console
                    console.log(response.data);
                    this.run = response.data;
                }
            )
        },
        rowDblClick(row) {
            // eslint-disable-next-line no-console
            console.log(row['run_id']);
            this.runData = [];
            this.drawer = true;
            let url = this.GLOBAL.httpUrl + "runLog/set/";
            this.$axios.get(url, {
                params: {
                    run_id: row['run_id']
                }
            }).then(
                response => {
                    // eslint-disable-next-line no-console
                    console.log(response.data);
                    this.runData = response.data;
                }
            )
        }
    }
}
</script>

<style>
.el-drawer {
    overflow: auto;
    /* overflow-x: auto; */
}
</style>