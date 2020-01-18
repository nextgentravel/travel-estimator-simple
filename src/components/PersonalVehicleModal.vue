<template>
  <div class="modal" role="dialog" tabindex="-1" style="display: block;">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">How many kilometres will you travel?</h5>
          <button @click="showPersonalVehicleModal = false" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="margin-top: 10px;">
            <form class="form-inline">
                <input @input="calculate" class="form-control" v-model="kilometres" style="width: 7em;" />
                <span style="padding: .5em;">
                    kilometres in your vehicle registered in
                </span>
                <select @change="calculate" id="inputState" class="form-control" v-model="selectedRate">
                    <option v-for="(value, name) in personalVehicle.rates" v-bind:key="name" v-bind:value="value">{{name}}</option>
                </select>
                <span style="padding: .5em;">at <strong>{{selectedRate}} cents</strong> per kilometre</span>
            </form>
        </div>
        <div class="modal-footer">
          <div>
            <div style="margin-bottom: 10px;">${{amount.toFixed(2)}}</div>
            <button type="button" class="btn btn-primary" @click="showPersonalVehicleModal = false">Done</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PersonalVehicleModal',
    mounted() {},
    methods: {
        calculate() {
            this.amount = (this.kilometres * (this.selectedRate / 100));
        }
    },
    computed: {
      amount: {
        get() {
          return this.$store.state.estimate.personalVehicle.amount
        },
        set(value) {
          this.$store.commit('updatePersonalVehicleAmount', value)
        }
      },
      kilometres: {
        get() {
          return this.$store.state.estimate.personalVehicle.kilometres
        },
        set(value) {
          this.$store.commit('updatePersonalVehicleKilometres', value)
        }
      },
      selectedRate: {
        get() {
          return this.$store.state.estimate.personalVehicle.selectedRate
        },
        set(value) {
          this.$store.commit('updatePersonalVehicleRate', value)
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
      personalVehicle: {
        get() {
          return this.$store.state.estimate.personalVehicle
        },
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>