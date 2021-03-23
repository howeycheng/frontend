<template>
    <div>
        <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
            <el-container>
                <!--左侧侧边栏-->
                <el-aside width="280px">
                    <el-tree
                        :props="props"
                        :load="loadNode"
                        lazy
                        @node-click="click"
                        :icon-class="iconClass"
                    >
                    </el-tree>
                </el-aside>
                <el-main id="run-main">
                    <!--主要区域容器-->
                    <div id="edit" v-show="show">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="primary" icon="el-icon-delete" size="mini"></el-button>
                        <el-button type="primary" size="mini">上传<i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </div>
                    <el-divider></el-divider>
                    <div id="code" v-show="show">
                        <codemirror v-loading="loading" v-model="code" :options="options" ref="codemirror"></codemirror>
                    </div>
                </el-main>
            </el-container>
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
</style>