<template>
    <div id="headers">
        <div class="title">
            <div class="titleShow">
                <span class="title-one">自动化测试平台</span>
            </div>
        </div>
        <div class="menu">
            <div class="logo"></div>
            <div class="option">
          <span class="select">
            <router-link to="/companyProfile">测试需求</router-link>
          </span>
                <span class="select">
            <router-link to="/systemPlatform">用例执行</router-link>
          </span>
                <span class="select">
            <router-link to="/productService">日志管理</router-link>
          </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'headers',
    }
</script>

<style>
    a {
        text-decoration: none;
        outline: none;
        color: #000;
    }

    .title {
        height: 35px;
        width: 100%;
        background-color: #2b303b;
        color: white;
        font-size: 14px;
        line-height: 35px;
    }

    .titleShow {
        margin: 0 auto;
    }

    .title-one {
        /* margin-left: 410px; */
        cursor: pointer;
    }

    .title-two {
        float: right;
        /* margin-right: 460px; */
        cursor: pointer;
    }

    .menu {
        height: 60px;
        line-height: 62px;
        font-size: 18px;
        display: flex;
        margin: 0 auto;
        background-color: white;
    }

    .option {
        margin-left: 96px;
    }

    .select {
        color: #4a4a4a;
        border-bottom: 4px solid white;
        margin-left: 32px;
        cursor: pointer;
        padding-bottom: 5px;
    }

    #headers {

    }
</style>
