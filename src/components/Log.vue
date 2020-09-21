<template>
    <div>
        <headers activeIndex = '/log'></headers>
        <div>
          <el-table
              :data="run"
              border
              style="align-content: center;width:auto;font-size: 0.6vw;margin:0;line-height: 0.6vw"
              highlight-current-row>
            <el-table-column label="执行记录">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="handleDetail(scope.row)">查看
                </el-button>
                <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </div>


</template>

<script>
    import headers from './header'

    export default {
        name: "Log",
        components: {
            headers,
        },
        return: {
            value1: false,
            run:[]
        }
    }
</script>

<style>

</style>