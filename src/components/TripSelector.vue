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
            <autocomplete
              aria-label="Origin"
              :search="originSearch"
              :get-result-value="getOriginValue"
              v-bind:default-value="origin"
            >
            </autocomplete>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="form-group">
            <label for="destinationInput" class="">To</label>
            <autocomplete 
              aria-label="Destination"
              :search="destinationSearch"
              :get-result-value="getDestinationValue"
              v-bind:default-value="destination"
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
            <date-range-picker
                id="destinationInput"
                :opens="opens"
                @update="handleDateSelectorInput"
                :locale-data="locale"
                v-model="dateRange"
                :ranges="ranges"
                :autoApply="true"
            >
            </date-range-picker>
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
</template>

<script>
  import moment from 'moment'
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
  export default {
    name: 'TripSelector',
    components: { DateRangePicker },
    data: function () {
      return {
        today: moment().format("MMM DD, YYYY"),
        cityLookup: {},
        loading: false,
        currentOriginValue: "",
        currentDestinationValue: "",        
        opens: 'right',
        dateRange: {
            startDate: moment(),
            endDate: moment().add(7, 'days'),
        },
        ranges: false,
        locale: {
            direction: 'ltr', //direction of text
            format: 'MMM D, YYYY', //fomart of the dates displayed
            separator: ' - ', //separator between the two ranges
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: moment.weekdaysMin(), //array of days - see moment documenations for details
            monthNames: moment.monthsShort(), //array of month names - see moment documenations for details
            firstDay: 1 //ISO first day of week - see moment documenations for details
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleDateSelectorInput: function (e) {
        console.log(e)
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