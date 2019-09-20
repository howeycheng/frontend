<template>
    <div>
        <div>
            <headers></headers>
        </div>
    </div>
</template>
<script>
    import headers from './header'

    export default {
        name: "Home",
        components: {
            headers,
        }
    }
</script>

<style media="screen">
    body {
        margin: 0 auto;
        padding: 0;
        /* overflow-x: hidden; */
    }

    #homeIndex {
        width: 100%;
        height: auto;
    }
</style>