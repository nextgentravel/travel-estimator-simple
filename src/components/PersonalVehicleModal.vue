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

        </div>
        <div class="modal-footer">
          <div>
            <!-- <div style="margin-bottom: 10px;">${{mealsAndIncidentalsAmount.toFixed(2)}}</div> -->
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
    methods: {},
    computed: {
      showPersonalVehicleModal: {
        get() {
          return this.$store.state.showPersonalVehicleModal
        },
        set(value) {
          this.$store.commit('updateShowPersonalVehicleModal', value)
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>