<template id="guanwangfoot">
  <div class="guanwangfoot">
    <div class="footContent">
      <div class="jump">
        <div class="jumpleft">
          <p @click = gohome()>首页</p>
          <p @click = gocompanyProfile()>公司介绍</p>
          <p @click = gosystemPlatform()>系统平台</p>
        </div>
        <div class="jumpright">
          <p @click = goproductService()>产品服务</p>
          <p @click = goofflineStore()>线下门店</p>
          <p @click = goappDownload()>应用下载</p>
        </div>
      </div>
      <div class="info">
        <p>公司：北京爱康云医疗科技有限公司</p>
        <p>邮箱：</p>
        <p>地址：</p>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  methods:{
    gohome(){
      this.$router.push({name:"home"})
    },
    gocompanyProfile(){
      this.$router.push({name:"companyProfile"})
    },
    gosystemPlatform(){
      this.$router.push({name:"systemPlatform"})
    },
    goproductService(){
      this.$router.push({name:"productService"})
    },
    goofflineStore(){
      this.$router.push({name:"offlineStore"})
    },
    goappDownload(){
      this.$router.push({name:"appDownload"})
    }


  }
}

</script>
<style media="screen">
.guanwangfoot{
  width: 100%;
  height: 250px;
  background-color: #775979;
}
.footContent{
  padding-top: 75px;
  width: 1000px;
  margin:  0 auto;
  display: flex;
  color: #fff;
}
.jump{
  display: flex;
  height: 85px;
}
.jump p{
  line-height: 27px;
  cursor: pointer;
}
.jumpright{
  margin-left: 68px;
  border-right: 1px solid #fff;
  padding-right: 60px;
}
.jumpright p{
  line-height: 27px;
  cursor: pointer;
}
.info{
  margin-left: 60px;
}
.info p{
  line-height: 27px;
}
.QRcode{
  display: flex;
  margin-left: 150px;
  font-size: 14px;
}
.QRcoderight{
  margin-left: 55px;
}

</style>
