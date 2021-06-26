<template>
    <div>
        <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
            <el-container>
                <!--左侧侧边栏-->
                <el-aside width="280px">
                    <div>
                        <el-tooltip class="item" effect="dark" content="新建目录" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-folder-add" @click="newCompDir" size="mini"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="新增组件" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-document-add" @click="newComp" size="mini"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="修改" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-edit" size="mini" @click="editComp"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-delete" size="mini" @click="deleteComp"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="刷新" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-refresh" size="mini" @click="clearCurrent"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                    </div>
                    <Modal
                        v-model="modal"
                        title="新建组件文件夹"
                        @on-ok="newCompDirCommit"
                        @on-cancel="cancel"
                        :draggable="true">
                        <div style="padding: 10px;background: #f8f8f9">
                            <Card title="" icon="ios-options" :padding="0">
                                <CellGroup>
                                    <label>
                                        <Input v-model="compDirName" placeholder="组件文件夹名称"/>
                                    </label>
                                    <br>
                                    <label>
                                        <Input v-model="compDirNameDescrip" placeholder="组件文件夹描述"/>
                                    </label>
                                </CellGroup>
                            </Card>
                        </div>
                    </Modal>
                    <el-divider></el-divider>
                    <el-tree
                        :highlight-current=true
                        :props="props"
                        :load="loadNode"
                        lazy
                        ref="compTree"
                        @node-click="click"
                        node-key="id"
                    >
                        <span slot-scope="{ node, data }">
                            <i :class="data.icon"></i>
                            <span style="padding-left: 4px;font-size:14px;">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </el-aside>
                <el-main id="run-main" v-show="show">
                    <!--主要区域容器-->
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="脚本" name="first">
                            <div id="edit">
                                <el-button icon="el-icon-edit" size="mini" style="float: right"></el-button>
                            </div>
                            <div id="code">
                                <codemirror v-loading="loading" v-model="code" :options="options"
                                            ref="codemirror"></codemirror>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="参数" name="second">
                            <el-table
                                :data="compData"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                    prop="field"
                                    label="字段"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="value"
                                    label="默认值"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="description"
                                    label="描述信息">
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
            <BackTop></BackTop>
        </el-container>
    </div>
</template>

<script>
import {addComponentDir, delComponentDir, getComponents, getComponentScript} from "@/api/business/components";

// https://codemirror.net/
import {codemirror} from 'vue-codemirror'
// 核心样式
import 'vue-codemirror/node_modules/codemirror/lib/codemirror.css'
// 引入主题后还需要在 options 中指定主题才会生效
import 'vue-codemirror/node_modules/codemirror/theme/idea.css'
import 'vue-codemirror/node_modules/codemirror/mode/clike/clike'

export default {
    name: "Components",
    components: {
        codemirror
    },
    data() {
        return {
            compData: [
            ],
            compTreeRootNode: null, // 组件树根节点,用于手动更新树
            compTreeCurrentNode: null, // 组件树当前选中节点,用于手动更新树,如果当前没有选中节点，则将其设置为根节点
            parentId: 0, // 当前选择节点ID
            compDirName: '', // 待新增组件文件夹名称
            compDirNameDescrip: '', // 待新增组件文件夹描述信息
            modal: false,
            activeName: 'first',
            iconClass: 'el-icon-folder',
            props: {
                label: 'script_name',
                isLeaf: 'leaf'
            },
            code: '', // 编辑器绑定的值
            // 默认配置
            options: {
                tabSize: 2, // 缩进格式
                theme: 'idea', // 主题，对应主题库 JS 需要提前引入
                lineNumbers: true, // 显示行号
                line: true,
                styleActiveLine: true, // 高亮选中行
                hintOptions: { // 自定义提示选项
                    completeSingle: false, // 当匹配只有一项的时候是否自动补全
                },
                mode: 'text/x-java',
                matchBrackets: true,	//括号匹配
                viewportMargin: 10
            },
            loading: false,
            show: false
        }
    },
    methods: {
        cancel() {
            this.$Message.info('新增取消');
        },
        // 新建组件文件夹
        newCompDir() {
            // 判断是否选中节点
            if (this.$refs.compTree.getCurrentNode() === null) {
                this.modal = true;
                this.compTreeCurrentNode = this.compTreeRootNode;
            } else {
                this.parentId = this.$refs.compTree.getCurrentNode()['id'];
                this.compTreeCurrentNode = this.$refs.compTree.getNode(this.parentId);
                if (this.$refs.compTree.getCurrentNode()['type'] === 0) {
                    this.modal = true;
                } else {
                    this.$message({
                        showClose: true,
                        message: "请选择正确的组件文件夹父节点",
                        type: 'warning'
                    });
                }
            }
        },
        newCompDirCommit() {
            if (this.compDirName === '') {
                this.$message({
                    showClose: true,
                    message: "请输入组件文件夹名称",
                    type: 'warning'
                });
            } else {
                addComponentDir(this.parentId, this.compDirName, this.compDirNameDescrip, 0).then(res => {
                    if (res.status === 200) {
                        this.compTreeCurrentNode.loaded = false;
                        this.compTreeCurrentNode.expand();
                    }
                }).catch()
            }
        },
        // 新建组件
        tipsForNewComp() {
            this.$message({
                showClose: true,
                message: "请选择叶子组件文件夹",
                type: 'warning'
            });
        },
        newComp() {
            //    首先判断是否选中叶子文件夹
            let currentNodeData = this.$refs.compTree.getCurrentNode();
            if (currentNodeData !== null) {
                if (currentNodeData['type'] === 0) {
                    getComponents(currentNodeData['id']).then(res => {
                        if (res.data.length === 0) {
                            // eslint-disable-next-line no-console
                            console.log("可以新建组件")
                            const {href} = this.$router.resolve({
                                path: './componentsEditor',
                                query: {
                                    id: currentNodeData['id'],
                                }
                            });
                            window.open(href, '_blank');
                        } else {
                            if (res.data[0]['type'] === 1) {
                                // eslint-disable-next-line no-console
                                console.log("可以新建组件")
                                const {href} = this.$router.resolve({
                                    path: './componentsEditor',
                                    query: {
                                        id: currentNodeData['id'],
                                    }
                                });
                                window.open(href, '_blank');
                            } else {
                                this.tipsForNewComp();
                            }
                        }
                    })
                } else {
                    this.tipsForNewComp();
                }
            } else {
                this.tipsForNewComp();
            }
        },
        clearCurrent() {
            this.$refs.compTree.setCurrentKey(null);
        },
        editComp() {

        },
        deleteComp() {
            if (this.$refs.compTree.getCurrentNode() === null) {
                this.$message({
                    showClose: true,
                    message: "请选择要删除的组件文件夹",
                    type: 'warning'
                });
            } else {
                let id = this.$refs.compTree.getCurrentNode()['id']
                this.$confirm('此操作将永久删除该组件文件夹及该文件夹下所有组件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delComponentDir(id).then(res => {
                        if (res.status === 200) {
                            this.$refs.compTree.remove(this.$refs.compTree.getNode(id));
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
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
        handleClick() {

        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                // 存储根节点
                this.compTreeRootNode = node;
            }
            // 默认id为0,查询根节点
            let id = 0;
            if (node.level > 0) {
                id = node.data.id
            }
            getComponents(id).then(res => {
                if (res.data.length === 0) {
                    node.data.leaf = true
                    node.data.icon = 'el-icon-folder'
                }
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].type === 0) {
                        res.data[i].script_name = res.data[i].group_name
                        res.data[i].icon = 'el-icon-folder'
                    } else {
                        res.data[i].leaf = true
                        res.data[i].icon = 'el-icon-tickets'
                    }
                }
                resolve(res.data)
            }).catch(error => {
                // eslint-disable-next-line no-console
                console.log(error)
            })
        },
        click(data, node) {
            if (node.isLeaf && node.data.type === 1) {
                this.loading = true
                let id = data.id
                getComponentScript(id).then(res => {
                    this.code = res.data.script
                    this.compData = res.data.parameter
                    this.loading = false
                }).catch(error => {
                    // eslint-disable-next-line no-console
                    console.log(error)
                    this.loading = false
                })
                this.show = true
            } else {
                this.show = false
            }
        }
    }
}
</script>

<style scoped>
.el-tree {
    min-width: 100%;
    display: inline-block;
}

.el-divider--horizontal {
    margin-top: 8px;
    margin-bottom: 8px;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: white;
}

.el-tree-node__expand-icon {
    color: black;
}

</style>