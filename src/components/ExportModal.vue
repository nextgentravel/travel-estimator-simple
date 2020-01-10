<template>
  <div class="modal" role="dialog" tabindex="-1" style="display: block;">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Please provide some additional details for your request</h5>
          <button @click="showExportModal = false" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="margin-top: 10px;">
          <form>
            <div class="form-group">
              <label for="userName">Traveller's Name</label>
              <input v-model="userName" type="text" class="form-control" id="userName" placeholder="Enter traveller's name">
            </div>
            <div class="form-group">
              <label for="tripName">Trip Name</label>
              <input v-model="tripName" type="text" class="form-control" id="tripName" placeholder="Enter a name for this trip">
            </div>
            <div class="form-group">
              <label for="tripCategory">Travel Category</label>
                <select v-model="tripCategory" id="tripCategory" class="form-control">
                  <option>Conference</option>
                  <option>Core Mandate</option>
                  <option>Stakeholder</option>
                  <option>Training</option>
                </select>
            </div>

            <div class="form-group">
              <label for="tripWhy">Additional Information (Rationale for travel)</label>
              <textarea v-model="tripWhy" class="form-control" id="tripWhy" rows="3"></textarea>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <div>
            <button type="button" class="btn btn-primary" @click="goToPrint()">Create</button>
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
    methods: {
      goToPrint: function() {
        this.showExportModal = false
        this.$router.push({ path: 'print' })
      }
    },
    computed: {
      showExportModal: {
        get() {
          return this.$store.state.showExportModal
        },
        set(value) {
          this.$store.commit('updateShowExportModal', value)
        }
      },
      userName: {
        get() {
          return this.$store.state.userName
        },
        set(value) {
          this.$store.commit('updateUserName', value)
        }
      },
      tripName: {
        get() {
          return this.$store.state.tripName
        },
        set(value) {
          this.$store.commit('updateTripName', value)
        }
      },
      tripCategory: {
        get() {
          return this.$store.state.tripCategory
        },
        set(value) {
          this.$store.commit('updatetripCategory', value)
        }
      },
      tripWhy: {
        get() {
          return this.$store.state.tripWhy
        },
        set(value) {
          this.$store.commit('updateTripWhy', value)
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>