<template>
  <div>
    <el-row :gutter="10" type="flex" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>当前用户总数</span>
          </div>
          <div>
            <span>{{ userNum }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>当前用户总数</span>
          </div>
          <div ref="userDataWrapper">
            <div
              ref="userData"
              :style="{
                height: userDataChartsSize.height + 'px',
                width: userDataChartsSize.width + 'px',
              }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" type="flex" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>当前博客总数</span>
          </div>
          <div>
            <span>{{ blogNum }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>当前用户总数</span>
          </div>
          <div ref="blogDataWrapper">
            <div
              ref="blogData"
              :style="{
                height: blogDataChartsSize.height + 'px',
                width: blogDataChartsSize.width + 'px',
              }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-bottom: 20px">
      <el-col :span="24">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>用户位置分布</span>
          </div>
          <div ref="visitorDataWrapper" style="overflow:hidden">
            <div
              ref="visitorData"
              :style="{
                height: visitorDataChartsSize.height + 'px',
                width: visitorDataChartsSize.width + 'px',
                margin: 'auto',               
              }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
     <el-row :gutter="10">
      <el-col :span="24">
       <el-table :data="visitorData">
         <el-table-column
          prop="ip"
          label="ip"
         ></el-table-column>
         <el-table-column
          prop="province"
          label="省份"
         ></el-table-column>
         <el-table-column
          prop="city"
          label="城市"
         ></el-table-column>
         <el-table-column
          prop="visitTime"
          label="访问时间"
         ></el-table-column>
         <el-table-column
          prop="location"
          label="用户坐标"
         ></el-table-column>
       </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 第一步, 要引入百度地图
import "echarts/extension/bmap/bmap";
import AuthorService from "@/service/AuthorService";
import BlogService from "@/service/BlogService";
import WebsiteService from "@/service/WebsiteService";
export default {
  name: "DBA",
  data() {
    let vm = this;
    return {
      totalNum:0,
      visitorData:[],
      searchParams:{
        offset:0,
        limit:10
      },
      userNum: 0,
      userDataChartsSize: {
        height: 300,
        width: 600,
      },
      userDataOptions: {
        xAxis: {
          type: "time",
          axisLabel: {
            formatter: function (v) {
              return vm.$echarts.format.formatTime(
                "yyyy-MM-dd hh:mm",
                new Date(v)
              );
            },
          },
        },
        yAxis: {
          type: "value",
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: 90,
            end: 100,
          },
          {
            type: "inside",
            show: true,
            xAxisIndex: [0],
            start: 90,
            end: 100,
          },
        ],
        series: [
          {
            type: "line",
            data: [],
            smooth: true,
          },
        ],
      },
      userDataCharts: null,
      blogNum: 0,
      blogDataChartsSize: {
        height: 300,
        width: 600,
      },
      blogDataOptions: {
        xAxis: {
          type: "time",
          axisLabel: {
            formatter: function (v) {
              return vm.$echarts.format.formatTime(
                "yyyy-MM-dd hh:mm",
                new Date(v)
              );
            },
          },
        },
        yAxis: {
          type: "value",
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: [0],
            start: 90,
            end: 100,
          },
          {
            type: "inside",
            xAxisIndex: [0],
          },
        ],
        series: [
          {
            type: "line",
            data: [],
            smooth: true,
          },
        ],
      },
      blogDataCharts: null,
      visitorDataChartsSize: {
        height: 300,
        width: 600,
      },
      // 第二步: 百度地图的参数配置
      visitorDataOptions: {
        bmap: {
          center: [114, 28],
          zoom: 5,
          roam: true,
        },
        series: {
          type: "effectScatter",
          data: [[113, 27]],
          coordinateSystem: "bmap",
        },
      },
      visitorDataCharts: null,
    };
  },
  mounted() {
    this.userDataChartsSize.width = this.$refs.userDataWrapper.clientWidth;
    this.userDataChartsSize.height =
      this.$refs.userDataWrapper.clientWidth * 0.3;
    AuthorService.getUserRegisterInfo().then((rs) => {
      if (rs.data.status === 200) {
        this.userNum = rs.data.data.userInfo.length;
        let timeData = [];
        for (let i = 0; i < rs.data.data.userInfo.length; i++) {
          timeData.push([rs.data.data.userInfo[i].createTime, 1]);
        }
        this.userDataOptions.series[0].data = timeData;
        this.userDataCharts = this.$echarts.init(this.$refs.userData);
        this.userDataCharts.setOption(this.userDataOptions);
      }
    });

    this.blogDataChartsSize.width = this.$refs.blogDataWrapper.clientWidth;
    this.blogDataChartsSize.height =
      this.$refs.blogDataWrapper.clientWidth * 0.3;
    BlogService.getBlogInfo().then((rs) => {
      if (rs.data.status === 200) {
        this.blogNum = rs.data.data.blogInfo.length;
        let timeData = [];
        for (let i = 0; i < rs.data.data.blogInfo.length; i++) {
          timeData.push([new Date(rs.data.data.blogInfo[i].lastModified), 1]);
        }
        this.blogDataOptions.series[0].data = timeData;
        this.blogDataCharts = this.$echarts.init(this.$refs.blogData);
        this.blogDataCharts.setOption(this.blogDataOptions);
      }
    });

    this.visitorDataChartsSize.width = this.$refs.visitorDataWrapper.clientWidth;
    this.visitorDataChartsSize.height =
      this.$refs.visitorDataWrapper.clientWidth * 0.3;
    WebsiteService.getWebSiteData(this.searchParams).then(rs=>{
      this.visitorData=rs.data.data.visitorData;
      this.totalNum=rs.data.data.totalNum;
      for(let i=0;i<rs.data.data.visitorData.length;i++){
        this.visitorDataOptions.series[0].data.push(rs.data.data.visitorData[i].location)
      }
      this.visitorDataCharts = this.$echarts.init(this.$refs.visitorData);
      this.visitorDataCharts.setOption(this.visitorDataOptions);
      let bmap = this.visitorDataCharts
        .getModel()
        .getComponent("bmap")
        .getBMap(); // 获取百度地图实例
      bmap.setMapStyleV2({
        styleId: "f0744950d4a467f7ff7039b8b504e55d",
      });
    })
  },
};
</script>

<style>
.ec-extension-bmap{
    width: 300px;
    height:200px;
    overflow: hidden;
}
.ec-extension-bmap div{
    width: 300px;
    height:200px;
    overflow: hidden;
}
</style>