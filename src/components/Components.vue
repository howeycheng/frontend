<template>
    <div>
        <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
            <el-container>
                <!--左侧侧边栏-->
                <el-aside width="280px">
                    <div>
                        <el-tooltip class="item" effect="dark" content="新建组件文件夹" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-circle-plus-outline" @click="newCompDir" size="mini"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="上传组件" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-top" @click="newComp" size="mini"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="修改组件文件夹" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-edit" size="mini" @click="editComp"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除组件或文件夹" placement="top-start"
                                    style="color:black;">
                            <el-button icon="el-icon-delete" size="mini" @click="deleteComp"
                                       style="margin-left: 5px;margin-top: 5px"></el-button>
                        </el-tooltip>
                    </div>
                    <Modal
                        v-model="modal"
                        title="新建组件文件夹"
                        @on-ok="ensureAdd"
                        @on-cancel="cancel"
                        :draggable="true">
                        <div style="padding: 10px;background: #f8f8f9">
                            <Card title="" icon="ios-options" :padding="0" >
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
                        :icon-class="iconClass"
                    >
                    </el-tree>
                </el-aside>
                <el-main id="run-main" v-show="show">
                    <!--主要区域容器-->
                    <el-divider></el-divider>
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
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
            <BackTop></BackTop>
        </el-container>
    </div>
</template>

<script>
import {getComponents, getComponentScript} from "@/api/business/components";

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
            compDirName:'',
            compDirNameDescrip:'',
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
            this.$Message.info('Clicked cancel');
        },
        // 新建组件文件夹
        newCompDir() {
            // eslint-disable-next-line no-unused-vars
            let parentId = 0;
            if (this.$refs.compTree.getCurrentNode() === null) {
                this.modal = true;
            }else{
                parentId = this.$refs.compTree.getCurrentNode()['id'];
                // eslint-disable-next-line no-console
                console.log(this.$refs.compTree.getCurrentNode());
                if (this.$refs.compTree.getCurrentNode()['type'] === 0) {
                    this.modal = true;
                }else {
                    this.$message({
                        showClose: true,
                        message: "请选择正确的组件文件夹父节点",
                        type: 'warning'
                    });
                }
            }
        },
        // 新建组件
        newComp() {
            //    首先判断是否选中叶子文件夹
            // eslint-disable-next-line no-console
            console.log(this.$refs.compTree.getCurrentNode()['script_name']);
            if (this.$refs.compTree.getCurrentNode()['script_name'] === '') {
                // eslint-disable-next-line no-console
                console.log('可以上传');
            }
        },
        ensureAdd() {

        },
        editComp() {

        },
        deleteComp() {

        },
        handleClick() {

        },
        loadNode(node, resolve) {
            // 默认id为0,查询根节点
            let id = 0;
            if (node.level > 0) {
                id = node.data.id
            }
            getComponents(id).then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].type === 0) {
                        res.data[i].script_name = res.data[i].group_name
                    } else {
                        res.data[i].leaf = true
                    }
                }
                resolve(res.data)
            }).catch(error => {
                // eslint-disable-next-line no-console
                console.log(error)
            })
        },
        click(data, node) {
            if (node.isLeaf) {
                this.loading = true
                let id = data.id
                getComponentScript(id).then(res => {
                    this.code = res.data.script
                    this.loading = false
                }).catch(error => {
                    // eslint-disable-next-line no-console
                    console.log(error)
                    this.loading = false
                })
                this.show = true
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