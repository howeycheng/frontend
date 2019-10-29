<template>
    <div>
        <div>
            <headers activeIndex = '/requirement'></headers>
        </div>
        <div id="Requirement">
            <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
                <el-container>
                    <!--左侧侧边栏-->
                    <el-aside>
                        <div style="padding-left: 10px">
                            <i class="el-icon-edit" style="margin: 0;padding: 10px"></i>
                            <i class="el-icon-share" style="margin: 0;padding: 10px"></i>
                            <i class="el-icon-delete" style="margin: 0;padding: 10px"></i>
                        </div>
                        <div class="req-tree">
                            <el-tree
                                    :props="props"
                                    ref="tree"
                                    lazy
                                    :load="loadNode"
                                    node-key="rqid"
                                    :expand-on-click-node="false"
                                    @node-click="nodeClick">
                                <span class="tree-node" slot-scope="{ node, data }" :title="data.name">
                                    <span>{{ data.name }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </el-aside>
                    <!--主要区域容器-->
                    <el-main>
                        <div class="main_div">
                            <el-table
                                    :data="tableData"
                                    border="True"
                                    style="align-content: center;width:auto;font-size: 8px;margin:0;line-height: 8px"
                                    highlight-current-row
                                    fit="True"
                                    :header-cell-style="{
                                padding:0,
                                margin:0,
                                background:'white',
                                color:'#2b303b',
                            }"
                                    :row-style="{
                                padding:0,
                                margin:0,
                                height:'10px'
                                }">
                                <el-table-column
                                        prop=pk_id
                                        label="场景ID"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop=scene_name
                                        label="场景名称">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                                size="mini"
                                                @click="handleDetail(scope.row)">查看
                                        </el-button>
                                        <el-button
                                                size="mini"
                                                @click="handleEdit(scope.$index, scope.row)">编辑
                                        </el-button>
                                        <el-button
                                                size="mini"
                                                type="danger"
                                                @click="handleDelete(scope.$index, scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script>
    import headers from './header'

    export default {
        components: {
            headers
        },
        name: 'requirement',
        data() {
            return {
                tableData: []
            }
        },
        methods: {
            loadNode(node, resolve) {
                if (node.level === 0) {
                    var url = "http://127.0.0.1:8000/atf/req/";
                    // 发送请求:将数据返回到一个回到函数中
                    // 并且响应成功以后会执行then方法中的回调函数
                    this.$axios.get(url, {}).then(
                        response => {
                            return resolve(response.data)
                        }
                    )
                    // 这里resolve的数据是后台给的,id用于之后点击发起请求时的参数
                } else {
                    this.getTreeChild(node.data.rqid, resolve)
                }
            },
            getTreeChild(id, resolve) {
                var url = "http://127.0.0.1:8000/atf/req/";
                this.$axios.get(url, {
                    params: {
                        rqid: id
                    }
                }).then(
                    response => {
                        return resolve(response.data)
                    }
                )
            },
            nodeClick(data, node) {
                var url = "http://127.0.0.1:8000/atf/scene/";
                this.$axios.get(url, {
                    params: {
                        rqid: node.data.rqid
                    }
                }).then(
                    response => {
                        this.tableData = response.data;
                    }
                )
            },
            handleDetail(row) {
                //使用resolve方法解析路由，得到location、router、href等目标路由的信息。得到href使用window.open开新窗口。
                const {href} = this.$router.resolve({
                    path: './cases',
                    query: {
                        rqid: row['pk_id'],
                    }
                });
                window.open(href, '_blank');
            }
        }
    }
</script>

<style>
    body {
        margin: 0;
        padding: 0;
    }

    .el-header {
        background-color: #2b303b;
        color: #333;
        text-align: left;
        line-height: 20px;
        display: flex;
        align-items: center;
    }

    .el-aside {
        background-color: #E9EEF3;
        color: #333;
    }

    .el-main {
        background-color: white;
        color: #333;
        text-align: center;
        line-height: 160px;
        padding: 0px;
    }

    .el-tree-node__content{
        font-size: 14px;
        background: #E9EEF3;
        color: black;
    }
</style>
