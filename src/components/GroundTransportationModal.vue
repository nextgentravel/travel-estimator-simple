<template>
  <div class="modal" style="display: block;">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Title</h5>
          <button @click="showGroundTransportationModal = false" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="margin-top: 10px;">

        </div>
        <div class="modal-footer">
          <div>
            <button type="button" class="btn btn-primary" @click="showGroundTransportationModal = false">Done</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'GroundTransportationModal',
    mounted() {},
    data: function () {
      return {
        moment
      }
    },
    props: {
    //   updateMealsAndAllowances: {
    //     type: Function
    //   }
    },
    methods: {},
    computed: {
      showGroundTransportationModal: {
        get() {
          return this.$store.state.showGroundTransportationModal
        },
        set(value) {
          this.$store.commit('updateShowGroundTransportationModal', value)
        }
      },
    //   mealsByDay: {
    //     get() {
    //       return this.$store.state.mealsByDay
    //     },
    //     set(value) {
    //       this.$store.commit('updateMealsByDay', value)
    //     },
    //   },
    //   mealsAndIncidentalsAmount: {
    //     get() {
    //       return this.$store.state.estimate.mealsAndIncidentals.amount
    //     },
    //   },
    //   tripRates: {
    //     get() {
    //       return this.$store.state.tripRates
    //     },
    //   }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>