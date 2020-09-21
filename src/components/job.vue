<template>
    <div>
        <headers activeIndex='/job'></headers>




    </div>
</template>

<script>
    import headers from './header'

    export default {
        name: "job",
        components: {
            headers,
        },
        data() {
            return {
                percentage: this.GLOBAL.jobPercentage[0],

            }


        }
    }
</script>

<style scoped>

</style>