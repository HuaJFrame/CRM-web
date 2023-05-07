<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div id="make1" style="width: 100%;min-height:500px"></div>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span="24">
                <div id="make2" style="width: 100%;min-height:500px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》from '《组件路径》';
import * as echarts from "echarts";
import request from "@/util/request"

export default {
    //计算属性类似于data 概念
    methods: {
        buildCharts() {
            this.buildMake1()
            this.buildMake2()
        },
        async buildMake1() {
            let { data } = await request.get("cus/countCustomerMake1");
            if (data.code === 200) {
                var myChart = echarts.init(document.getElementById('make1'));

                // 指定图表的配置项和数据
                var option = {
                    xAxis: {
                        type: 'category',
                        data: data.data1
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data.data2,
                        type: 'line'
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
        async buildMake2() {
            let { data } = await request.get("cus/countCustomerMake2");
            if (data.code === 200) {
                var myChart = echarts.init(document.getElementById('make2'));

                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '客户构成饼状图分析',
                        subtext: '来自客户数据',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        left: 'center',
                        top: 'bottom',
                        data: data.data1
                    },
                    series: [
                        {
                            name: '半径模式',
                            type: 'pie',
                            radius: [20, 110],
                            center: ['25%', '50%'],
                            roseType: 'radius',
                            label: {
                                show: false
                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            },
                            data: data.data2
                        },
                        {
                            name: '面积模式',
                            type: 'pie',
                            radius: [30, 110],
                            center: ['75%', '50%'],
                            roseType: 'area',
                            data: data.data2
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        }
    },
    //生命周期- 挂载完成（可以访问DOM 元素）
    mounted() {
        this.buildCharts()
    }
}
</script>
<style></style>