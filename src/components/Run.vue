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
                            <Button type="primary" @click="run">执行</Button>
                            <Modal
                                v-model="modal1"
                                title="新建执行任务"
                                @on-ok="ok"
                                @on-cancel="cancel"
                                :draggable="true">
                                <div style="padding: 10px;background: #f8f8f9">
                                    <Card title="选择执行器" icon="ios-options" :padding="0" shadow style="width: 300px;">
                                        <CellGroup>
                                            <p>用例数量 ：{{ casesNum }}</p>
<!--                                            <Input v-model="ip" placeholder="执行器IP"/>-->
<!--                                            <br>-->
<!--                                            <Input v-model="port" placeholder="端口"/>-->
<!--                                            <br>-->
                                            <Input v-model="runName" placeholder="执行名称"/>
                                            <br>
                                        </CellGroup>
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
            timer: '',
            // ip: '',
            // port: '',
            runName: '',
            casesToRun: [],
            casesNum: 0
        }
    },
    methods: {
        run() {
            this.caseLoading = true;
            this.casesToRun = [];
            let checkedNodes = this.$refs.reqTree.getCheckedNodes();
            if (checkedNodes.length === 0) {
                this.caseLoading = false;
                this.$message({
                    showClose: true,
                    message: "未选中测试用例",
                    type: 'warning'
                });
            } else {
                let checkedCases = [];
                for (let i = checkedNodes.length - 1; i >= 0; i--) {
                    let child = checkedNodes[i];
                    checkedCases.push(child['id'] + ' ' + child['case_id'] + ' ' + child['tier'])
                }
                let url = this.GLOBAL.httpUrl + "casesToRun/";
                this.$axios.get(url, {
                        params: {
                            checkedCases: checkedCases + '',
                            set: this.setData,
                        }
                    }
                ).then(
                    response => {
                        this.casesToRun = response.data;
                        this.caseLoading = false;
                        this.modal1 = true;
                        this.casesNum = this.casesToRun.length;
                        // eslint-disable-next-line no-console
                        console.log(this.casesToRun);
                    }
                ).catch(function (rejectedResult) {
                    // eslint-disable-next-line no-console
                    console.log(rejectedResult);
                })
            }
        },
        // 确认开始执行
        ok() {
            let url = this.GLOBAL.httpUrl + "run/";
            this.$axios.get(url, {
                    params: {
                        // nameSrvAddr: this.ip + ":" + this.port,
                        runName: this.runName,
                        setNames: this.casesToRun.toString(),
                        setId: this.setData
                    }
                }
            ).then(
                response => {
                    if (response.data.indexOf("exceptions") !== -1 || response.data.indexOf("error") !== -1) {
                        this.$message({
                            message: response.data,
                            type: 'warning'
                        });
                    }
                    // eslint-disable-next-line no-console
                    console.log(response.data);
                }
            ).catch(function (rejectedResult) {
                // eslint-disable-next-line no-console
                console.log(rejectedResult);
            })
        },
        cancel() {
            this.$Message.info('Clicked cancel');
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