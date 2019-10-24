<template>
  <div id="app">
    <div v-if="showCalculator">
      <Calculator />
    </div>
    <div v-else>
      <TripSelector />
    </div>

  </div>
</template>

<script>
import Calculator from './components/Calculator.vue'
import TripSelector from './components/TripSelector.vue'

export default {
  name: 'app',
  components: {
    Calculator,
    TripSelector
  },
  computed: {
    showCalculator () {
      return this.$store.state.showCalculator
    },
  }
}
</script>

<style>
</style>
