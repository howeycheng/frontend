<template>
    <div>
        <div id="Requirement">
            <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
                <el-container>
                    <!--左侧侧边栏-->
                    <el-aside id="requirement-left">
                        <div>
                            <el-button icon="el-icon-circle-plus-outline" size="mini" style="margin-left: 5px;margin-top: 5px"></el-button>
                            <el-button icon="el-icon-edit" size="mini" style="margin-left: 5px;margin-top: 5px"></el-button>
                            <el-button icon="el-icon-delete" size="mini" style="margin-left: 5px;margin-top: 5px"></el-button>
                        </div>
                        <el-divider></el-divider>
                        <div id="req-tree">
                            <el-tree
                                :highlight-current=true
                                ref="tree"
                                lazy
                                :props="props"
                                :load="loadNode"
                                node-key="id"
                                :expand-on-click-node="true"
                                @node-click="nodeClick"
                                :icon-class="reqTreeIconClass"
                            >
                                <!--                                <span class="tree-node" slot-scope="{ node, data }" :title="data.name">-->
                                <!--                                    <span>{{ data.name }}</span>-->
                                <!--                                </span>-->
                            </el-tree>
                        </div>
                    </el-aside>
                    <!--主要区域容器-->
                    <el-main id="requirement-main">
                        <div class="main_div">
                            <el-table
                                :highlight-current=true
                                :data="tableData"
                                border
                                style="align-content: center;width:auto;font-size: 0.6vw;margin:0;line-height: 0.6vw"
                                highlight-current-row
                                fit
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
                                    prop=id
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
                                            @click="handleDetail(scope.row)">编辑
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

export default {
    components: {},
    name: 'requirement',
    data() {
        return {
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            reqTreeIconClass: 'el-icon-folder',
            tableData: []
        }
    },
    methods: {
        loadNode(node, resolve) {
            if (node.level === 0) {
                let url = "unit/req/";
                this.$axios.get(url, {}).then(
                    response => {
                        if (Object.keys(response.data).length === 0) {
                            node.isLeaf = true;
                        }
                        return resolve(response.data);
                    }
                )
                // 这里resolve的数据是后台给的,id用于之后点击发起请求时的参数
            } else {
                this.getTreeChild(node, node.data.id, resolve);
            }
        },
        getTreeChild(node, id, resolve) {
            let url = "unit/req/";
            this.$axios.get(url, {
                params: {
                    rqid: id
                }
            }).then(
                response => {
                    if (Object.keys(response.data).length === 0) {
                        node.isLeaf = true;
                    }
                    return resolve(response.data);
                }
            )
        },
        nodeClick(data, node) {
            let url = "unit/scene/";
            this.$axios.get(url, {
                params: {
                    rqid: node.data.id
                }
            }).then(
                response => {
                    if (Object.keys(response.data).length !== 0) {
                        this.tableData = response.data;
                    }
                }
            )
        },
        handleDetail(row) {
            //使用resolve方法解析路由，得到location、router、href等目标路由的信息。得到href使用window.open开新窗口。
            const {href} = this.$router.resolve({
                path: './casesEditor',
                query: {
                    rqid: row['id'],
                }
            });
            window.open(href, '_blank');
        },
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

#requirement-main {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 160px;
    padding: 0px;
}

.el-tree-node__content {
    font-size: 0.6vw;
    background: #E9EEF3;
    /*background-color: darkcyan;*/
    color: black;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: white;
}
.el-tree-node__expand-icon {
    color: black;
}
.el-divider--horizontal {
    margin-top: 8px;
    margin-bottom: 8px;
}

</style>
