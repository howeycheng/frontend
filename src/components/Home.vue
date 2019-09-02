<template>
    <div>
        <div>
            <headerIndex></headerIndex>
        </div>
    </div>
</template>
<script>
    import headerIndex from './header'
    export default {
        name: "Home",
        components: {
            headerIndex,
        }
    }
</script>

<style media="screen">
    body{
        margin: 0 auto;
        margin: 0;
        padding: 0;
        /* overflow-x: hidden; */
    }
    #homeIndex{
        width: 100%;
        height: auto;
    }
</style>