import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showMealsModal: false,
    cities: [],
    origin: null,
    destination: null,
    departDate: null,
    returnDate: null,
    perDiem: {
        dailyRate: 0,
    },
    other: [
        { item: "", cost: "" }
    ],
    noteToApprover: "",
    acrdResponse: "",
    estimate: {
        accommodation: { selected: false, amount: 0, type: "Hotel" },
        mealsAndIncidentals: { selected: false, amount: 0, type: ""},
        transportation: { selected: false, amount: 0},
        groundTransportation: { selected: false, amount: 0},
        other: { selected: false, amount: 0, description: ""},
    },
    training: false,
    conference: false,
    calculatedTotal: "-:--",
    mealsAndIncidentals: {
        YT: {
            breakfast: 22.75,
            lunch: 20.90,
            dinner: 60.25,
            incidentals: 17.30
        },
        TN: {
            breakfast: 24.15,
            lunch: 29.30,
            dinner: 62.70,
            incidentals: 17.30
        },
        NU: {
            breakfast: 27.35,
            lunch: 33.20,
            dinner: 88.45,
            incidentals: 17.30
        },
        CAN: {
            breakfast: 20.35,
            lunch: 20.60,
            dinner: 50.55,
            incidentals: 17.30
        },
    },
    mealsByDay: [],
  },
  
  mutations: {
    updateShowMealsModal (state, showMealsModal) {
        state.showMealsModal = showMealsModal
    },
    updateMealsByDay (state, mealsByDay) {
        state.mealsByDay = mealsByDay
    },
    updateOrigin (state, origin) {
        state.origin = origin
    },
    updateDestination (state, destination) {
        state.destination = destination
    },
    updateDepartDate (state, departDate) {
        state.departDate = departDate
    },
    updateReturnDate (state, returnDate) {
        state.returnDate = returnDate
    },
    updateCity (state, cities) {
        state.cities = cities
    },
    updateAcrdResponse (state, acrdResponse) {
        state.acrdResponse = acrdResponse
    },
    updateTraining (state, training) {
        state.training = training
    },
    updateConference (state, conference) {
        state.conference = conference
    },
    updateAccommodationSelected (state, accomodationSelected) {
        state.estimate.accommodation.selected = accomodationSelected
    },
    updateMealsAndIncidentalsSelected (state, mealsAndIncidentalsSelected) {
        state.estimate.mealsAndIncidentals.selected = mealsAndIncidentalsSelected
    },
    updateTransportationSelected (state, transportationSelected) {
        state.estimate.transportation.selected = transportationSelected
    },
    updateGroundTransportationSelected (state, groundTransportationSelected) {
        state.estimate.groundTransportation.selected = groundTransportationSelected
    },
    updateOtherSelected (state, otherSelected) {
        state.estimate.other.selected = otherSelected
    },
    updateOtherDescription (state, otherDescription) {
        state.estimate.other.description = otherDescription
    },
    updateOtherAmount (state, otherAmount) {
        state.estimate.other.amount = otherAmount
    },
    updateAccommodationAmount (state, accomodationAmount) {
        state.estimate.accommodation.amount = accomodationAmount
    },
    updateMealsAndIncidentalsAmount (state, mealsAndIncidentalsAmount) {
        state.estimate.mealsAndIncidentals.amount = mealsAndIncidentalsAmount
    },
    updateTransportationAmount (state, transportationAmount) {
        state.estimate.transportation.amount = transportationAmount
    },
    updateGroundTransportationAmount (state, groundTransportationAmount) {
        state.estimate.groundTransportation.amount = groundTransportationAmount
    },
    updateAccommodationType (state, accomodationType) {
        state.estimate.accommodation.type = accomodationType
    },
    updateMealsAndIncidentalsType (state, mealsAndIncidentalsType) {
        state.estimate.mealsAndIncidentals.type = mealsAndIncidentalsType
    },
    updateCalculatedTotal (state, calculatedTotal) {
        state.calculatedTotal = calculatedTotal
    },
    updateAccommodationTotal (state, accommodationTotal) {
        state.accommodationTotal = accommodationTotal
    },
  },
  
  actions: {
  }
});