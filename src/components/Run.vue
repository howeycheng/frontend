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
                            >
                                <span class="tree-node" slot-scope="{ node, data }" :title="data.group_name">
                                    <span>{{ data.name }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </el-aside>
                    <el-main>
                        <!--主要区域容器-->
                        <div>
                            <div class="set-tree">
                                <el-tree
                                        :props="props"
                                        ref="reqTree"
                                        :load="loadReqFatherNode"
                                        lazy
                                        node-key="rqid"
                                        :expand-on-click-node="true"
                                        show-checkbox="true">
                                <span class="req-tree-node" slot-scope="{ node, data }" :title="data.name">
                                    <span>{{ data.name }}</span>
                                </span>
                                </el-tree>
                            </div>
                        </div>
                    </el-main>
                </el-container>
            </el-container>

        </div>
    </div>
</template>

<script>
    import headers from './header'

    export default {
        name: "run",
        components: {
            headers,
        },
        data() {
            return {
                setData: ''
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
                                this.setData = node.data.table_name;
                            }
                            return resolve(response.data)
                        }
                    )
                }
            },
            loadReqFatherNode() {
                var url = this.GLOBAL.httpUrl + "reqOfCase/";
                // 发送请求:将数据返回到一个回到函数中
                // 并且响应成功以后会执行then方法中的回调函数
                this.$axios.get(url, {
                    params: {
                        set: "001"
                    }
                }).then(
                    response => {
                        this.$refs.reqTree.data = response.data
                        // 通过this.$refs获取dom对象
                    }
                )
            },
            loadReqNode(node, resolve) {
                var url = this.GLOBAL.httpUrl + "reqFromSetTemp/";
                this.$axios.get(url, {
                    params: {
                        req: "001"
                    }
                }).then(
                    response => {
                        return resolve(response.data)
                    }
                )
            },
            getReqTreeChild(id, resolve) {
                var url = this.GLOBAL.httpUrl + "reqOfCase/";
                this.$axios.get(url, {
                    params: {
                        level: 1,
                        pk_id: id
                    }
                }).then(
                    response => {
                        return resolve(response.data)
                    }
                )
            },
        }
    }
</script>

<style scoped>

</style>