<template>
    <div>
        <div id="Requirement">
            <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
                <el-container>
                    <!--左侧侧边栏-->
                    <el-aside id="requirement-left">
                        <div>
                            <el-tooltip class="item" effect="dark" content="新建需求" placement="top-start"
                                        style="color:black;">
                                <el-button icon="el-icon-folder-add" @click="newRequirement" size="mini"
                                           style="margin-left: 5px;margin-top: 5px"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="新增场景" placement="top-start"
                                        style="color:black;">
                                <el-button icon="el-icon-document-add" @click="newScene" size="mini"
                                           style="margin-left: 5px;margin-top: 5px"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="修改" placement="top-start"
                                        style="color:black;">
                                <el-button icon="el-icon-edit" size="mini" @click="editRequirement"
                                           style="margin-left: 5px;margin-top: 5px"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start"
                                        style="color:black;">
                                <el-button icon="el-icon-delete" size="mini" @click="deleteRequirement"
                                           style="margin-left: 5px;margin-top: 5px"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="刷新" placement="top-start"
                                        style="color:black;">
                                <el-button icon="el-icon-refresh" size="mini" @click="clearRequirement"
                                           style="margin-left: 5px;margin-top: 5px"></el-button>
                            </el-tooltip>
                        </div>
                        <el-divider></el-divider>
                        <div id="req-tree">
                            <el-tree
                                :highlight-current=true
                                ref="reqTree"
                                lazy
                                :props="props"
                                :load="loadNode"
                                node-key="id"
                                :expand-on-click-node="true"
                                @node-click="reqTreeNodeClick"
                            >
                            <span slot-scope="{ node, data }">
                                <i :class="data.icon"></i>
                                <span style="padding-left: 4px;font-size:14px;">{{ node.label }}</span>
                            </span>
                            </el-tree>
                        </div>
                        <Modal
                            v-model="reqModal"
                            title="新建需求"
                            @on-ok="newRequirementCommit"
                            @on-cancel="cancel"
                            :draggable="true">
                            <div style="padding: 10px;background: #f8f8f9">
                                <Card title="" icon="ios-options" :padding="0">
                                    <CellGroup>
                                        <label>
                                            <Input v-model="reqName" placeholder="需求名称"/>
                                        </label>
                                    </CellGroup>
                                </Card>
                            </div>
                        </Modal>
                        <Modal
                            v-model="sceneModal"
                            title="新建场景"
                            @on-ok="newSceneCommit"
                            @on-cancel="cancel"
                            :draggable="true">
                            <div style="padding: 10px;background: #f8f8f9">
                                <Card title="" icon="ios-options" :padding="0">
                                    <CellGroup>
                                        <label>
                                            <Input v-model="sceneName" placeholder="场景名称"/>
                                        </label>
                                    </CellGroup>
                                </Card>
                            </div>
                        </Modal>
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
                                            @click="casesEditor(scope.row)">编辑
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            @click="delScene(scope.$index, scope.row)">删除
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

import {addRequirements, delRequirements, getRequirements} from "@/api/business/requirement";
import {addScene, getScene} from "@/api/business/scene";

export default {
    components: {},
    name: 'requirement',
    data() {
        return {
            reqName: "",
            sceneName: "",
            reqTreeRootNode: null, // 组件树根节点,用于手动更新树
            reqTreeCurrentNode: null, // 组件树当前选中节点,用于手动更新树,如果当前没有选中节点，则将其设置为根节点
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            reqTreeIconClass: 'el-icon-folder',
            tableData: [],
            sceneModal: false,
            reqModal: false,
        }
    },
    methods: {
        loadNode(node, resolve) {
            let id = 0;
            if (node.level === 0) {
                this.reqTreeRootNode = node;
            }
            if (node.level !== 0) {
                id = node.data.id
            }
            getRequirements(id).then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].icon = 'el-icon-folder'
                    if (res.data.length === 0) {
                        // 设置为叶子节点
                        res.data[i].leaf = true
                    }
                }
                resolve(res.data);
            })
        },
        reqTreeNodeClick(data, node) {
            this.reqTreeCurrentNode = node;
            getScene(node.data.id).then(
                res => {
                    if (res.data.length !== 0) {
                        this.tableData = res.data;
                        // 将节点设置为含有场景的叶子需求节点，此类节点禁止新建需求
                        node.data.finalLeaf = true;
                    }
                }
            )
        },
        newRequirement() {
            if (this.$refs.reqTree.getCurrentNode() !== null && this.$refs.reqTree.getCurrentNode().finalLeaf === true) {
                this.$message({
                    showClose: true,
                    message: "当前需求下已存在场景，不能新建子需求",
                    type: 'warning'
                });
            } else {
                this.reqModal = true;
            }
        },
        newRequirementCommit() {
            // 判断是否选中节点
            let id = 0;
            if (this.$refs.reqTree.getCurrentNode() !== null) {
                id = this.$refs.reqTree.getCurrentNode()['id']
            }
            addRequirements(this.reqName, id).then(res => {
                if (res.status === 200) {
                    this.reqTreeCurrentNode.loaded = false;
                    this.reqTreeCurrentNode.expand();
                    this.$message({
                        showClose: true,
                        message: "新建成功",
                        type: 'success'
                    });
                }
            })
        },
        deleteRequirement() {
            if (this.$refs.reqTree.getCurrentNode() === null) {
                this.$message({
                    showClose: true,
                    message: "请选择要删除需求",
                    type: 'warning'
                });
            } else {
                let id = this.$refs.reqTree.getCurrentNode()['id']
                this.$confirm('此操作将永久删除该需求及需求下所有场景及用例, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delRequirements(id).then(res => {
                        if (res.status === 200) {
                            this.$refs.reqTree.remove(this.$refs.reqTree.getNode(id));
                            this.$message({
                                showClose: true,
                                message: "删除成功",
                                type: 'success'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        cancel() {
            this.$Message.info('取消新增');
        },
        newScene() {
            // 判断是否选中叶子需求
            if (this.$refs.reqTree.getCurrentNode() === null || !this.$refs.reqTree.getNode(this.$refs.reqTree.getCurrentNode()['id']).isLeaf) {
                this.$message({
                    showClose: true,
                    message: "当前需求下已存在子需求，不能新建场景",
                    type: 'warning'
                });
            } else {
                this.sceneModal = true;
            }
        },
        newSceneCommit() {
            let id = this.$refs.reqTree.getCurrentNode()['id'];
            addScene(this.sceneName,id).then(res=>{
                // eslint-disable-next-line no-console
                console.log(res);
                if (res.status === 200) {
                    this.$message({
                        showClose: true,
                        message: "新建成功",
                        type: 'success'
                    });
                    getScene(id).then(
                        res => {
                            if (res.data.length !== 0) {
                                this.tableData = res.data;
                                // 将节点设置为含有场景的叶子需求节点，此类节点禁止新建需求
                                this.reqTreeCurrentNode.data.finalLeaf = true;
                            }
                        }
                    )
                }
            })
        },
        editRequirement() {

        },
        clearRequirement() {
            this.$refs.reqTree.setCurrentKey(null);
        },
        casesEditor(row) {
            //使用resolve方法解析路由，得到location、router、href等目标路由的信息。得到href使用window.open开新窗口。
            const {href} = this.$router.resolve({
                path: './casesEditor',
                query: {
                    reqId: row['id'],
                }
            });
            window.open(href, '_blank');
        },
        delScene() {

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
