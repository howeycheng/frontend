<template>
    <div>
        <el-container style="background-color: white;height: 100%;min-height: 100vh;" direction="vertical">
            <el-container>
                <!--左侧侧边栏-->
                <el-aside>
                    <el-tree
                        :props="props"
                        lazy
                        ref="setTree"
                        :load="loadSetNode"
                        :expand-on-click-node="true"
                        @node-click="clickSetNode"
                        :icon-class="setTreeIconClass"
                    >
                    </el-tree>
                </el-aside>
                <el-main id="run-main">
                    <!--主要区域容器-->
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="备注信息"
                        v-model="textarea">
                    </el-input>
                    <div id="run-main-ico">
                        <el-button type="primary" @click="run" size="mini" style="margin-left: 5px">执行</el-button>
                        <el-button type="primary" @click="addCaseToSet" size="mini" style="margin-left: 5px">新增
                        </el-button>
                        <el-button type="primary" @click="delCaseFromSet" size="mini" style="margin-left: 5px">删除
                        </el-button>
                        <Modal
                            v-model="modal1"
                            title="新建执行任务"
                            @on-ok="ok"
                            @on-cancel="cancel"
                            :draggable="true">
                            <div style="padding: 10px;background: #f8f8f9">
                                <Card title="" icon="ios-options" :padding="0" shadow style="width: 300px;">
                                    <CellGroup>
                                        <el-radio v-model="runMode" label="1">顺序执行</el-radio>
                                        <el-radio v-model="runMode" label="2">并发执行</el-radio>
                                    </CellGroup>
                                    <CellGroup>
                                        <p>用例数量 ：{{ casesNum }}</p>
                                        <label>
                                            <Input v-model="runName" placeholder="执行名称"/>
                                        </label>
                                        <br>
                                    </CellGroup>
                                </Card>
                            </div>
                        </Modal>
                    </div>

                    <div class="set-tree-div">
                        <el-tree
                            v-loading="caseLoading"
                            :props="setTreeProps"
                            ref="casesTree"
                            lazy
                            :load="loadCasesNode"
                            :key="timer"
                            node-key="set"
                            :expand-on-click-node="true"
                            show-checkbox
                            :icon-class="setTreeIconClass">
                                <span class="set-tree-node" slot-scope="{ node, data }" :title="data.name">
                                    <span>{{ data.name }}</span>
                                </span>
                        </el-tree>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import {Loading} from 'element-ui';
import {getCasesOfReqInSet, getCasesOfSet, getSets} from "@/api/business/set";
import {run} from "@/api/business/run";

export default {
    name: "run",
    components: {},
    data() {
        return {
            runMode: '1', // 1:顺序执行，2：并发执行
            setTreeIconClass: 'el-icon-folder',
            casesTreeIconClass: 'el-icon-folder',
            props: {
                label: 'set_name',
                isLeaf: 'leaf'
            },
            textarea: '',
            modal1: false,
            setData: '',
            caseLoading: false,
            setTreeProps: {
                isLeaf: 'leaf'
            },
            timer: '',
            runName: '',
            checkedCases: [],
            casesNum: 0,
        }
    },
    methods: {
        getCheckedCases() {
            return new Promise((resolve, reject) => {
                this.caseLoading = true;
                this.checkedCases = [];
                let checkedNodes = this.$refs.casesTree.getCheckedNodes();
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
                    let params = {
                        checkedCases: checkedCases + '',
                        set: this.setData,
                    }
                    getCasesOfReqInSet(params).then(response => {
                        resolve(response.data);
                    }).catch(function (rejectedResult) {
                        reject(rejectedResult)
                    })
                }
            })
        },
        run() {
            this.getCheckedCases().then(res => {
                this.checkedCases = res;
                this.caseLoading = false;
                this.casesNum = res.length
                this.modal1 = true;
            })
        },
        addCaseToSet() {

        },
        delCaseFromSet() {

        },
// 确认开始执行
        ok() {
            run(this.checkedCases.toString(), this.runName, this.setData, this.radio).then(
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
            // 默认id为0,查询根节点
            let id = 0;
            if (node.level > 0) {
                id = node.data.id
            }
            getSets(id).then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].level === 0) {
                        res.data[i].set_name = res.data[i].group_name
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
        clickSetNode(data, node) {
            if (node.isLeaf) {
                let caseLoadingIns = Loading.service({fullscreen: false, text: '加载测试集...'});
                this.setData = node.data.set_id;
                this.timer = new Date().getTime();//每次点击测试集树，重新渲染测试用例树
                caseLoadingIns.close();
            }
        },
        loadCasesNode(node, resolve) {
            if (this.$refs.setTree.getCurrentNode() !== null) {
                // 懒加载先保存当前选中的节点key, 展开后再设置一遍解决展开某选中节点后选中被取消的问题
                if (this.$refs.casesTree !== undefined) this.checkedKeys = this.$refs.casesTree.getCheckedKeys();
                let params = {
                    level: "0",
                    set: this.setData,
                    tier: ""
                }
                if (node.level !== 0) {
                    params.level = node.level
                    params.tier = node.data.tier
                }
                getCasesOfSet(params).then(response => {
                    if (response.data[0].tier.slice(-3) === '000') {
                        // 避免在用例节点前渲染下拉按钮
                        for (let i = 0; i < response.data.length; i++) {
                            response.data[i].leaf = true;
                        }
                    }
                    return resolve(response.data);
                })
                if (this.$refs.casesTree !== undefined) this.$refs.casesTree.setCheckedKeys(this.checkedKeys);
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
    padding: 0;
}

#run-main-ico {
    padding: 10px;
    background-color: #f7f8fa;
}

.el-tree {
    min-width: 100%;
    display: inline-block;
}
</style>