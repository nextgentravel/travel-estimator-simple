<template>
  <div class="container">
    <MealsModal v-if="showMealsModal" :updateMealsAndAllowances="this.calculateMealsIncidentals" />
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
                  <input @change="calculate()" v-model="accommodationSelected" type="checkbox" class="form-check-input" id="accommodationSelected">
                  <label class="form-check-label" for="accommodationSelected">Accommodations</label>
                </div>
              </div>
              <div class="col-sm-5">
                  <select @change="setAccommodationTotal" v-model="accommodationType" id="inputState" class="form-control">
                    <option selected>Hotel</option>
                    <option>Private Accommodations</option>
                  </select>
              </div>
              <div class="col-sm-2">
                <input @input="accommodationSelectHandler" v-model="accommodationAmount" class="form-control" v-bind:class="{ warning: accommodationWarning }" />
              </div>
            </div>
            <div class="row" style="margin-left: 5px; margin-top: -10px; align-items: center;">
              <div class="col-sm-12">
                <small>City rate limit for <strong>{{destination}}</strong> on these dates is <strong>{{acrdRate[travelMonth]}}</strong> per night.</small>
              </div>
            </div>
            <div v-if="accommodationWarning" class="row" style="margin-left: 5px; margin-top: -10px; align-items: center;">
              <div class="col-sm-12">
                <small>Your request exceeds the <a href="https://rehelv-acrd.tpsgc-pwgsc.gc.ca/acrds/preface-eng.aspx">city rate limit.</a></small>
              </div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-5">
                <div class="form-check">
                  <input @change="calculate()" v-model="mealsAndIncidentalsSelected" type="checkbox" class="form-check-input" id="mealsAndIncidentalsSelected">
                  <label class="form-check-label" for="mealsAndIncidentalsSelected">Meals and Incidentals</label>
                </div>
              </div>
              <div class="col-sm-5">
                <a href="#" @click="showMealsModal = true">Select meals to include</a>
              </div>
              <div class="col-sm-2"><input @input="mealsAndIncidentalsSelectHandler" v-model="mealsAndIncidentalsAmount" class="form-control" disabled /></div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-5">
                <div class="form-check">
                  <input @change="calculate()" v-model="transportationSelected" type="checkbox" class="form-check-input" id="transportationSelected">
                  <label class="form-check-label" for="transportationSelected">Transportation (Flight, Rail)</label>
                </div>
              </div>
              <div class="col-sm-5">
              </div>
              <div class="col-sm-2"><input @input="transportationSelectHandler" v-model="transportationAmount" class="form-control" v-bind:class="{ danger: transportDanger }" /></div>
            </div>
            <div v-if="transportDanger" class="row" style="margin-left: 5px; margin-top: -25px; align-items: center;">
              <div class="col-sm-12">
                <small class="text-danger">Add an estimated cost, or deselect this item.</small>
              </div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-10">
                <div class="form-check">
                  <input @change="calculate()" v-model="groundTransportationSelected" type="checkbox" class="form-check-input" id="groundTransportationSelected">
                  <label class="form-check-label" for="groundTransportationSelected">Ground Transportation (Taxi, Bus, Personal Mileage)</label>
                </div>
              </div>
              <div class="col-sm-2"><input @input="groundTransportationSelectHandler" v-model="groundTransportationAmount" class="form-control" v-bind:class="{ danger: groundTransportationDanger }" /></div>
            </div>
            <div v-if="groundTransportationDanger" class="row" style="margin-left: 5px; margin-top: -25px; margin-bottom: 10px; align-items: center;">
              <div class="col-sm-12">
                <small class="text-danger">Add an estimated cost, or deselect this item.</small>
              </div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-5">
                <div class="form-check">
                  <input @change="calculate()" v-model="otherSelected" type="checkbox" class="form-check-input" id="otherSelected">
                  <label class="form-check-label" for="otherSelected">Other</label>
                </div>
              </div>
              <div class="col-sm-5"><input v-model="otherDescription" placeholder="Enter description" class="form-control" /></div>
              <div class="col-sm-2"><input @input="otherSelectHandler" v-model="otherAmount" class="form-control" v-bind:class="{ danger: otherDanger }" /></div>
            </div>
            <div v-if="otherDanger" class="row" style="margin-left: 5px; margin-top: -15px; align-items: center;">
              <div class="col-sm-12">
                <small class="text-danger">Add an estimated cost, or deselect this item.</small>
              </div>
            </div>
            <hr>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-12">
                <p style="float: right; font-size: 1.5em;" v-bind:class="{ warningText: accommodationWarning }">${{calculatedTotal}}</p>
              </div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;" v-if="accommodationWarning">
              <div class="col-sm-12">
                <p>Warning - One of your requests exceeds established rates. You may want to add a note to your approver to explain your choice, or change the value above.</p>
                <div class="form-group">
                  <label for="noteToApprover" class="">Note to Approver</label>
                  <textarea v-model="noteToApprover" class="form-control" id="noteToApprover" rows="3"></textarea>
                </div>
              </div>
            </div>
            <div class="row" style="margin-bottom: 15px; align-items: center;">
              <div class="col-sm-12">

                
                <button onclick="window.open('https://docs.google.com/forms/d/e/1FAIpQLSdhAD17ACye5P4rYfhfARCAuysri6xp_MN_ujxVxGtMuw384g/viewform?usp=sf_link','_blank');" class="btn btn-primary" style="float: right;">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <h5>How did we get these numbers?</h5>
        <p>City rate limits are outlined in the <a href="https://rehelv-acrd.tpsgc-pwgsc.gc.ca/acrds/preface-eng.aspx">Accommodation and Car Rental Directory</a></p>
        <p>Non-commercial accommodation, meals and incidental allowances are outlined in the <a href="https://www.njc-cnm.gc.ca/directive/d10/v238/s659/en">National Joint Council Travel Directive - Appendix C</a></p>
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
      accommodationWarning: false,
      transportDanger: false,
      groundTransportationDanger: false,
      otherDanger: false,
    }
  },
  methods: {
    calculate: function() {
      let amount = 
                (this.accommodationSelected ? parseFloat(this.accommodationAmount) : 0) +
                (this.mealsAndIncidentalsSelected ? parseFloat(this.mealsAndIncidentalsAmount) : 0) +
                (this.transportationSelected ? parseFloat(this.transportationAmount) : 0) +
                (this.groundTransportationSelected ? parseFloat(this.groundTransportationAmount) : 0) +
                (this.otherSelected ? parseFloat(this.otherAmount) : 0);
                this.validateAccomodationTotal()
                this.validateTransportTotal()
                this.validateGroundTransportationTotal()
                this.validateOtherTotal()
      this.calculatedTotal = amount.toFixed(2);
    },
    validateAccomodationTotal: function () {
      let tripInfo = this.tripInfo();
      if (this.accommodationAmount > (tripInfo.acrdRate * tripInfo.numberOfDays) && this.accommodationSelected) {
        this.accommodationWarning = true;
      } else {
        this.accommodationWarning = false;
      }
    },
    validateTransportTotal: function () {
      if (this.transportationSelected && parseInt(this.transportationAmount) === 0) {
        this.transportDanger = true;
      } else {
        this.transportDanger = false;
      }
    },
    validateGroundTransportationTotal: function () {
      if (this.groundTransportationSelected && (parseInt(this.groundTransportationAmount) === 0 || isNaN(this.groundTransportationAmount))) {
        this.groundTransportationDanger = true;
      } else {
        this.groundTransportationDanger = false;
      }
    },
    validateOtherTotal: function () {
      if (this.otherSelected && parseInt(this.otherAmount) === 0) {
        this.otherDanger = true;
      } else {
        this.otherDanger = false;
      }
    },
    tripInfo: function () {
      console.log('#### ', this.acrdRate)
      let acrdRate = parseInt(this.acrdRate[this.travelMonth].replace(/\$/g, ''));
      var departDate = moment(this.departDate);
      var returnDate = moment(this.returnDate);
      let numberOfDays = returnDate.diff(departDate, 'days')
      return { acrdRate, departDate, returnDate, numberOfDays }
    },
    setAccommodationTotal: function() {
      let tripInfo = this.tripInfo();
      let amount = tripInfo.acrdRate;
      if (this.accommodationType === "Private Accommodations") {
        amount = 50
      }
      this.accommodationAmount = parseFloat(amount) * tripInfo.numberOfDays;
    },
    setMealsIncidentals: function() {
      var departDate = moment(this.departDate);
      var returnDate = moment(this.returnDate);
      let numberOfDays = returnDate.diff(departDate, 'days')
      let mealsByDay = [];

      for (let i = 0; i < numberOfDays + 1; i++) {
        let day = moment(departDate).add(i, 'd').format("MMM D");
        mealsByDay.push({ day: day, breakfast: true, lunch: true, dinner: true, incidental: true })
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
          for (let i = 0; i < this.mealsByDay.length; i++) {
            this.mealsByDay[i].breakfast ? mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + breakfastRate : null
            this.mealsByDay[i].lunch ? mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + lunchRate : null
            this.mealsByDay[i].dinner ? mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + dinnerRate : null
            this.mealsByDay[i].incidental ? mealsAndIncidentalsTotal = mealsAndIncidentalsTotal + incidentalRate : null
          }

          let tripRates = {
            breakfastRate,
            lunchRate,
            dinnerRate,
            incidentalRate
          }

          this.tripRates = tripRates;

          this.mealsAndIncidentalsAmount = mealsAndIncidentalsTotal.toFixed(2)
          this.calculate();

    },
    accommodationSelectHandler: function () {
      if (this.accommodationAmount > 0) {
        this.accommodationSelected = true;
      } else {
        this.accommodationSelected = false;
      }
      this.calculate();
    },
    transportationSelectHandler: function () {
      if (this.transportationAmount > 0) {
        this.transportationSelected = true;
      } else {
        this.transportationSelected = false;
      }
      this.calculate();
    },
    mealsAndIncidentalsSelectHandler: function () {
      if (this.mealsAndIncidentalsAmount > 0) {
        this.mealsAndIncidentalsSelected = true;
      } else {
        this.mealsAndIncidentalsSelected = false;
      }
      this.calculate();
    },
    groundTransportationSelectHandler: function () {
      if (this.groundTransportationAmount > 0) {
        this.groundTransportationSelected = true;
      } else {
        this.groundTransportationSelected = false;
      }
      this.calculate();
    },
    otherSelectHandler: function () {
      if (this.otherAmount > 0) {
        this.otherSelected = true;
      } else {
        this.otherSelected = false;
      }
      this.calculate();
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
    noteToApprover: {
      get() {
        return this.$store.state.noteToApprover
      },
      set(value) {
        this.$store.commit('updateNoteToApprover', value)
      }
    },
    showMealsModal: {
      get() {
        return this.$store.state.showMealsModal
      },
      set(value) {
        this.$store.commit('updateShowMealsModal', value)
      }
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
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateOtherAmount', parseFloat(value))
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
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateAccommodationAmount', parseFloat(value))
      }
    },
    tripRates: {
      get() {
        return this.$store.state.tripRates
      },
      set(value) {
        this.$store.commit('updateTripRates', value)
      }
    },
    mealsAndIncidentalsAmount: {
      get() {
        return this.$store.state.estimate.mealsAndIncidentals.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateMealsAndIncidentalsAmount', parseFloat(value))
      }
    },
    transportationAmount: {
      get() {
        return this.$store.state.estimate.transportation.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateTransportationAmount', parseFloat(value))
      }
    },
    groundTransportationAmount: {
      get() {
        return this.$store.state.estimate.groundTransportation.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateGroundTransportationAmount', parseFloat(value))
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

.warning {
  border: 2px solid #FEC04F;
}

.warning:focus {
  content: none !important;
  -webkit-box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 2px #FEC04F;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 0px 2px #FEC04F;
}

.danger {
  border: 2px solid #FF0000;
}

.danger:focus {
  content: none !important;
  -webkit-box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 2px #FF0000;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 0px 2px #FF0000;
}


.warningText {
  color: #FEC04F;
}

.dangerText {
  color: #FF0000;
}

</style>
