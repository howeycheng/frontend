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
                :page-sizes="[20, 50, 100, 200, 300, 500]"
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
                          @row-dblclick="showCaseCompDetail"
                          @expand-change="showCaseCompDetail">
                    <el-table-column type="expand">
                        <template slot-scope="">
                            <el-table
                                size="mini"
                                :data="valueDescriptionList">
                                <el-table-column
                                    prop=description
                                    label="栏位">
                                </el-table-column>
                                <el-table-column
                                    prop=value
                                    label="值">
                                </el-table-column>
                            </el-table>
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
            pageSize: 20,
            currentPage: 1,
            runDataOneDetail: [],
            compData: [],
            valueDescriptionList: [],
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
                }
            )


        },
        showCaseCompDetail(row) {
            this.valueDescriptionList = [];
            let valueList = row['value'].split('\0');
            let descriptionList = row['description'].split('\0');
            for (let i = 0; i < descriptionList.length; i++) {
                let valueDescriptionMapOne = {"description":descriptionList[i],"value":valueList[i]};
                this.valueDescriptionList.push(valueDescriptionMapOne)
            }
            // eslint-disable-next-line no-console
            console.log(this.valueDescriptionList)
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