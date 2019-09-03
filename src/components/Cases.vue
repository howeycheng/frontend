<template>
    <div>
        <headers></headers>
        <div style="display: inline">
            <div style="display: inline">
                <el-table
                        :data="scenesSet"
                        border="True"
                        style="align-content: center"
                        highlight-current-row>
                    <el-table-column
                            prop=case_name
                            label="组件">
                    </el-table-column>
                </el-table>
            </div>
            <div style="display: inline">
                <el-table
                        :data="scenesCases"
                        border="True"
                        style="align-content: center"
                        highlight-current-row>
                    <el-table-column
                            prop=name
                            label="用例名称">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import headers from './header'

    export default {
        name: "Cases",
        components: {
            headers
        },
        data() {
            return {
                id: this.$route.query.rqid,
                scenesSet: [],
                scenesCases: []

            }
        },
        mounted: function () {
            this.getScenesSet(this.id);
            this.getScenesCases(this.id);
        },
        methods: {
            getScenesSet(id) {
                axios.get("http://127.0.0.1:8000/atf/sceneDetail/", {
                    params: {
                        rqid: id
                    }
                }).then(
                    response => {
                        this.scenesSet = response.data
                    }
                )
            },
            getScenesCases(id) {
                axios.get("http://127.0.0.1:8000/atf/cases/", {
                    params: {
                        rqid: id
                    }
                }).then(
                    response => {
                        this.scenesCases = response.data
                    }
                )
            },
        }

    }
</script>

<style scoped>

</style>