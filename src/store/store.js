import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const initialState = {
    accommodationWarning: false,
    userName: '',
    tripName: '',
    tripCategory: '',
    tripWhy: '',
    showMealsModal: false,
    showExportModal: false,
    cities: [],
    origin: null,
    destination: null,
    departDate: '',
    returnDate: '',
    perDiem: {
        dailyRate: 0,
    },
    other: [
        { item: "", cost: "" }
    ],
    noteToApprover: "",
    acrdResponse: "",
    estimate: {
        accommodation: { selected: false, amount: null, type: "Hotel" },
        mealsAndIncidentals: { selected: false, amount: 0, type: ""},
        transportation: {
            selected: false,
            amount: 0,
        },
        taxi: {
            selected: false,
            amount: 0,
        },
        personalVehicle: {
            selected: false,
            amount: 0,
            rates: { 
                "AB": 47.5,
                "BC": 54.0,
                "MB": 50.5,
                "NB": 52.5,
                "NL": 56.0,
                "NT": 62.0,
                "NS": 52.5,
                "NU": 59.5,
                "ON": 56.5,
                "PE": 51.0,
                "QC": 53.5,
                "SK": 50.0,
                "YT": 61.0,
            },
            kilometres: 0,
            selectedRate: 56.5,
        },
        carRental: {
            selected: false,
            amount: 0,
        },
        parking: {
            selected: false,
            amount: 0,
        },
        other: { selected: false, amount: 0, description: ""},
    },
    training: false,
    conference: false,
    calculatedTotal: "-:--",
    tripRates: {},
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
  }


export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: initialState,
  mutations: {

    updateAccommodationWarning (state, accommodationWarning) {
        state.accommodationWarning = accommodationWarning
    },
    updateUserName (state, userName) {
        state.userName = userName
    },
    updateTripName (state, tripName) {
        state.tripName = tripName
    },
    updatetripCategory (state, tripCategory) {
        state.tripCategory = tripCategory
    },
    updateTripWhy (state, tripWhy) {
        state.tripWhy = tripWhy
    },
    updateShowExportModal (state, showExportModal) {
        state.showExportModal = showExportModal
    },
    updateShowMealsModal (state, showMealsModal) {
        state.showMealsModal = showMealsModal
    },
    updateTripRates (state, tripRates) {
        state.tripRates = tripRates
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
    updateAccommodationRate (state, accomodationRate) {
        state.estimate.accommodation.rate = accomodationRate
    },
    updateNumberOfDays (state, numberOfDays) {
        state.estimate.accommodation.numberOfDays = numberOfDays
    },
    updateMealsAndIncidentalsSelected (state, mealsAndIncidentalsSelected) {
        state.estimate.mealsAndIncidentals.selected = mealsAndIncidentalsSelected
    },
    updateTransportationSelected (state, transportationSelected) {
        state.estimate.transportation.selected = transportationSelected
    },
    updateTaxiSelected (state, taxiSelected) {
        state.estimate.taxi.selected = taxiSelected
    },
    updatePersonalVehicleSelected (state, personalVehicleSelected) {
        state.estimate.personalVehicle.selected = personalVehicleSelected
    },
    updateCarRentalSelected (state, carRentalSelected) {
        state.estimate.carRental.selected = carRentalSelected
    },
    updateParkingSelected (state, parkingSelected) {
        state.estimate.parking.selected = parkingSelected
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
    updateTaxiAmount (state, taxiAmount) {
        state.estimate.taxi.amount = taxiAmount
    },
    updatePersonalVehicleAmount (state, personalVehicleAmount) {
        state.estimate.personalVehicle.amount = personalVehicleAmount
    },
    updatePersonalVehicleRate (state, personalVehicleSelectedRate) {
        state.estimate.personalVehicle.selectedRate = personalVehicleSelectedRate
    },
    updatePersonalVehicleKilometres (state, personalVehicleKilometres) {
        state.estimate.personalVehicle.kilometres = personalVehicleKilometres
    },
    updateCarRentalAmount (state, carRentalAmount) {
        state.estimate.carRental.amount = carRentalAmount
    },
    updateParkingAmount (state, parkingAmount) {
        state.estimate.parking.amount = parkingAmount
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
    updateNoteToApprover (state, noteToApprover) {
        state.noteToApprover = noteToApprover
    },
  },
  
  actions: {
  }
});