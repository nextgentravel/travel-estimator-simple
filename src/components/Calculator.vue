<template>
  <div class="container">
    <MealsModal v-if="showMealsModal = true" :updateMealsAndAllowances="this.calculateMealsIncidentals" />
    <br>
    <h2>{{origin.slice(0,-3)}} to {{destination.slice(0,-3)}}, {{moment(departDate).format('MMM D')}} - {{moment(returnDate).format('D, YYYY')}}</h2>
    <br>
    <div class="row">
      <div class="col-sm-8">
        <div class="card mb-2">
          <div class="card-body">
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-5">
                <div class="form-check">
                  <input v-model="accommodationSelected" type="checkbox" class="form-check-input">
                  <label class="form-check-label" for="exampleCheck1">Accommodations</label>
                </div>
              </div>
              <div class="col-sm-5">
                  <select v-model="accommodationType" id="inputState" class="form-control">
                    <option selected>Hotel</option>
                    <option>AirBnb</option>
                    <option>Bed & Breakfast</option>
                    <option>Other</option>
                  </select>
              </div>
              <div class="col-sm-2"><input @input="accommodationSelectHandler" v-model="accommodationAmount" class="form-control" /></div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-5">
                <div class="form-check">
                  <input v-model="mealsAndIncidentalsSelected" type="checkbox" class="form-check-input">
                  <label class="form-check-label" for="exampleCheck1">Meals and Incidentals</label>
                </div>
              </div>
              <div class="col-sm-5">
                <a href="#">Select meals to include</a>
              </div>
              <div class="col-sm-2"><input @input="mealsAndIncidentalsSelectHandler" v-model="mealsAndIncidentalsAmount" class="form-control" /></div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-5">
                <div class="form-check">
                  <input v-model="transportationSelected" type="checkbox" class="form-check-input">
                  <label class="form-check-label" for="exampleCheck1">Transportation (Flight, Rail)</label>
                </div>
              </div>
              <div class="col-sm-5">
              </div>
              <div class="col-sm-2"><input @input="transportationSelectHandler" v-model="transportationAmount" class="form-control" /></div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-10">
                <div class="form-check">
                  <input v-model="groundTransportationSelected" type="checkbox" class="form-check-input">
                  <label class="form-check-label" for="exampleCheck1">Ground Transportation (Taxi, Bus, Personal Mileage)</label>
                </div>
              </div>
              <div class="col-sm-2"><input @input="groundTransportationSelectHandler" v-model="groundTransportationAmount" class="form-control" /></div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-5">
                <div class="form-check">
                  <input v-model="otherSelected" type="checkbox" class="form-check-input">
                  <label class="form-check-label" for="exampleCheck1">Other</label>
                  <small id="emailHelp" class="form-text text-muted">not included in estimate</small>
                </div>
              </div>
              <div class="col-sm-5"><input v-model="otherDescription" placeholder="Enter description" class="form-control" /></div>
              <div class="col-sm-2"><input @input="otherSelectHandler" v-model="otherAmount" class="form-control" /></div>
            </div>
            <hr>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-12">
                <button @click="calculate()" class="btn btn-primary" style="float: right;">Calculate</button>
              </div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-12">
                <p style="float: right;">${{calculatedTotal}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <h5>How did we get these numbers?</h5>
        <p>City rate limits are outlined in the <a href="#">Accommodation and Car Rental Directory</a></p>
        <p>Non-commercial accommodation, meals and incidental allowances are outlined in the <a href="#">National Joint Council Travel Directive - Appendix C</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MealsModal from './MealsModal'
export default {
  name: 'Calculator',
  components: {
    MealsModal
  },
  mounted() {
    this.setAccommodationTotal();
    this.setMealsIncidentals();
    this.calculateMealsIncidentals();
    this.accommodationSelectHandler();
    this.mealsAndIncidentalsSelectHandler();
  },
  data: function() {
    return {
      moment,
      showMealsModal: true,
    }
  },
  methods: {
    calculate: function() {
      let amount = parseFloat(this.accommodationAmount) +
                parseFloat(this.mealsAndIncidentalsAmount) +
                parseFloat(this.transportationAmount) +
                parseFloat(this.groundTransportationAmount) +
                parseFloat(this.otherAmount);
      this.calculatedTotal = amount;
    },
    setAccommodationTotal: function() {
      let amount = this.acrdRate[this.travelMonth];
      var departDate = moment(this.departDate);
      var returnDate = moment(this.returnDate);
      let numberOfDays = returnDate.diff(departDate, 'days')
      this.accommodationAmount = parseFloat(amount.replace(/\$/g, '')) * numberOfDays;
    },
    setMealsIncidentals: function() {
      var departDate = moment(this.departDate);
      var returnDate = moment(this.returnDate);
      let numberOfDays = returnDate.diff(departDate, 'days')
      let mealsByDay = [];

      for (let i = 0; i < numberOfDays + 1; i++) {
        let day = moment(departDate).add(i, 'd').format("D MMM");
        mealsByDay.push({ day: day, breakfast: true, lunch: true, dinner: true })
      }

      this.mealsByDay = mealsByDay;
    },
    calculateMealsIncidentals: function() {
          let destinationProvinceCode = this.destination.slice(-2)

          let breakfastRate = 0;
          let lunchRate = 0;
          let dinnerRate = 0;
          let incidentalRate = 0;

          if (destinationProvinceCode === "YT" || destinationProvinceCode === "TN" || destinationProvinceCode === "NU") {
            breakfastRate = this.mealsAndIncidentals[destinationProvinceCode].breakfast
            lunchRate = this.mealsAndIncidentals[destinationProvinceCode].lunch
            dinnerRate = this.mealsAndIncidentals[destinationProvinceCode].dinner
            incidentalRate = this.mealsAndIncidentals[destinationProvinceCode].incidentals
          } else {
            breakfastRate = this.mealsAndIncidentals["CAN"].breakfast
            lunchRate = this.mealsAndIncidentals["CAN"].lunch
            dinnerRate = this.mealsAndIncidentals["CAN"].dinner
            incidentalRate = this.mealsAndIncidentals["CAN"].incidentals
          }
          let mealsAndIncidentalsTotal = 0;
          console.log(this.mealsByDay)
          for (let i = 0; i < this.mealsByDay.length; i++) {
            console.log('breakfast: ', this.mealsByDay[i].breakfast)
            console.log('lunch: ', this.mealsByDay[i].lunch)
            console.log('dinner: ', this.mealsByDay[i].dinner)
            this.mealsByDay[i].breakfast ? mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + breakfastRate : null
            this.mealsByDay[i].lunch ? mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + lunchRate : null
            this.mealsByDay[i].dinner ? mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + dinnerRate : null
            mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + incidentalRate
          }

          console.log('breakfastRate', breakfastRate)
          console.log('lunchRate', lunchRate)
          console.log('dinnerRate', dinnerRate)
          console.log('incidentalRate', incidentalRate)

          this.mealsAndIncidentalsAmount = mealsAndIncidentalsTotal
          console.log('### FFF ###:', mealsAndIncidentalsTotal)

    },
    accommodationSelectHandler: function () {
      if (this.accommodationAmount > 0) {
        this.accommodationSelected = true;
      } else {
        this.accommodationSelected = false;
      }
    },
    transportationSelectHandler: function () {
      if (this.transportationAmount > 0) {
        this.transportationSelected = true;
      } else {
        this.transportationSelected = false;
      }
    },
    mealsAndIncidentalsSelectHandler: function () {
      if (this.mealsAndIncidentalsAmount > 0) {
        this.mealsAndIncidentalsSelected = true;
      } else {
        this.mealsAndIncidentalsSelected = false;
      }
    },
    groundTransportationSelectHandler: function () {
      if (this.groundTransportationAmount > 0) {
        this.groundTransportationSelected = true;
      } else {
        this.groundTransportationSelected = false;
      }
    },
    otherSelectHandler: function () {
      if (this.otherAmount > 0) {
        this.otherSelected = true;
      } else {
        this.otherSelected = false;
      }
    },


  },
  computed: {
    travelMonth () {
      return moment(this.$store.state.departDate).subtract(1, "month").startOf("month").format('MMMM')
    },
    acrdRate () {
      return this.$store.state.acrdResponse
    },
    mealsAndIncidentals () {
      return this.$store.state.mealsAndIncidentals
    },
    perDiem () {
      return this.$store.state.perDiem
    },
    origin () {
      return this.$store.state.origin
    },
    destination () {
      return this.$store.state.destination
    },
    departDate () {
      return this.$store.state.departDate
    },
    returnDate () {
      return this.$store.state.returnDate
    },
    acrdResponse () {
      return this.$store.state.acrdResponse
    },
    accommodationSelected: {
      get() {
        return this.$store.state.estimate.accommodation.selected
      },
      set(value) {
        this.$store.commit('updateAccommodationSelected', value)
      }
    },
    mealsByDay: {
      get() {
        return this.$store.state.mealsByDay
      },
      set(value) {
        this.$store.commit('updateMealsByDay', value)
      }
    },
    mealsAndIncidentalsSelected: {
      get() {
        return this.$store.state.estimate.mealsAndIncidentals.selected
      },
      set(value) {
        this.$store.commit('updateMealsAndIncidentalsSelected', value)
      }
    },
    transportationSelected: {
      get() {
        return this.$store.state.estimate.transportation.selected
      },
      set(value) {
        this.$store.commit('updateTransportationSelected', value)
      }
    },
    groundTransportationSelected: {
      get() {
        return this.$store.state.estimate.groundTransportation.selected
      },
      set(value) {
        this.$store.commit('updateGroundTransportationSelected', value)
      }
    },
    otherSelected: {
      get() {
        return this.$store.state.estimate.other.selected
      },
      set(value) {
        this.$store.commit('updateOtherSelected', value)
      }
    },
    otherDescription: {
      get() {
        return this.$store.state.estimate.other.description
      },
      set(value) {
        this.$store.commit('updateOtherDescription', value)
      }
    },
    otherAmount: {
      get() {
        return this.$store.state.estimate.other.amount
      },
      set(value) {
        this.$store.commit('updateOtherAmount', value)
      }
    },
    accommodationType: {
      get() {
        return this.$store.state.estimate.accommodation.type
      },
      set(value) {
        this.$store.commit('updateAccommodationType', value)
      }
    },
    accommodationAmount: {
      get() {
        return this.$store.state.estimate.accommodation.amount
      },
      set(value) {
        this.$store.commit('updateAccommodationAmount', value)
      }
    },
    mealsAndIncidentalsAmount: {
      get() {
        return this.$store.state.estimate.mealsAndIncidentals.amount
      },
      set(value) {
        this.$store.commit('updateMealsAndIncidentalsAmount', value)
      }
    },
    transportationAmount: {
      get() {
        return this.$store.state.estimate.transportation.amount
      },
      set(value) {
        this.$store.commit('updateTransportationAmount', value)
      }
    },
    groundTransportationAmount: {
      get() {
        return this.$store.state.estimate.groundTransportation.amount
      },
      set(value) {
        this.$store.commit('updateGroundTransportationAmount', value)
      }
    },
    calculatedTotal: {
      get() {
        return this.$store.state.calculatedTotal
      },
      set(value) {
        this.$store.commit('updateCalculatedTotal', value)
      }
    },
    accommodationTotal: {
      get() {
        return this.$store.state.accommodationTotal
      },
      set(value) {
        this.$store.commit('updateAccommodationTotal', value)
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
