<template>
    <div>
        <headers activeIndex='/log'></headers>
        <div>
            <el-table
                size="mini"
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
            size="80%"
            :with-header="false">
            <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :page-sizes="[50, 100, 200, 300, 500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <el-table
                size="mini"
                v-loading="loadingSet"
                element-loading-text="加载用例中"
                :data="runData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                @row-dblclick="showCaseComp">
                <el-table-column
                    prop=case_clazz
                    label="用例名称">
                </el-table-column>
            </el-table>
            <el-drawer
                title="组件信息"
                :visible.sync="drawerOne"
                size="60%"
                :append-to-body="true"
                :with-header="false">
                <el-table :data="runDataOne"
                          size="mini"
                          @row-dblclick="showCaseCompDetail">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="值">
                                    <span>{{ props.row.value }}</span>
                                </el-form-item>
                                <el-form-item label="字段名称">
                                    <span>{{ props.row.description }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop=component_name
                        label="组件名称">
                    </el-table-column>
                </el-table>
            </el-drawer>
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
            runDataOne: [],
            drawerOne: false,
            loadingSet: false,
            pageSize: 50,
            currentPage: 1,
            runDataOneDetail: []
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
            this.drawer = true;
            // eslint-disable-next-line no-console
            console.log(row['run_id']);
            this.runData = [];
            this.loadingSet = true;
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
                    this.loadingSet = false;
                }
            )
        },
        showCaseComp(row) {
            this.drawerOne = true;
            let url = this.GLOBAL.httpUrl + "runLog/set/one";
            this.$axios.get(url, {
                params: {
                    run_id: row['run_id'],
                    case_id: row['case_id']
                }
            }).then(
                response => {
                    this.runDataOne = response.data;
                    for (let value of this.runDataOne) {
                        let valueList = value['value'].replace('\\[', '').replace('\\]', '').split('\0');
                        // eslint-disable-next-line no-console
                        console.log('valueList', valueList);
                        let descriptionList = value['description'].replace('\\[', '').replace('\\]', '').split('\0');
                        // eslint-disable-next-line no-console
                        console.log('descriptionList', descriptionList);
                    }
                }
            )


        },
        showCaseCompDetail() {

        },
        currentChange: function (currentPage) {
            this.currentPage = currentPage;
        },
        sizeChange(val) {
            this.pageSize = val
        }
    }
}
</script>

<style>
.el-drawer {
    overflow: auto;
    /* overflow-x: auto; */
}

.el-table {

}

.el-table th > .cell {

}

</style>