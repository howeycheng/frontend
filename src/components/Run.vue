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
                            <!--                            <el-button type="primary" icon="el-icon-edit"></el-button>-->
                            <!--                            <el-button type="primary" icon="el-icon-share"></el-button>-->
                            <!--                            <el-button type="primary" icon="el-icon-delete"></el-button>-->
                            <!--                            <el-button type="primary" icon="el-icon-search">搜索</el-button>-->
                            <!--                            <el-button type="primary" @click="run">执行[目前只支持全选执行]<i class="el-icon-caret-right el-icon&#45;&#45;right"></i>-->
                            <!--                            </el-button>-->

                            <Button type="primary" @click="test">执行[目前只支持全选执行]</Button>
                            <Modal
                                    v-model="modal1"
                                    title="新建执行任务"
                                    @on-ok="ok"
                                    @on-cancel="cancel">
                                <div style="padding: 10px;background: #f8f8f9">
                                    <Card title="Options" icon="ios-options" :padding="0" shadow style="width: 300px;">
                                        <CellGroup>
                                            <Cell title="执行名称"/>
                                        </CellGroup>
                                        <Cell title="With Switch">
                                            <Switch v-model="switchValue" slot="extra"/>
                                        </Cell>
                                    </Card>
                                </div>
                            </Modal>
                        </div>
                        <div class="set-tree-div" v-loading.body="caseLoading">
                            <el-tree
                                    id="set-tree"
                                    :props="setTreeProps"
                                    ref="reqTree"
                                    lazy
                                    :load="loadReqNode"
                                    :key="timer"
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
                switchValue: true,
                modal1: false,
                getReqLeafRes: [],
                setData: '',
                caseLoading: false,
                setTreeProps: {
                    isLeaf: 'leaf'
                },
                timer: ''
            }
        },
        methods: {
            test(){
                var checkedNodes = this.$refs.reqTree.getCheckedNodes();
                console.log(checkedNodes);
                if (checkedNodes.length === 0) {
                  this.$message({
                    showClose: true,
                    message: "未选中测试用例",
                    type: 'warning'
                  });
                }
                else {
                  this.$message({
                    showClose: true,
                    message: checkedNodes,
                    type: 'success'
                  });
                }
            },
            ok() {
                this.$Message.info('Clicked ok');
            },
            cancel() {
                this.$Message.info('Clicked cancel');
            },
            // 声明一个同步请求方法，给定场景ID和测试集ID,返回该场景ID的叶子场景ID
            getReqLeaf: async function (set, id) {
                var that = this;
                this.getReqLeafRes = (await that.$axios.get(that.GLOBAL.httpUrl + "reqOfSet/", {
                    params: {
                        set: set,
                        id: id
                    }
                })).data
            },
            run: async function () {
                /*
                 *为解决懒加载tree,在未展开节点前，勾选父节点无法同时勾选其子节点的问题。通过筛选出未勾选用例的方式，从测试集所有用例中去除该部分用例，则是需要发起执行的用例。
                 */
                // 获取已勾选节点
                var checkedNodes = this.$refs.reqTree.getCheckedNodes();
                if (checkedNodes.length === 0) {
                    // 未勾选节点，直接弹出提示
                    this.$message({
                        showClose: true,
                        message: "未选中测试用例",
                        type: 'warning'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: "开始执行",
                        type: 'success'
                    });
                    // 存在已勾选节点，进入下一步逻辑处理
                    var unCheckedNodesLeaf = [];
                    // 遍历获取未被选中的节点
                    var traverse = function traverse(node) {
                        var childNodes = node.root ? node.root.childNodes : node.childNodes;
                        childNodes.forEach(function (child) {
                            if (!(child.checked || child.indeterminate)) {
                                // 若未选中的节点为非子叶节点，需要遍历其子节点,直到遍历至叶子节点上一层节点
                                unCheckedNodesLeaf.push(child.data);
                            }
                            traverse(child);
                        });
                    };
                    traverse(this.$refs.reqTree);
                    // var ReqLeaf = [];
                    // // 存储未勾选的用例
                    // var unCheckedNodes = [];
                    // // let reqOfCaseUrl = this.GLOBAL.httpUrl + "reqOfCase/";
                    // // 因该请求数据需在后面使用，所以要采用同步请求
                    // for (let i = 0; i < unCheckedNodesLeaf.length; i++) {
                    //     await this.getReqLeaf(this.setData, unCheckedNodesLeaf[0].id);
                    //     this.getReqLeafRes.forEach(function (child) {
                    //         if (ReqLeaf.indexOf(child) === -1) {
                    //             ReqLeaf.push(child[0]);
                    //         }
                    //     })
                    // }
                    // // eslint-disable-next-line no-console
                    // console.log("ReqLeaf.length", ReqLeaf.length);
                    // let reqOfCaseUrl = this.GLOBAL.httpUrl + "reqOfSet/";
                    // ReqLeaf.forEach(child => {
                    //     // 根据叶子场景和测试集ID查询用例ID
                    //     this.$axios.get(reqOfCaseUrl, {
                    //         params: {
                    //             level: "1",
                    //             set: this.setData,
                    //             tier: child.tier
                    //         }
                    //     }).then(response => {
                    //         response.data.forEach(caseChild => {
                    //             // eslint-disable-next-line no-console
                    //             console.log(caseChild);
                    //             unCheckedNodes.push(caseChild);
                    //         });
                    //     });
                    // })
                    // // eslint-disable-next-line no-console
                    // console.log("unCheckedNodes", unCheckedNodes);
                    // TODO 解决未选中节点为父节点，且其子节点未展开的场景
                    // 获取当前选中测试集下所有用例
                    var allCases = [];
                    let casesInSetUrl = this.GLOBAL.httpUrl + "casesInSet/";
                    this.$axios.get(casesInSetUrl, {
                        params: {
                            set: this.setData
                        }
                    }).then(
                        response => {
                            response.data.forEach(child => {
                                // 从选中测试集的所有用例中去除未勾选的用例，获取到的即是需要执行的用例
                                // if (unCheckedNodes.indexOf(child.case_id) === -1) {
                                allCases.push(child.case_id);
                                // }
                            });
                        }
                    )
                    this.$message({
                        showClose: true,
                        message: allCases,
                        type: 'success'
                    });
                }
            },
            loadSetNode(node, resolve) {
                // 左边栏需求默认加载方法
                let url = this.GLOBAL.httpUrl + "set/";
                if (node.level === 0) {
                    // 发送请求:将数据返回到一个回调函数中
                    this.$axios.get(url, {
                        params: {
                            level: 0
                        }
                    }).then(
                        response => {
                            return resolve(response.data);
                        }
                    )
                    // 这里resolve的数据是后台给的,id用于之后点击发起请求时的参数
                } else {
                    // this.setData = node.data.table_name;
                    this.$axios.get(url, {
                        params: {
                            level: 1,
                            id: node.data.id
                        }
                    }).then(
                        response => {
                            if (response.data.length === 0) {
                                let caseLoadingIns = Loading.service({fullscreen: false, text: '加载测试集...'});
                                node.isLeaf = true;
                                this.setData = node.data.set_id;
                                this.timer = new Date().getTime();//每次点击测试集树，重新渲染测试用例树
                                caseLoadingIns.close();
                            }
                            return resolve(response.data)
                        }
                    )
                }
            },
            clickSetNode(data, node) {
                if (node.isLeaf) {
                    let caseLoadingIns = Loading.service({fullscreen: false, text: '加载测试集...'});
                    this.setData = node.data.set_id;
                    this.timer = new Date().getTime();//每次点击测试集树，重新渲染测试用例树
                    caseLoadingIns.close();
                }
            },
            loadReqNode(node, resolve) {
                // 懒加载先保存当前选中的节点key, 展开后再设置一遍解决展开某选中节点后选中被取消的问题
                if (this.$refs.reqTree !== undefined) this.checkedKeys = this.$refs.reqTree.getCheckedKeys();
                let url = this.GLOBAL.httpUrl + "reqOfCase/";
                if (node.level === 0) {
                    // 发送请求:将数据返回到一个回调函数中
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
                    ).catch(function (rejectedResult) {
                        // eslint-disable-next-line no-console
                        console.log(rejectedResult);
                    })
                } else {
                    this.$axios.get(url, {
                        params: {
                            level: node.level,
                            set: this.setData,
                            tier: node.data.tier
                        }
                    }).then(
                        response => {
                            if (response.data.length === 0) {
                                return resolve(response.data);
                            }
                            if (response.data[0].tier.slice(-3) === '000') {
                                // 避免在用例节点前渲染下拉按钮
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