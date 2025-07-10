<template>
    <div>
         <Welcome />
         <div class="container d-flex  flex-column flex-md-row  ">  
             <Cards class="m-3" />
             <OfferTransCard />
            
         </div>
  
       <div class="container">  

           <StatsGridUser />
           <RecentActivity />
            <Stars />
           <QuickStats />

       </div>
        
    </div>
</template>

<script>
    export default {

        data() {
            return {
                
            }
        },
        methods: {
            
        }   
    }
</script>

<style lang="scss" scoped>

</style>