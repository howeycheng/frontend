<template>
    <div>
        <div id="luckysheet"
             style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
    </div>
</template>

<script>
import {addComponentScript} from "@/api/business/components";

export default {
    name: "ComponentsEditor",
    props: {
        msg: String
    },
    data() {
        return {
            //获取路由传递过来的场景ID
            id: this.$route.query.id,
            sheetData: [],
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        close(){
            window.close();
        },
        async upload() {
            let sheetCfg = window.luckysheet.getSheet();
            let sheetData = sheetCfg.data;
            let sheetName = sheetCfg.name;
            let content = []
            for (let i = 0; i < sheetData.length; i++)
                if (sheetData[i][0] !== null) {
                    content.push(sheetData[i]);
                } else {
                    break;
                }
            // eslint-disable-next-line no-console
            console.log(content);
            let res = await addComponentScript(this.id, sheetName, content);
            if (res.status === 200){
                // eslint-disable-next-line no-console
                this.$message({
                    type: 'success',
                    message: '新增组件成功!'
                });
            }else {
                this.$message({
                    type: 'info',
                    message: '新增组件失败!'
                });
            }
        },
        init() {
            this.sheetData.push({
                "name": '双击标签页修改组件名称',
                "color": "", //工作表颜色
                "status": 1, //激活状态
                "order": 0, //工作表的下标
                "hide": 0,//是否隐藏
                "column": 3,
                "row": 50,
                "celldata": [{'r': '0', 'c': '0', 'v': '字段'}, {'r': '0', 'c': '1', 'v': '默认值'}, {
                    'r': '0',
                    'c': '2',
                    'v': '备注'
                }], //初始化使用的单元格数据
                "config": {},
                "frozen": {
                    type: "row"//冻结行列
                },
                // 底部计数栏不显示
                "showstatisticBar": false
            })
            // eslint-disable-next-line no-undef
            luckysheet.create({
                container: 'luckysheet', // 设定DOM容器的id
                title: '组件编辑器', // 设定表格名称
                lang: 'zh', // 设定表格语言
                // plugins: ['chart'],
                showtoolbar: false,
                showinfobar: true,
                showtoolbarConfig: {
                    undoRedo: true, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
                    paintFormat: false, //格式刷
                    currencyFormat: false, //货币格式
                    percentageFormat: false, //百分比格式
                    numberDecrease: false, // '减少小数位数'
                    numberIncrease: false, // '增加小数位数
                    moreFormats: false, // '更多格式'
                    font: true, // '字体'
                    fontSize: true, // '字号大小'
                    bold: true, // '粗体 (Ctrl+B)'
                    italic: false, // '斜体 (Ctrl+I)'
                    strikethrough: false, // '删除线 (Alt+Shift+5)'
                    underline: false, // '下划线 (Alt+Shift+6)'
                    textColor: true, // '文本颜色'
                    fillColor: true, // '单元格颜色'
                    border: false, // '边框'
                    mergeCell: false, // '合并单元格'
                    horizontalAlignMode: false, // '水平对齐方式'
                    verticalAlignMode: false, // '垂直对齐方式'
                    textWrapMode: false, // '换行方式'
                    textRotateMode: false, // '文本旋转方式'
                    image: false, // '插入图片'
                    link: false, // '插入链接'
                    chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
                    postil: false, //'批注'
                    pivotTable: false,  //'数据透视表'
                    function: false, // '公式'
                    frozenMode: false, // '冻结方式'
                    sortAndFilter: true, // '排序和筛选'
                    conditionalFormat: false, // '条件格式'
                    dataVerification: false, // '数据验证'
                    splitColumn: false, // '分列'
                    screenshot: false, // '截图'
                    findAndReplace: true, // '查找替换'
                    protection: false, // '工作表保护'
                    print: false, // '打印'
                },
                // 右上角功能按钮
                functionButton: '<button id="but_download" class="btn btn-primary" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">提交</button> <button id="but_close" class="btn btn-primary" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">关闭</button>',
                // 自定义sheet页右击菜单
                sheetRightClickConfig: {
                    delete: true, // 删除
                    copy: true, // 复制
                    rename: false, //重命名
                    color: false, //更改颜色
                    hide: false, //隐藏，取消隐藏
                    move: true, //向左移，向右移
                },
                // 是否显示公式栏
                sheetFormulaBar: false,
                // 自定义配置单元格右击菜单
                cellRightClickConfig: {
                    copy: true, // 复制
                    copyAs: false, // 复制为
                    paste: true, // 粘贴
                    insertRow: true, // 插入行
                    insertColumn: true, // 插入列
                    deleteRow: true, // 删除选中行
                    deleteColumn: true, // 删除选中列
                    deleteCell: false, // 删除单元格
                    hideRow: false, // 隐藏选中行和显示选中行
                    hideColumn: false, // 隐藏选中列和显示选中列
                    rowHeight: false, // 行高
                    columnWidth: false, // 列宽
                    clear: false, // 清除内容
                    matrix: false, // 矩阵操作选区
                    sort: true, // 排序选区
                    filter: true, // 筛选选区
                    chart: false, // 图表生成
                    image: false, // 插入图片
                    link: false, // 插入链接
                    data: false, // 数据验证
                    cellFormat: false // 设置单元格格式
                },
                data: this.sheetData,
            });
            // eslint-disable-next-line no-unused-vars
            document.getElementById('but_download').addEventListener('click', this.upload);
            document.getElementById('but_close').addEventListener('click', this.close);
        }
    }
}
</script>

<style scoped>

</style>