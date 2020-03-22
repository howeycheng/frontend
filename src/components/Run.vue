<template>
    <div>
        <headers activeIndex='/run'></headers>
        <div>
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
                                    ref="setTree"
                                    lazy
                                    :load="loadSetNode"
                                    node-key="rqid"
                                    :expand-on-click-node="true"
                                    @node-click="clickSetNode"
                            >
                                <span class="req-tree-node" slot-scope="{ node, data }" :title="data.name">
                                    <span>{{ data.name }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </el-aside>
                    <el-main id="run-main">
                        <!--主要区域容器-->
                        <div id="run-main-ico">
                            <el-button type="primary" icon="el-icon-edit"></el-button>
                            <el-button type="primary" icon="el-icon-share"></el-button>
                            <el-button type="primary" icon="el-icon-delete"></el-button>
                            <el-button type="primary" icon="el-icon-search">搜索</el-button>
                            <el-button type="primary">执行<i class="el-icon-caret-right el-icon--right"></i></el-button>
                        </div>
                        <div class="set-tree-div" v-loading.body="caseLoading">
                            <el-tree
                                    id="set-tree"
                                    :props="props"
                                    ref="reqTree"
                                    lazy
                                    :load="loadReqNode"
                                    node-key="set"
                                    :expand-on-click-node="true"
                                    show-checkbox>
                                <span class="set-tree-node" slot-scope="{ node, data }" :title="data.name">
                                    <span>{{ data.name }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script>
    import headers from './header'
    import {Loading} from 'element-ui';

    export default {
        name: "run",
        components: {
            headers,
        },
        data() {
            return {
                setData: '',
                caseLoading: false,
            }
        },
        methods: {
            loadSetNode(node, resolve) {
                var url = this.GLOBAL.httpUrl + "set/";
                if (node.level === 0) {
                    // 发送请求:将数据返回到一个回调函数中
                    // 并且响应成功以后会执行then方法中的回调函数
                    this.$axios.get(url, {
                        params: {
                            level: 0
                        }
                    }).then(
                        response => {
                            return resolve(response.data)
                        }
                    )
                    // 这里resolve的数据是后台给的,id用于之后点击发起请求时的参数
                } else {
                    // this.setData = node.data.table_name;
                    this.$axios.get(url, {
                        params: {
                            level: 1,
                            pk_id: node.data.pk_id
                        }
                    }).then(
                        response => {
                            if (response.data.length === 0) {
                                let caseLoadingIns = Loading.service({fullscreen: false, text: '加载测试集...'});
                                node.isLeaf = true;
                                var url2 = this.GLOBAL.httpUrl + "reqOfCase/";
                                this.setData = node.data.table_name;
                                this.$axios.get(url2, {
                                    params: {
                                        level: "0",
                                        set: this.setData,
                                        req: ""
                                    }
                                }).then(
                                    response => {
                                        caseLoadingIns.close();
                                        this.$refs.reqTree.data = response.data;
                                    }
                                );
                            }
                            return resolve(response.data)
                        }
                    )
                }
            },
            clickSetNode(data, node) {
                if (node.isLeaf) {
                    let caseLoadingIns = Loading.service({fullscreen: false, text: '加载测试集...'});
                    var url = this.GLOBAL.httpUrl + "reqOfCase/";
                    //若节点为叶子节点，根据测试集查询该测试集下用例，生产新的测试用例树
                    this.setData = node.data.table_name;
                    this.$axios.get(url, {
                        params: {
                            level: "0",
                            set: this.setData,
                            req: ""
                        }
                    }).then(
                        response => {
                            caseLoadingIns.close();
                            this.$refs.reqTree.data = response.data;
                        }
                    );
                }
            },
            loadReqNode(node, resolve) {
                var url = this.GLOBAL.httpUrl + "reqOfCase/";
                if (node.level === 0) {
                    // 发送请求:将数据返回到一个回到函数中
                    // 并且响应成功以后会执行then方法中的回调函数
                    this.$axios.get(url, {
                        params: {
                            level: "0",
                            set: this.setData,
                            tier: ""
                        }
                    }).then(
                        response => {
                            return resolve(response.data)
                        }
                    )
                } else {
                    this.$axios.get(url, {
                        params: {
                            level: node.level,
                            set: "Set103",
                            tier: node.data.tier
                        }
                    }).then(
                        response => {
                            return resolve(response.data)
                            // this.$refs.reqTree.data = response.data
                            // 通过this.$refs获取dom对象
                        }
                    )
                }
            },
        }
    }
</script>

<style scoped>
    #run-main {
        color: white;
    }

    #run-main {
        background-color: white;
        color: #333;
        text-align: left;
        padding: 0px;
    }

    #run-main-ico {
    }

    #run-main .el-button {
        margin-left: 10px;
    }

    #run-main-ico {
        padding-left: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #f7f8fa;
    }

    .set-tree-div > .el-tree-node__content {
        background: cadetblue;
    }

</style>