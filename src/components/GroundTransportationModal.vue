<template>
  <div class="modal" style="display: block;">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Estimate the cost of ground transportation</h5>
          <button @click="showGroundTransportationModal = false" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="margin-top: 10px;">
          <div class="row mb-3">
            <div class="col-sm-6">
              <strong>Home</strong> to <strong>{{origin.slice(0,-3)}}</strong> port or station.
              <br>
              <small v-if="homeToOriginType === 'Taxi'">A taxi may cost <strong>~$25.</strong></small>
              <small v-if="homeToOriginType === 'Transit'">A transit pass may cost <strong>~$9.</strong></small>
              <small v-if="homeToOriginType === 'Personal Vehicle'">You may claim <strong>.54c</strong> per kilometre.</small>
            </div>
            <div class="col-sm-3">
              <select v-model="homeToOriginType" id="inputState" class="form-control">
                <option selected>Taxi</option>
                <option>Personal Vehicle</option>
                <option>Transit</option>
              </select>
            </div>
            <div class="col-sm-2">
              <input @change="setGroundTransportationTotal" v-model="homeToOriginAmount" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <strong>{{destination.slice(0,-3)}}</strong> port or station to <strong>accommodation.</strong>
              <br>
              <small v-if="destinationToAccommodationType === 'Taxi'">A taxi may cost <strong>~$55.</strong></small>
              <small v-if="destinationToAccommodationType === 'Transit'">A transit pass may cost <strong>~$12 per day.</strong></small>
              <small v-if="destinationToAccommodationType === 'Rental Car'">A rental may cost <strong>~$107 per day.</strong></small>
            </div>
            <div class="col-sm-3">
              <select v-model="destinationToAccommodationType" id="inputState" class="form-control">
                <option selected>Taxi</option>
                <option>Transit</option>
                <option>Rental Car</option>
              </select>
            </div>
            <div class="col-sm-2">
              <input @change="setGroundTransportationTotal" v-model="destinationToAccommodationAmount" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              Estimated daily ground transportation.
              <br>
              <small v-if="dailyTransportationType === 'Taxi'">A taxi may cost <strong>~$12 each way.</strong></small>
              <small v-if="dailyTransportationType === 'Transit'">A transit pass may cost <strong>~$12 per day.</strong></small>
              <small v-if="dailyTransportationType === 'Rental Car'">A rental may cost <strong>~$107 per day.</strong></small>
            </div>
            <div class="col-sm-3">
              <select v-model="dailyTransportationType" id="inputState" class="form-control">
                <option selected>Taxi</option>
                <option>Transit</option>
                <option>Rental Car</option>
              </select>
            </div>
            <div class="col-sm-2">
              <input @change="setGroundTransportationTotal" v-model="dailyTransportationAmount" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <strong>{{destination.slice(0,-3)}}</strong> <strong>accommodation</strong> to port or station.
              <br>
              <small v-if="accommodationToDestinationType === 'Taxi'">A taxi may cost <strong>~$55.</strong></small>
              <small v-if="accommodationToDestinationType === 'Transit'">A transit pass may cost <strong>~$12 per day.</strong></small>
              <small v-if="accommodationToDestinationType === 'Rental Car'">A rental may cost <strong>~$107 per day.</strong></small>
            </div>
            <div class="col-sm-3">
              <select v-model="accommodationToDestinationType" id="inputState" class="form-control">
                <option selected>Taxi</option>
                <option>Transit</option>
                <option>Rental Car</option>
              </select>
            </div>
            <div class="col-sm-2">
              <input @change="setGroundTransportationTotal" v-model="accommodationToDestinationAmount" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <strong>{{origin.slice(0,-3)}}</strong> port or station to <strong>home</strong>.
              <br>
              <small v-if="originToHomeType === 'Transit'">A transit pass may cost <strong>~$9.</strong></small>
              <small v-if="originToHomeType === 'Taxi'">A taxi may cost <strong>~$25.</strong></small>
              <small v-if="originToHomeType === 'Personal Vehicle'">You may claim <strong>.54c</strong> per kilometre</small>
              <small v-if="originToHomeType === 'Rental Car'">A rental may cost <strong>~$78.</strong><br><span class="text-danger">Are you sure you want to rent a car for in {{origin}}?</span></small>
            </div>
            <div class="col-sm-3">
              <select v-model="originToHomeType" id="inputState" class="form-control">
                <option selected>Taxi</option>
                <option>Personal Vehicle</option>
                <option>Transit</option>
              </select>
            </div>
            <div class="col-sm-2">
              <input @change="setGroundTransportationTotal" v-model="originToHomeAmount" class="form-control" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div>
            <div style="margin-bottom: 10px;">${{groundTransportationAmount.toFixed(2)}}</div>
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
    mounted() {
      this.setGroundTransportationTotal();
    },
    data: function () {
      return {
        moment
      }
    },
    props: {
      setGroundTransportationTotal: {
        type: Function
      }
    },
    methods: {
      
    },
    computed: {
      groundTransportationAmount: {
        get() {
          return this.$store.state.estimate.groundTransportation.amount
        },
      },
      showGroundTransportationModal: {
        get() {
          return this.$store.state.showGroundTransportationModal
        },
        set(value) {
          this.$store.commit('updateShowGroundTransportationModal', value)
        }
      },
      origin: {
        get() {
          return this.$store.state.origin
        },
        set(value) {
          this.$store.commit('updateOrigin', value)
        },
      },
      destination: {
        get() {
          return this.$store.state.destination
        },
        set(value) {
          this.$store.commit('updateDestination', value)
        },
      },
      homeToOriginType: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.homeToOriginType
        },
        set(value) {
          this.$store.commit('updateHomeToOriginType', value)
        },
      },
      homeToOriginAmount: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.homeToOriginAmount
        },
        set(value) {
          if (isNaN(parseFloat(value))) { value = 0 }
          this.$store.commit('updateHomeToOriginAmount', parseFloat(value))
        },
      },
      destinationToAccommodationType: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.destinationToAccommodationType
        },
        set(value) {
          this.$store.commit('updateDestinationToAccommodationType', value)
        },
      },
      destinationToAccommodationAmount: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.destinationToAccommodationAmount
        },
        set(value) {
          if (isNaN(parseFloat(value))) { value = 0 }
          this.$store.commit('updateDestinationToAccommodationAmount', parseFloat(value))
        },
      },
      dailyTransportationType: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.dailyTransportationType
        },
        set(value) {
          this.$store.commit('updateDailyTransportationType', value)
        },
      },
      dailyTransportationAmount: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.dailyTransportationAmount
        },
        set(value) {
          if (isNaN(parseFloat(value))) { value = 0 }
          this.$store.commit('updateDailyTransportationAmount', parseFloat(value))
        },
      },
      accommodationToDestinationType: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.accommodationToDestinationType
        },
        set(value) {
          this.$store.commit('updateAccommodationToDestinationType', value)
        },
      },
      accommodationToDestinationAmount: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.accommodationToDestinationAmount
        },
        set(value) {
          if (isNaN(parseFloat(value))) { value = 0 }
          this.$store.commit('updateAccommodationToDestinationAmount', parseFloat(value))
        },
      },
      originToHomeType: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.originToHomeType
        },
        set(value) {
          this.$store.commit('updateOriginToHomeType', value)
        },
      },
      originToHomeAmount: {
        get() {
          return this.$store.state.estimate.groundTransportation.lineItems.originToHomeAmount
        },
        set(value) {
          if (isNaN(parseFloat(value))) { value = 0 }
          this.$store.commit('updateOriginToHomeAmount', parseFloat(value))
        },
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>