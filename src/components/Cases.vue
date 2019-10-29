<template>
    <div>
        <headers activeIndex = '/requirement'></headers>
        <div id="detail">
            <el-tabs id="tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="组件配置" name="first">
                    <div style="padding-left: 10px">
                        <i class="el-icon-remove-outline" style="margin: 0;padding: 10px"></i>
                        <i class="el-icon-circle-plus-outline" style="margin: 0;padding: 10px"></i>
                        <i class="el-icon-delete" style="margin: 0;padding: 10px"></i>
                    </div>
                    <el-table
                            :data="scenesSets"
                            border="True"
                            style="align-content: center;width:auto;font-size: 8px;margin:0;line-height: 8px"
                            highlight-current-row
                            height="500px"
                            :header-cell-style="{
                            }"
                            :cell-style="{
                            }">
                        <el-table-column
                                prop=case_name
                                label="组件名称"
                        >
                        </el-table-column>
                    </el-table>
                    <div class="set_params">
                        <el-tabs v-model="activeName2" @tab-click="handleClick2">
                            <div style="padding-left: 10px">
                                <i class="el-icon-remove-outline" style="margin: 0;padding: 10px"></i>
                                <i class="el-icon-circle-plus-outline" style="margin: 0;padding: 10px"></i>
                                <i class="el-icon-delete" style="margin: 0;padding: 10px"></i>
                            </div>
                            <el-tab-pane label="数值传递" name="first">
                                <el-table
                                        :data="setIo"
                                        border="True"
                                        style="align-content: center;width:auto;font-size: 8px;margin:0;line-height: 8px"
                                        highlight-current-row
                                        height="500px"
                                        :header-cell-style="{}"
                                        :cell-style="{}">
                                    <el-table-column
                                            prop="name"
                                            label="源数据"
                                            :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column
                                            prop="assign"
                                            label="目标栏位"
                                            :show-overflow-tooltip="true">
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="数值校验" name="second">
                                配置管理
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="用例数据" name="second">
                    <div style="padding-left: 10px">
                        <i class="el-icon-remove-outline" style="margin: 0;padding: 10px"></i>
                        <i class="el-icon-circle-plus-outline" style="margin: 0;padding: 10px"></i>
                        <i class="el-icon-delete" style="margin: 0;padding: 10px"></i>
                        <i class="el-icon-download" style="margin: 0;padding: 10px" @click="exportExcel"></i>
                    </div>
                    <el-table
                            id="casesTableExcel"
                            v-loading="pictLoading"
                            :data="scenesCasesIo"
                            border="True"
                            style="align-content: center;width:auto;font-size: 8px;margin:0;line-height: 8px"
                            fit="True"
                            height="500px"
                            :header-cell-style="{
                                padding:0,
                                margin:0,
                                background:'white',
                                color:'#2b303b',
                            }"
                            :header-row-style="{
                            }">
                        <!--组件-->
                        <el-table-column
                                fixed
                                prop="name"
                                label="用例名称"
                                width="300px"
                                :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column v-for="(scenesSet,index) in scenesSets"
                                         :label="scenesSet.case_name"
                                         v-bind:key="scenesSet"
                                         align="center"
                                         :show-overflow-tooltip="true">
                            <!--组件栏位-->
                            <el-table-column v-for="scenesParam in scenesParams[index][scenesSet.case_name]"
                                             :label="scenesParam.target_field"
                                             :prop="`sequence_${index+1}_${scenesParam.target_field}`"
                                             v-bind:key="scenesParam"
                                             resizable="True"
                                             width="100px"
                                             :show-overflow-tooltip="true">
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <div class="block">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[5, 10, 20, 30, 50, 100]"
                                    :page-size="pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="total">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import headers from './header'
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

    export default {
        name: "Cases",
        components: {
            headers
        },
        data() {
            return {
                //获取路由传递过来的场景ID
                id: this.$route.query.rqid,
                scenesSets: [],
                scenesCases: [],
                scenesCasesIo: [],
                scenesParams: [],
                activeName: 'first',
                activeName2: 'first',
                pageSize: 5,
                currentPage: 1,
                pictLoading: false,
                setIo: []
            }
        },
        mounted: function () {
            this.getScenesSet(this.id);
            this.getSceneParams(this.id)//自动加载组件值
            this.getScenesCases(this.id);
            this.tableRowClassName();
            this.getSceneCasesIo(this.id, this.currentPage, this.pageSize)
        },
        methods: {
            handleClick2(tab) {
                if (tab.label === '数值传递') {
                    this.getSetIo(this.id, '3')
                }
            },
            getScenesSet(id) {
                this.$axios.get("http://127.0.0.1:8000/atf/sceneDetail/", {
                    params: {
                        rqid: id
                    }
                }).then(
                    response => {
                        this.scenesSets = response.data
                    }
                )
            },
            getScenesCases(id) {
                this.$axios.get("http://127.0.0.1:8000/atf/cases/", {
                    params: {
                        rqid: id
                    }
                }).then(
                    response => {
                        this.scenesCases = response.data;
                        this.total = this.scenesCases.length;
                    }
                )
            },
            getSceneParams(rqid) {
                //获取场景组件栏位
                this.$axios.get("http://127.0.0.1:8000/atf/sceneParams/", {
                    params: {
                        rqid: rqid
                    }
                }).then(
                    response => {
                        this.scenesParams = response.data;
                    }
                )
            },
            handleSizeChange(pageSize) {
                //    修改每页条数
                this.pageSize = pageSize;
                this.getSceneCasesIo(this.id, this.currentPage, this.pageSize);
            },
            handleCurrentChange(currentPage) {
                //    修改当前业数
                this.currentPage = currentPage;
                this.getSceneCasesIo(this.id, this.currentPage, this.pageSize);
            },
            tableRowClassName() {
                return 'success-row';
            },
            getSceneCasesIo(rqid, currentPage, pageSize) {
                this.pictLoading = true;
                //:data="scenesCases.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                this.$axios.get("http://127.0.0.1:8000/atf/sceneCasesIo/", {
                    params: {
                        rqid: rqid,
                        currentPage: currentPage,
                        pageSize: pageSize,
                    }
                }).then(
                    response => {
                        this.scenesCasesIo = response.data;
                        this.pictLoading = false;
                    }
                )
            },
            getSetIo(rqid, type) {
                this.$axios.get("http://127.0.0.1:8000/atf/sceneSetIo/", {
                    params: {
                        rqid: rqid,
                        type: type
                    }
                }).then(
                    response => {
                        this.setIo = response.data;
                    }
                )
            },
            exportExcel () {
                /* generate workbook object from table */
                var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
                var wb = XLSX.utils.table_to_book(document.querySelector('#casesTableExcel'), xlsxParam)

                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '审核情况表.xlsx')
                } catch (e) {
                    if (typeof console !== 'undefined') {
                        // console.log(e, wbout)
                    }
                }
                return wbout
            }
        }
    }
</script>

<style>
    #detail {
        padding-left: 20px;
        padding-right: 20px;
    }

    .block {
        text-align: right;
        margin-right: 10px;
    }
</style>