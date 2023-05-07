<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div id="serve1" style="width: 100%;min-height:500px"></div>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span="24">
                <div id="serve2" style="width: 100%;min-height:500px"></div>
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
            let { data } = await request.get("serve/countByMyd1");
            if (data.code === 200) {
                // 指定图表的配置项和数据
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('serve1'));

                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}'
                    },
                    xAxis: {
                        type: 'category',
                        data: data.data1
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: '客户满意度',
                        type: 'bar',
                        data: data.data2
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);

            }
        },
        async buildMake2() {
            let { data } = await request.get("serve/countByMyd2");
            if (data.code === 200) {
                var myChart = echarts.init(document.getElementById('serve2'));

                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '客户满意度分布饼图',
                        // subtext: '',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: '客户满意度',
                            type: 'pie',
                            radius: '50%',
                            data: data.data,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
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