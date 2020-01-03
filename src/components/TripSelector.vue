<template>
  <div>
    <Header />
    <div class="container">
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
              <autocomplete
                aria-label="Origin"
                ref="origin"
                :search="originSearch"
                :get-result-value="getOriginValue"
                :default-value="origin"
              >
              </autocomplete>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label for="destinationInput" class="">To</label>
              <autocomplete 
                aria-label="Destination"
                ref="destination"
                :search="destinationSearch"
                :get-result-value="getDestinationValue"
                :default-value="destination"
                >
              </autocomplete>
            </div>
          </div>
          <div class="col-sm-4">
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="destinationInput" class="">Dates</label><br>
                <div class="datepicker-trigger">
                  <button class="btn btn-secondary btn-sm" id="datepicker-trigger">
                    {{formatDates(departDate, returnDate)}}
                  </button>
                  <AirbnbStyleDatepicker
                    :trigger-element-id="'datepicker-trigger'"
                    :mode="'range'"
                    :fullscreen-mobile="true"
                    :date-one="this.departDate"
                    :date-two="this.returnDate"
                    @date-one-selected="val => { this.departDate = val }"
                    @date-two-selected="val => { this.returnDate = val }"
                  />
                </div>

            </div>
          </div>
          <div class="col-sm-8">
          </div>
        </div>

        <div class="form-group">
          <button class="btn btn-primary" v-on:click="submitTrip">Create Estimate</button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
  import moment from 'moment'
  import Header from './Header'
  import Footer from './Footer'
  export default {
    name: 'TripSelector',
    components: {
      Header,
      Footer,
    },
    data: function () {
      return {
        today: moment().format("MMM DD, YYYY"),
        cityLookup: {},
        loading: false,
        dateOne: '',
        dateTwo: '',
      }
    },
    mounted() {
      this.fetchData()
      this.departDate = moment().format('YYYY-MM-DD');
      this.returnDate = moment().add(5, 'days').format('YYYY-MM-DD');
      this.$refs.origin.setValue(this.origin)
      this.$refs.destination.setValue(this.destination)
    },
    methods: {
      formatDates(dateOne, dateTwo) {
        dateOne = moment(dateOne).format('D MMM')
        dateTwo = moment(dateTwo).format('D MMM')
        return `${dateOne} - ${dateTwo}`
      },
      handleDateSelectorInput: function (e) {
        this.departDate = e.startDate
        this.returnDate = e.endDate
      },
      submitTrip: function () {
        let destination = this.currentDestinationValue;
        let origin = this.currentOriginValue;
        this.$store.commit('updateOrigin', origin)
        this.$store.commit('updateDestination', destination)
        let city = this.cityLookup[destination] || destination;
        let uri = `https://acrd-api.herokuapp.com/${city.replace('/','sss')}/rules`
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
      normalizeString(string) {
        return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      },
      originSearch(input) {
        if (input.length < 1) {
          return []
        }
        return this.cities.filter(city => {
          return this.normalizeString(city).toLowerCase()
            .startsWith(input.toLowerCase())
        })
      },
      destinationSearch(input) {
        if (input.length < 1) {
          return []
        }
        return this.cities.filter(city => {
          return this.normalizeString(city).toLowerCase()
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