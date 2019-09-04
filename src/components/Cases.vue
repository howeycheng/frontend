<template>
    <div>
        <headers></headers>
        <div id="detail">
            <el-tabs id="tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="组件配置" name="first">
                    <el-table
                            :data="scenesSet"
                            border="True"
                            style="align-content: center"
                            highlight-current-row>
                        <el-table-column
                                prop=case_name
                                label="组件">
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
                    <div class="block">
                        <div class="block">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage4"
                                    :page-sizes="[100, 200, 300, 400]"
                                    :page-size="100"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="400">
                            </el-pagination>
                        </div>
                    </div>
                    <el-table
                            :data="scenesCases"
                            border="True"
                            style="align-content: center"
                            highlight-current-row>
                        <el-table-column
                                prop=name
                                label="用例名称">
                        </el-table-column>
                    </el-table>
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
                id: this.$route.query.rqid,
                scenesSet: [],
                scenesCases: [],
                activeName: 'first',
                activeName2: 'first'

            }
        },
        mounted: function () {
            this.getScenesSet(this.id);
            this.getScenesCases(this.id);
        },
        methods: {
            getScenesSet(id) {
                axios.get("http://127.0.0.1:8000/atf/sceneDetail/", {
                    params: {
                        rqid: id
                    }
                }).then(
                    response => {
                        this.scenesSet = response.data
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
                        this.scenesCases = response.data
                    }
                )
            },
        }

    }
</script>

<style scoped>
    #detail {
        padding-left: 30px;
    }

</style>