<template>
    <div>
        <div>
            <headers></headers>
            <requirement></requirement>
        </div>
    </div>
</template>
<script>
    import headers from './header'
    import requirement from "./Requirement";
    export default {
        name: "Home",
        components: {
            requirement,
            headers
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