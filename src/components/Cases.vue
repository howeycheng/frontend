<template>
    <div>
        <headers></headers>
        <div>
            {{id}}
        </div>
    </div>
</template>

<script>
    import headers from './header'

    export default {
        name: "Cases",
        components: {
            headers
        },
        data(){
            return{
                id:this.$route.query.rqid
            }
        }

    }
</script>

<style scoped>

</style>