<template>
    <div class="modal" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">De-select any meals that will be provided during your trip</h5>
                <button type="button" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row" v-for="(day, index) in mealsByDay" :key="`day-${index}`">
                    <div class="col-sm"><strong>{{day.day}}</strong></div>
                    <div class="col-sm"><input v-model="mealsByDay[index].breakfast" @change="updateMealsAndAllowances" type="checkbox" class="form-check-input"> Breakfast</div>
                    <div class="col-sm"><input v-model="mealsByDay[index].lunch" @change="updateMealsAndAllowances" type="checkbox" class="form-check-input"> Lunch</div>
                    <div class="col-sm"><input v-model="mealsByDay[index].dinner" @change="updateMealsAndAllowances" type="checkbox" class="form-check-input"> Dinner</div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="showMealsModal = false">Close</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'MealsModal',
  mounted() {
  },
  data: function() {
    return {
      moment
    }
  },
  props: {
    updateMealsAndAllowances: {
      type: Function
    }
  },  
  methods: {
  },
  computed: {
    showMealsModal: {
      get() {
        return this.$store.state.showMealsModal
      },
      set(value) {
        this.$store.commit('updateShowMealsModal', value)
      }
    },
    mealsByDay: {
      get() {
        return this.$store.state.mealsByDay
      },
      set(value) {
        this.$store.commit('updateMealsByDay', value)
      },
    },
    mealsAndIncidentalsAmount: {
      get() {
        return this.$store.state.estimate.mealsAndIncidentals.amount
      },
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
