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
                            <el-button type="primary" @click="run">执行<i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>
                        </div>
                        <div class="set-tree-div" v-loading.body="caseLoading">
                            <el-tree
                                    id="set-tree"
                                    :props="setTreeProps"
                                    ref="reqTree"
                                    lazy
                                    :load="loadReqNode"
                                    @node-expand="setTreeExpand"
                                    node-key="set"
                                    :expand-on-click-node="true"
                                    show-checkbox
                                    @check="check">
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
                setTreeProps: {
                    isLeaf: 'leaf'
                }
            }
        },
        methods: {
            run() {
                let checkedCases = this.$refs.reqTree.getCheckedNodes();
                let checkedCasesSetName = "";
                // console.log(checkedCases);
                for (let i = 0; i < checkedCases.length; i++) {
                    // console.log(checkedCases[i].tier);
                    // console.log(checkedCases[i].tier.indexOf("000"));
                    if (checkedCases[i].tier.indexOf("000") > -1) {
                        checkedCasesSetName = checkedCasesSetName + "," + checkedCases[i].pk_id;
                    }
                }
                this.$message({
                    showClose: true,
                    message: checkedCasesSetName,
                    type: 'success'
                });

                // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning',
                //     center: true
                // }).then(() => {
                //     this.$message({
                //         type: 'success',
                //         message: '删除成功!'
                //     });
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '已取消删除'
                //     });
                // });

            },
            loadSetNode(node, resolve) {
                let url = this.GLOBAL.httpUrl + "set/";
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
                                let url2 = this.GLOBAL.httpUrl + "reqOfCase/";
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
                    let url = this.GLOBAL.httpUrl + "reqOfCase/";
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
                // 懒加载先保存当前选中的节点key, 展开后再设置一遍解决展开某选中节点后选中被取消的问题
                if (this.$refs.reqTree !== undefined) this.checkedKeys = this.$refs.reqTree.getCheckedKeys();
                let url = this.GLOBAL.httpUrl + "reqOfCase/";
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
                            if (response.data.length === 0) {
                                return resolve(response.data);
                            }
                            if (response.data[0].tier.slice(-3) === '000') {
                                //避免在用例节点前渲染下拉按钮
                                for (var i = 0; i < response.data.length; i++) {
                                    response.data[i].leaf = true;
                                }
                            }
                            return resolve(response.data);
                            // this.$refs.reqTree.data = response.data
                            // 通过this.$refs获取dom对象
                        }
                    )
                }
                if (this.$refs.reqTree !== undefined) this.$refs.reqTree.setCheckedKeys(this.checkedKeys);
            },
            check(data, node) {
                if (node.checkedNodes.length !== 0) {
                    //若节点状态为选中状态
                    //循环遍历加载其子节点，并将所有子节点勾选状态设置为已勾选
                    //     this.loadReqNode(node,this.resolve);
                    //     console.log(node);
                    //
                    // }else {
                    //     console.log(node);
                }
            },
            setTreeExpand(data, node) {
                node.expanded = true;
                let childNodes = node.childNodes;
                for (let i = childNodes.length - 1; i >= 0; i--) {
                    // let child = childNodes[i];
                }
                // console.log("setTreeExpand");
                let checkedStatus = node.checked;
                if (checkedStatus === true) {
                    //如果该节点已经被选中，将该节点下所有子节点勾选状态改为已选中
                    // console.log("该节点已经被选中");

                }
            }
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