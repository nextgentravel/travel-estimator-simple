<template>
  <div>
    <br>
    <div v-if="loading">
      <div class="spinner"></div>
      Loading Domestic Cities
    </div>
    <div v-else>
      <div class="row">
        <div class="col-sm-4">
          <div class="form-group">
            <label for="originInput" class="">From</label>
            <autocomplete aria-label="Origin" :search="originSearch"
              :get-result-value="getOriginValue">
            </autocomplete>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="form-group">
            <label for="destinationInput" class="">To</label>
            <autocomplete aria-label="Destination" :search="destinationSearch"
              :get-result-value="getDestinationValue">
            </autocomplete>
          </div>
        </div>
        <div class="col-sm-4">
        </div>
      </div>
      <div class="row">
        <div class="col-sm-2">
          <div class="form-group">
            <label for="destinationInput" class="">Departing</label>
            <datetime input-class="form-control" v-model="departDate" value-zone="local" zone="local" auto>
            </datetime>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="form-group">
            <label for="destinationInput" class="">Returning</label>
            <datetime input-class="form-control" v-model="returnDate" value-zone="local" zone="local" auto>
            </datetime>
          </div>
        </div>
        <div class="col-sm-8">
        </div>
      </div>

      <div class="form-group">
        <label for="purposeInput" class="">Purpose of Trip (optional)</label>
        <div class="form-check">
          <input v-model="training" class="form-check-input" type="checkbox" value="" id="training">
          <label class="form-check-label" for="training">
            Training
          </label>
        </div>
        <div class="form-check">
          <input v-model="conference" class="form-check-input" type="checkbox" value="" id="conference">
          <label class="form-check-label" for="conference">
            Conference
          </label>
        </div>
      </div>

      <div class="form-group">
        <button class="btn btn-primary" v-on:click="submitTrip">Create Estimate</button>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'TripSelector',
    data: function () {
      return {
        today: moment().format("D/M/YYYY"),
        cityLookup: {},
        loading: false,
        currentOriginValue: "",
        currentDestinationValue: "",
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      submitTrip: function () {
        let destination = this.currentDestinationValue;
        let origin = this.currentOriginValue;
        this.$store.commit('updateOrigin', origin)
        this.$store.commit('updateDestination', destination)
        let city = this.cityLookup[destination.slice(0, -3)] || destination;
        let uri = `https://acrd-api.herokuapp.com/${encodeURI(city.replace('/','sss'))}/rules`
        console.log(uri)
        fetch(uri)
          .then(response => response.json())
          .then(data => {
            this.haveResult = true
            this.$store.commit('updateAcrdResponse', data)
            this.$router.push({ path: 'calculate' })
          })
        
      },
      fetchData() {
        this.error = this.post = null
        this.loading = true
        fetch('https://acrd-api.herokuapp.com/cities')
          .then(response => response.json())
          .then(data => {
            this.loading = false
            this.$store.commit('updateCity', data.citiesList)
            this.cityLookup = data.suburbCityList
          })
      },
      originSearch(input) {
        if (input.length < 1) {
          return []
        }
        return this.cities.filter(city => {
          return city.toLowerCase()
            .startsWith(input.toLowerCase())
        })
      },
      destinationSearch(input) {

        if (input.length < 1) {
          return []
        }
        return this.cities.filter(city => {
          return city.toLowerCase()
            .startsWith(input.toLowerCase())
        })
      },
      getOriginValue(result) {
        this.currentOriginValue = result;
        return result
      },
      getDestinationValue(result) {
        this.currentDestinationValue = result;
        return result
      },
    },
    computed: {
      training: {
        get() {
          return this.$store.state.training
        },
        set(value) {
          this.$store.commit('updateTraining', value)
        }
      },
      conference: {
        get() {
          return this.$store.state.conference
        },
        set(value) {
          this.$store.commit('updateConference', value)
        }
      },
      cities: {
        get() {
          return this.$store.state.cities
        },
        set(value) {
          this.$store.commit('updateCity', value)
        }
      },
      origin: {
        get() {
          return this.$store.state.origin
        },
        set(value) {
          this.$store.commit('updateOrigin', value)
        }
      },
      destination: {
        get() {
          return this.$store.state.destination
        },
        set(value) {
          this.$store.commit('updateDestination', value)
        }
      },
      departDate: {
        get() {
          return this.$store.state.departDate
        },
        set(value) {
          this.$store.commit('updateDepartDate', value)
        }
      },
      returnDate: {
        get() {
          return this.$store.state.returnDate
        },
        set(value) {
          this.$store.commit('updateReturnDate', value)
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .spinner {
    width: 40px;
    height: 40px;
    margin: 10px auto;
    background-color: #333;

    border-radius: 100%;
    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
    animation: sk-scaleout 1.0s infinite ease-in-out;
  }

  @-webkit-keyframes sk-scaleout {
    0% {
      -webkit-transform: scale(0)
    }

    100% {
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  }

  @keyframes sk-scaleout {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }

    100% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
      opacity: 0;
    }
  }
</style>