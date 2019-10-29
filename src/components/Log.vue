<template>
    <div>
        <headers activeIndex = '/log'></headers>
        <div>

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
            value1: false
        }
    }
</script>

<style>

</style>