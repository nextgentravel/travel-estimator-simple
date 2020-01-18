<template>
  <div>
    <Header />
    <div class="container">
      <MealsModal ref="modalclose" v-show="showMealsModal" :updateMealsAndAllowances="this.calculateMealsIncidentals" />
      <PersonalVehicleModal ref="modalclose" v-show="showPersonalVehicleModal" />
      <ExportModal v-if="showExportModal" />
      <br>
      <h2>{{origin.slice(0,-3)}} to {{destination.slice(0,-3)}}, {{dateFormat()}}</h2>
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
              <div v-if="accommodationType === 'Hotel'" class="row" style="margin-left: 5px; margin-top: -10px; align-items: center;">
                <div class="col-sm-12">
                  <small>Hotel city rate limit for <strong>{{destination}}</strong> on these dates is <strong>{{acrdRate[travelMonth]}}</strong> per night.</small>
                </div>
              </div>
              <div v-if="accommodationType === 'Private Accommodations'" class="row" style="margin-left: 5px; margin-top: -10px; align-items: center;">
                <div class="col-sm-12">
                  <small>The private non-commercial accommodation allowance is <strong>$50</strong> per night.</small>
                </div>
              </div>
              <div v-if="accommodationWarning" class="row" style="margin-left: 5px; margin-top: -10px; align-items: center;">
                <div class="col-sm-12">
                  <small>Your request exceeds the <a href="https://rehelv-acrd.tpsgc-pwgsc.gc.ca/acrds/preface-eng.aspx">city rate limit.</a></small>
                </div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-6">
                  <div class="form-check">
                    <input @change="calculate()" v-model="mealsAndIncidentalsSelected" type="checkbox" class="form-check-input" id="mealsAndIncidentalsSelected">
                    <label class="form-check-label" for="mealsAndIncidentalsSelected">Meals and Incidentals</label>
                  </div>
                </div>
                <div class="col-sm-4">
                  <a href="#" @click.prevent="toggleMealsModal()" style="float: right;">Select meals to include</a>
                </div>
                <div class="col-sm-2"><input @input="mealsAndIncidentalsSelectHandler" v-model="mealsAndIncidentalsAmount" class="form-control" disabled /></div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-10">
                  <div class="form-check">
                    <input @change="calculate()" v-model="transportationSelected" type="checkbox" class="form-check-input" id="transportationSelected">
                    <label class="form-check-label" for="transportationSelected">How are you getting from <strong>{{origin}}</strong> to <strong>{{destination}}</strong>? (Flight, Rail)</label>
                  </div>
                </div>
                <div class="col-sm-2"><input @input="transportationSelectHandler" v-model="transportationAmount" class="form-control" v-bind:class="{ danger: transportDanger }" /></div>
              </div>
              <div v-if="transportDanger" class="row" style="margin-left: 5px; margin-top: -25px; align-items: center;">
                <div class="col-sm-12">
                  <small class="text-danger">Add an estimated cost, or deselect this item.</small>
                </div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-12">
                  <div class="form-check">
                    <input @change="calculate()" v-model="taxiSelected" type="checkbox" class="form-check-input" id="taxiSelected">
                    <label class="form-check-label" for="taxiSelected">Transportation</label>
                  </div>
                </div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-1"></div>
                <div class="col-sm-9">
                  <div class="form-check">
                    <label class="form-check-label" for="airTravelSelected">Air Travel</label>
                  </div>
                </div>
                <div class="col-sm-2"><input @input="airTravelSelectHandler" v-model="airTravelAmount" class="form-control" v-bind:class="{ danger: airTravelDanger }" /></div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-1"></div>
                <div class="col-sm-9">
                  <div class="form-check">
                    <label class="form-check-label" for="railTravelSelected">Rail</label>
                  </div>
                </div>
                <div class="col-sm-2"><input @input="railTravelSelectHandler" v-model="railTravelAmount" class="form-control" v-bind:class="{ danger: railTravelDanger }" /></div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-1"></div>
                <div class="col-sm-9">
                  <div class="form-check">
                    <label class="form-check-label" for="carRentalSelected">Car Rental</label>
                  </div>
                </div>
                <div class="col-sm-2"><input @input="carRentalSelectHandler" v-model="carRentalAmount" class="form-control" v-bind:class="{ danger: carRentalDanger }" /></div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-1"></div>
                <div class="col-sm-9">
                  <div class="form-check">
                    <label class="form-check-label" for="taxiSelected">Taxi</label>
                  </div>
                </div>
                <div class="col-sm-2"><input @input="taxiSelectHandler" v-model="taxiAmount" class="form-control" v-bind:class="{ danger: taxiDanger }" /></div>
              </div>
              <div v-if="taxiDanger" class="row" style="margin-left: 5px; margin-top: -25px; margin-bottom: 10px; align-items: center;">
                <div class="col-sm-12">
                  <small class="text-danger">Add an estimated cost, or deselect this item.</small>
                </div>
              </div>
              <div class="row" style="margin-bottom: 15px; align-items: center;">
                <div class="col-sm-1"></div>
                <div class="col-sm-5">
                  <div class="form-check">
                    <label class="form-check-label" for="personalVehicleSelected">Personal Vehicle</label>
                  </div>
                </div>
                <div class="col-sm-4">
                  <a href="#" @click.prevent="togglePersonalVehicleModal()" style="float: right;">Help me estimate this</a>
                </div>
                <div class="col-sm-2"><input @input="personalVehicleSelectHandler" v-model="personalVehicleAmount" class="form-control" v-bind:class="{ danger: personalVehicleDanger }" /></div>
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
                  <!-- <button onclick="window.open('https://docs.google.com/forms/d/e/1FAIpQLSdhAD17ACye5P4rYfhfARCAuysri6xp_MN_ujxVxGtMuw384g/viewform?usp=sf_link','_blank');" class="btn btn-primary" style="float: right;">Submit</button> -->
                  <button @click.prevent="showExportModal = true" class="btn btn-primary" style="float: right; margin-right: 5px;">Create Printable Estimate</button>
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
    <Footer />
  </div>
</template>

<script>
import moment from 'moment'
import MealsModal from './MealsModal'
import PersonalVehicleModal from './PersonalVehicleModal'
import ExportModal from './ExportModal'
import Header from './Header'
import Footer from './Footer'
export default {
  name: 'Calculator',
  components: {
    MealsModal,
    PersonalVehicleModal,
    ExportModal,
    Header,
    Footer,
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
      transportDanger: false,
      taxiDanger: false,
      personalVehicleDanger: false,
      carRentalDanger: false,
      airTravelDanger: false,
      railTravelDanger: false,
      otherDanger: false,
    }
  },
  methods: {
    toggleMealsModal: function () {
      this.showMealsModal = true;
      this.$nextTick(() => {
        this.$refs.modalclose.$el.querySelector('input').focus();
      })
    },
    togglePersonalVehicleModal: function () {
      this.showPersonalVehicleModal = true;
      // this.$nextTick(() => {
      //   this.$refs.modalclose.$el.querySelector('input').focus();
      // })
    },
    toggleExportModal: function () {
      this.showExportModal = true;
      this.$nextTick(() => {
        this.$refs.modalclose.$el.querySelector('input').focus();
      })
    },
    dateFormat: function() {
      let startMonth = moment(this.departDate).format('M');
      let endMonth = moment(this.returnDate).format('M');
      let startYear = moment(this.departDate).format('YYYY');
      let endYear = moment(this.returnDate).format('YYYY');
      if (startYear !== endYear) {
        return `${moment(this.departDate).format('D MMM YYYY')} - ${moment(this.returnDate).format('D MMM YYYY')}`
      } else if (startMonth === endMonth) {
        return `${moment(this.departDate).format('MMM D')} - ${moment(this.returnDate).format('D, YYYY')}`
      } else {
        return `${moment(this.departDate).format('MMM D')} - ${moment(this.returnDate).format('MMM D, YYYY')}`
      }
    },
    calculatePersonalVehicle: function() {
      let result = (this.selectedKilometricRate / 100) * this.personalVehicleKilometres
      this.personalVehicleAmount = result.toFixed(2);
      this.calculate();
    },
    calculate: function() {
      let amount = 
                (this.accommodationSelected ? parseFloat(this.accommodationAmount) : 0) +
                (this.mealsAndIncidentalsSelected ? parseFloat(this.mealsAndIncidentalsAmount) : 0) +
                (this.transportationSelected ? parseFloat(this.transportationAmount) : 0) +
                (this.taxiSelected ? parseFloat(this.taxiAmount) : 0) +
                (this.personalVehicleSelected ? parseFloat(this.personalVehicleAmount) : 0) +
                (this.carRentalSelected ? parseFloat(this.carRentalAmount) : 0) +
                (this.airTravelSelected ? parseFloat(this.airTravelAmount) : 0) +
                (this.railTravelSelected ? parseFloat(this.railTravelAmount) : 0) +
                (this.otherSelected ? parseFloat(this.otherAmount) : 0);
                this.validateAccomodationTotal()
                this.validateTransportTotal()
                this.validateTaxiTotal()
                this.validatePersonalVehicleTotal()
                this.validateCarRentalTotal()
                this.validateairTravelTotal()
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
    validateTaxiTotal: function () {
      if (this.taxiSelected && (parseInt(this.taxiAmount) === 0 || isNaN(this.taxiAmount))) {
        this.taxiDanger = true;
      } else {
        this.taxiDanger = false;
      }
    },
    validatePersonalVehicleTotal: function () {
      if (this.personalVehicleSelected && (parseInt(this.personalVehicleAmount) === 0 || isNaN(this.personalVehicleAmount))) {
        this.personalVehicleDanger = true;
      } else {
        this.personalVehicleDanger = false;
      }
    },
    validateCarRentalTotal: function () {
      if (this.carRentalSelected && (parseInt(this.carRentalAmount) === 0 || isNaN(this.carRentalAmount))) {
        this.carRentalDanger = true;
      } else {
        this.carRentalDanger = false;
      }
    },
    validateairTravelTotal: function () {
      if (this.airTravelSelected && (parseInt(this.airTravelAmount) === 0 || isNaN(this.airTravelAmount))) {
        this.airTravelDanger = true;
      } else {
        this.airTravelDanger = false;
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
      let acrdRate = parseInt(this.acrdRate[this.travelMonth].replace(/\$/g, ''));
      var departDate = moment(this.departDate);
      var returnDate = moment(this.returnDate);
      let numberOfDays = returnDate.diff(departDate, 'days')
      this.accommodationRate = acrdRate;
      this.numberOfDays = numberOfDays;
      return { acrdRate, departDate, returnDate, numberOfDays }
    },
    setAccommodationTotal: function() {
      let tripInfo = this.tripInfo();
      let amount = tripInfo.acrdRate;
      if (this.accommodationType === "Private Accommodations") {
        amount = 50
      }
      if (this.accommodationAmount === null) {
        this.accommodationAmount = parseFloat(amount) * tripInfo.numberOfDays;
      }
      
      this.calculate();
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
    taxiSelectHandler: function () {
      if (this.taxiAmount > 0) {
        this.taxiSelected = true;
      } else {
        this.taxiSelected = false;
      }
      this.calculate();
    },
    personalVehicleSelectHandler: function () {
      if (this.personalVehicleAmount > 0) {
        this.personalVehicleSelected = true;
      } else {
        this.personalVehicleSelected = false;
      }
      this.personalVehicleKilometres = 0;
      this.calculate();
    },
    carRentalSelectHandler: function () {
      this.kilometres = 0;
      if (this.carRentalAmount > 0) {
        this.carRentalSelected = true;
      } else {
        this.carRentalSelected = false;
      }
      this.calculate();
    },
    airTravelSelectHandler: function () {
      if (this.airTravelAmount > 0) {
        this.airTravelSelected = true;
      } else {
        this.airTravelSelected = false;
      }
      this.calculate();
    },
    railTravelSelectHandler: function () {
      if (this.railTravelAmount > 0) {
        this.railTravelSelected = true;
      } else {
        this.railTravelSelected = false;
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
    transportation () {
      return this.$store.state.estimate.transportation
    },
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
    accommodationWarning: {
      get() {
        return this.$store.state.accommodationWarning
      },
      set(value) {
        this.$store.commit('updateAccommodationWarning', value)
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
    showPersonalVehicleModal: {
      get() {
        return this.$store.state.showPersonalVehicleModal
      },
      set(value) {
        this.$store.commit('updateShowPersonalVehicleModal', value)
      }
    },
    showExportModal: {
      get() {
        return this.$store.state.showExportModal
      },
      set(value) {
        this.$store.commit('updateShowExportModal', value)
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
    accommodationRate: {
      get() {
        return this.$store.state.estimate.accommodation.rate
      },
      set(value) {
        this.$store.commit('updateAccommodationRate', value)
      }
    },
    numberOfDays: {
      get() {
        return this.$store.state.estimate.accommodation.numberOfDays
      },
      set(value) {
        this.$store.commit('updateNumberOfDays', value)
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
    taxiSelected: {
      get() {
        return this.$store.state.estimate.taxi.selected
      },
      set(value) {
        this.$store.commit('updateTaxiSelected', value)
      }
    },
    personalVehicleSelected: {
      get() {
        return this.$store.state.estimate.personalVehicle.selected
      },
      set(value) {
        this.$store.commit('updatePersonalVehicleSelected', value)
      }
    },
    carRentalSelected: {
      get() {
        return this.$store.state.estimate.carRental.selected
      },
      set(value) {
        this.$store.commit('updateCarRentalSelected', value)
      }
    },
    airTravelSelected: {
      get() {
        return this.$store.state.estimate.airTravel.selected
      },
      set(value) {
        this.$store.commit('updateAirTravelSelected', value)
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
    taxiAmount: {
      get() {
        return this.$store.state.estimate.taxi.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateTaxiAmount', parseFloat(value))
      }
    },
    personalVehicleAmount: {
      get() {
        return this.$store.state.estimate.personalVehicle.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updatePersonalVehicleAmount', parseFloat(value))
      }
    },
    kilometricRates: {
      get() {
        return this.$store.state.estimate.personalVehicle.rates
      },
    },
    selectedKilometricRate: {
      get() {
        console.log(this.$store.state.estimate.personalVehicle.selectedRate)
        return this.$store.state.estimate.personalVehicle.selectedRate
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updatePersonalVehicleRate', parseFloat(value))
      }
    },
    carRentalAmount: {
      get() {
        return this.$store.state.estimate.carRental.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateCarRentalAmount', parseFloat(value))
      }
    },
    personalVehicleKilometres: {
      get() {
        return this.$store.state.estimate.personalVehicle.kilometres
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updatePersonalVehicleKilometres', parseFloat(value))
      }
    },
    airTravelAmount: {
      get() {
        return this.$store.state.estimate.airTravel.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateAirTravelAmount', parseFloat(value))
      }
    },
    railTravelAmount: {
      get() {
        return this.$store.state.estimate.railTravel.amount
      },
      set(value) {
        if (isNaN(parseFloat(value))) { value = 0 }
        this.$store.commit('updateRailTravelAmount', parseFloat(value))
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
.modal-body {
position: relative;
padding: 20px;
height: 200px;
overflow-y: scroll;
}
</style>
