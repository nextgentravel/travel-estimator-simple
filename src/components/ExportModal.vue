<template>
  <div class="modal" role="dialog" tabindex="-1" style="display: block;">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Please provide some additional details for your estimate</h5>
          <button @click="showExportModal = false" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="margin-top: 10px;">
          <form>
            <div class="form-group">
              <label for="userName">Your Name</label>
              <input type="text" class="form-control" id="userName" placeholder="Enter your name">
            </div>
            <div class="form-group">
              <label for="tripName">Trip Name</label>
              <input type="text" class="form-control" id="tripName" placeholder="Enter a name for this trip">
            </div>
            <div class="form-group">
              <label for="tripType">Trip Type</label>
                <select @change="setTripType" v-model="tripType" id="tripType" class="form-control">
                  <option>Conference</option>
                  <option>Core Mandate</option>
                  <option>Stakeholder</option>
                  <option>Training</option>
                </select>
            </div>

            <div class="form-group">
              <label for="tripWhy">Why are you going on this trip?</label>
              <textarea class="form-control" id="tripWhy" rows="3"></textarea>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <div>
            <button type="button" class="btn btn-primary" @click="showExportModal = false">Create PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'ExportModal',
    mounted() {},
    data: function () {
      return {
        moment
      }
    },
    methods: {},
    computed: {
      showExportModal: {
        get() {
          return this.$store.state.showExportModal
        },
        set(value) {
          this.$store.commit('updateShowExportModal', value)
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>