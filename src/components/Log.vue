<template>
    <div>
        <div>
            <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            <div style="text-align: right">
                <el-switch
                    v-model="flushEnable"
                    active-text="自动刷新">
                </el-switch>
            </div>
            <el-table
                size="mini"
                :data="run.filter(data => !search || data.run_name.includes(search))"
                border
                style="align-content: center;width:auto;font-size: 0.6vw;margin:0;line-height: 0.6vw"
                :cell-style="cellStyle"
                highlight-current-row
                :default-sort="{prop: 'start', order: 'descending'}"
                :row-class-name="tableRowClassName"
                @row-dblclick="rowDblClick">
                <el-table-column
                    prop=run_name
                    sortable
                    label="执行名称">
                </el-table-column>
                <el-table-column
                    prop=start
                    sortable
                    label="开始时间">
                </el-table-column>
                <el-table-column
                    prop=finish
                    sortable
                    label="结束时间">
                </el-table-column>
                <el-table-column
                    prop=finish_nums
                    sortable
                    label="已执行条数">
                </el-table-column>
                <el-table-column
                    prop=nums
                    sortable
                    label="总用例条数">
                </el-table-column>
                <el-table-column
                    fixed="right">
                    <template slot-scope="scope">
                        <div>
                            <el-button
                                size="mini"
                                @click="runAgain(scope.$index, scope.row)">失败用例重跑
                            </el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="runDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <Modal
                v-model="modal1"
                title="失败用例重跑"
                @on-ok="ok"
                @on-cancel="cancel"
                :draggable="true">
                <div style="padding: 10px;background: #f8f8f9">
                    <Card title="选择执行器" icon="ios-options" :padding="0" shadow style="width: 300px;">
                        <CellGroup>
                            <p>用例数量 ：{{ casesNum }}</p>
                            <label>
                                <Input v-model="runName" placeholder="执行名称"/>
                            </label>
                            <br>
                        </CellGroup>
                    </Card>
                </div>
            </Modal>
        </div>
        <el-drawer
            title="执行记录!"
            :visible.sync="drawer"
            size="80%"
            :with-header="false">
            <el-pagination
                id="pagination"
                @size-change="sizeChange"
                @current-change="currentChange"
                :page-sizes="[20, 50, 100, 200, 300, 500]"
                :page-size="pageSize"
                :total="setNums"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <el-table
                id="casesTable"
                size="mini"
                :cell-style="cellStyle"
                v-loading="loadingSet"
                element-loading-text="加载用例中"
                highlight-current-row
                :data="runData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :default-sort="{prop: 'case_clazz'}"
                :row-class-name="tableRowClassName"
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
                          id="compTable"
                          size="mini"
                          highlight-current-row
                          :cell-style="cellStyle"
                          @row-dblclick="showCaseCompDetail"
                          :row-class-name="tableRowClassName">
                    <el-table-column
                        prop=component_name
                        label="组件名称">
                    </el-table-column>
                </el-table>
                <el-tabs v-model="activeName" type="card" @tab-click="tabClick" id="outPutTabs">
                    <el-tab-pane label="执行结果" name="first">
                        <el-table
                            size="mini"
                            :data="resultValueDescriptionList">
                            <el-table-column
                                prop=description
                                label="栏位">
                            </el-table-column>
                            <el-table-column
                                prop=value
                                label="值">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="校验点" name="second">
                        <el-table
                            size="mini"
                            :data="checkValueDescriptionList">
                            <el-table-column
                                prop=description
                                label="栏位">
                            </el-table-column>
                            <el-table-column
                                prop=value
                                label="值">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="全部出参" name="third">
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
                    </el-tab-pane>
                </el-tabs>
            </el-drawer>
        </el-drawer>
    </div>


</template>

<script>

import {getLog} from "@/api/business/log";

export default {
    name: "Log",
    components: {},
    data() {
        return {
            flushEnable: true,
            run: [],
            drawer: false,
            runData: [],
            runDataOne: [],
            drawerOne: false,
            loadingSet: false,
            pageSize: 20,
            currentPage: 1,
            valueDescriptionList: [],
            resultValueDescriptionList: [],
            checkValueDescriptionList: [],
            search: "",
            setNums: 0,
            activeName: 'first',
            modal1: false,
            casesNum: 0,
            casesToRun: [],
            runName: "",
            setData: "",
            timer: '',
        }
    },
    mounted: function () {
        this.getRun();
    },
    watch: {
        flushEnable: {
            handler(flushEnable) {
                if (flushEnable) {
                    this.timer = setInterval(this.getRun, 5000);
                } else {
                    clearInterval(this.timer);
                }
            },
            immediate: true
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        getRun() {
            getLog().then(res => {
                this.run = res.data
            }).catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            })
        },
        rowDblClick(row) {
            this.valueDescriptionList = [];
            this.checkValueDescriptionList = [];
            this.resultValueDescriptionList = [];
            this.drawer = true;
            this.runData = [];
            this.loadingSet = true;
            let url = "unit/runLog/set/";
            this.$axios.get(url, {
                params: {
                    run_id: row['run_id']
                }
            }).then(
                response => {
                    if (Object.keys(response.data).length !== 0) {
                        this.runData = response.data;
                    }
                    this.loadingSet = false;
                    this.setNums = this.runData.length;
                }
            )
        },
        showCaseComp(row) {
            this.valueDescriptionList = [];
            this.checkValueDescriptionList = [];
            this.resultValueDescriptionList = [];
            this.drawerOne = true;
            let url = "unit/runLog/set/one";
            this.$axios.get(url, {
                params: {
                    run_id: row['run_id'],
                    case_id: row['case_id']
                }
            }).then(
                response => {
                    if (Object.keys(response.data).length !== 0) {
                        this.runDataOne = response.data;
                    }
                }
            )
        },
        showCaseCompDetail(row) {
            this.valueDescriptionList = [];
            this.checkValueDescriptionList = [];
            this.resultValueDescriptionList = [];
            let valueList = row['value'].split('\0');
            let descriptionList = row['description'].split('\0');
            for (let i = 0; i < descriptionList.length; i++) {
                let valueDescriptionMapOne = {
                    "description": descriptionList[i],
                    "value": valueList[i],
                    "runner_result": row['runner_result']
                };
                this.valueDescriptionList.push(valueDescriptionMapOne)
                if (valueDescriptionMapOne['description'].indexOf("result") !== -1) {
                    this.resultValueDescriptionList.push(valueDescriptionMapOne);
                }
                if (valueDescriptionMapOne['description'].indexOf("check") !== -1) {
                    this.checkValueDescriptionList.push(valueDescriptionMapOne);
                }
            }
        },
        currentChange: function (currentPage) {
            this.currentPage = currentPage;
        },
        sizeChange(val) {
            this.pageSize = val
        },
        tableRowClassName({row}) {
            if (row['runner_result'] === 1) {
                return 'warning-row';
            }
            return '';
        },
        runDelete(index, row) {
            this.$confirm('此操作将永久删除该执行记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = {id: row['run_id']}
                this.$axios.delete("unit/run/id", {data: param}).then(response => {
                    if (response.status === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!,共删除相关用例' + response.data['runSetDel'] + '条'
                        });
                        this.getRun();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        cellStyle() {
            return "font-weight:700"
        },
        tabClick() {

        },
        headerRowStyle() {

        },
        runAgain(index, row) {
            this.setData = row['set_id'];
            this.$axios.get("unit/runLog/set/error", {
                params: {
                    run_id: row['run_id']
                }
            }).then(response => {
                this.casesNum = response.data.length;
                if (this.casesNum !== 0) {
                    this.casesToRun = response.data;
                    this.modal1 = true;
                }else {
                    this.$message({
                        type: 'info',
                        message: '当前执行日志没有执行失败用例!'
                    });
                }
            })
        },
        ok() {
            let url = "unit/run/";
            let data = new FormData();
            data.append("setNames", this.casesToRun.toString());
            data.append("runName", this.runName);
            data.append("setId", this.setData);
            this.$axios.post(url, data
            ).then(
                response => {
                    if (response.data.indexOf("exceptions") !== -1 || response.data.indexOf("error") !== -1) {
                        this.$message({
                            message: response.data,
                            type: 'warning'
                        });
                    }
                }
            ).catch(function (rejectedResult) {
                // eslint-disable-next-line no-console
                console.log(rejectedResult);
            })
        },
        cancel() {
            this.$Message.info('Clicked cancel');
        },
    }
}
</script>

<style>
.el-table .warning-row {
    /*background: rgba(178,58,55,0.64);*/
    color: red;
}

.el-table .success-row {
    background: #f0f9eb;
}

.el-drawer {
    overflow: auto;
    /* overflow-x: auto; */
}

.el-table {

}

.el-table th > .cell {

}

.el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row > td {
    /*color: #fff;*/
    background-color: rgba(34, 73, 145, 0.51) !important;
}

#outPutTabs {
    margin: 10px;
}

#compTable {
    margin: 10px;
}

#casesTable {
    margin: 10px;
}

#pagination {
    margin: 10px;
}
</style>