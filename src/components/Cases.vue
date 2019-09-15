<template>
    <div>
        <headers></headers>
        <div id="detail">
            <el-tabs id="tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="组件配置" name="first">
                    <el-table
                            :data="scenesSets"
                            border="True"
                            style="align-content: center;width:auto;font-size: 8px;margin:0;line-height: 8px"
                            highlight-current-row
                            height="200px"
                            :header-cell-style="{
                                padding:0,
                                margin:0,
                                background:'white',
                                color:'#2b303b',
                                layout:'fixed'
                            }"
                            :cell-style="{
                                padding:0,
                                margin:0,
                                background:'white',
                                color:'#2b303b',
                                layout:'fixed'
                            }">
                        <el-table-column
                                prop=case_name
                                label="组件名称"
                        >
                        </el-table-column>
                    </el-table>
                    <div class="set_params">
                        <el-tabs v-model="activeName2" @tab-click="handleClick">
                            <el-tab-pane label="数值传递" name="first">
                                用户管理
                            </el-tab-pane>
                            <el-tab-pane label="数值校验" name="second">
                                配置管理
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="用例数据" name="second">
                    <el-table
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
                                prop="name"
                                label="用例名称"
                                width="500px"
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
    import axios from 'axios'
    import headers from './header'

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
                pictLoading: false
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
            //点击加载去除
            // handleClick(tab) {
            //     if (tab.label = '用例数据') {
            //         this.getSceneParams(this.id)
            //     }
            // },
            getScenesSet(id) {
                axios.get("http://127.0.0.1:8000/atf/sceneDetail/", {
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
                axios.get("http://127.0.0.1:8000/atf/cases/", {
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
                axios.get("http://127.0.0.1:8000/atf/sceneParams/", {
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
                axios.get("http://127.0.0.1:8000/atf/sceneCasesIo/", {
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
            }
        }

    }
</script>

<style>
    #detail {
        padding-left: 30px;
    }

    .block {
        text-align: right;
        margin-right: 10px;
    }
</style>