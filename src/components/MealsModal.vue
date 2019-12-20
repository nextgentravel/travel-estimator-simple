<template>
  <div class="modal" role="dialog" tabindex="-1" style="display: block;">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">De-select any meals that will be provided during your trip</h5>
          <button @click="showMealsModal = false" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="margin-top: 10px;">
          <div class="row mb-3" v-for="(day, index) in mealsByDay" :key="`day-${index}`">
            <div class="col-sm"><strong>{{day.day}}</strong></div>
            <div class="col-sm"><input v-bind:id="'breakfast' + index" v-model="mealsByDay[index].breakfast"
                @change="updateMealsAndAllowances" type="checkbox" class="form-check-input"> <label
                v-bind:for="'breakfast' + index">Breakfast <small>(${{tripRates.breakfastRate.toFixed(2)}})</small></label></div>
            <div class="col-sm"><input v-bind:id="'lunch' + index" v-model="mealsByDay[index].lunch"
                @change="updateMealsAndAllowances" type="checkbox" class="form-check-input"> <label
                v-bind:for="'lunch' + index">Lunch <small>(${{tripRates.lunchRate.toFixed(2)}})</small></label></div>
            <div class="col-sm"><input v-bind:id="'dinner' + index" v-model="mealsByDay[index].dinner"
                @change="updateMealsAndAllowances" type="checkbox" class="form-check-input"> <label
                v-bind:for="'dinner' + index">Dinner <small>(${{tripRates.dinnerRate.toFixed(2)}})</small></label></div>
            <div class="col-sm"><input v-bind:id="'incidental' + index" v-model="mealsByDay[index].incidental"
                @change="updateMealsAndAllowances" type="checkbox" class="form-check-input"> <label
                v-bind:for="'incidental' + index">Incidental <small>(${{tripRates.incidentalRate.toFixed(2)}})</small></label></div>
          </div>
        </div>
        <div class="modal-footer">
          <div>
            <div style="margin-bottom: 10px;">${{mealsAndIncidentalsAmount.toFixed(2)}}</div>
            <button type="button" class="btn btn-primary" @click="showMealsModal = false">Done</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'MealsModal',
    mounted() {},
    data: function () {
      return {
        moment
      }
    },
    props: {
      updateMealsAndAllowances: {
        type: Function
      }
    },
    methods: {},
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
      },
      tripRates: {
        get() {
          return this.$store.state.tripRates
        },
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>