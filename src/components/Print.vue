<template>
    <div class="container">
        <br>
        <h2 class="mb-0">Travel Request for {{store.userName}}</h2>
        <p><small>Created on {{today}}</small></p>
        <h4>{{store.tripName}}</h4>
        <div>
            <strong>Details: </strong>
            {{store.origin.slice(0,-3)}} to {{store.destination.slice(0,-3)}}, {{dateFormat()}}
        </div>
        <div>
            <strong>Trip Purpose: </strong>
            {{store.tripCategory}}
        </div>
        <div>
            <strong>Rationale for Travel: </strong>
            {{store.tripWhy}}
        </div>
        <br>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Expense Item</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td scope="row">
                        <div><strong>Accommodations</strong></div>
                        <div><small><strong>{{this.store.estimate.accommodation.type}}</strong> at <strong>${{this.store.estimate.accommodation.rate}}</strong> per day</small></div>
                    </td>
                    <td>${{this.store.estimate.accommodation.amount.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td scope="row">
                        <div><strong>Meals and Incidentals</strong></div>
                        <div><small>For <strong>{{this.store.mealsByDay.length}}</strong> days</small></div>
                    </td>
                    <td>${{this.store.estimate.mealsAndIncidentals.amount.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td scope="row"><strong>Transportation</strong></td>
                    <td>${{this.store.estimate.transportation.amount.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td scope="row"><strong>Ground Transportation</strong></td>
                    <td>${{this.store.estimate.groundTransportation.amount.toFixed(2)}}</td>
                </tr>
                <tr v-if="this.store.estimate.selected">
                    <td scope="row">
                        <div><strong>Other</strong></div>
                        <div><small>{{this.store.estimate.other.description}}</small></div>
                    </td>
                    <td>${{this.store.estimate.other.amount.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td scope="row">Total</td>
                    <td>${{this.store.calculatedTotal}}</td>
                </tr>
            </tbody>
        </table>
        <p class="font-italic">
            I have access to the National Joint Council (NJC) Travel Directive and, if applicable, the Special Travel Authorities, and accept the terms and conditions of travel in accordance with these Directives.<br>
            {{store.userName}} - {{today}}
        </p>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {
        name: 'Print',
        mounted() {},
        data: function () {
            return {
                moment
            }
        },
        methods: {
            dateFormat: function() {
            let startMonth = moment(this.store.departDate).format('M');
            let endMonth = moment(this.store.returnDate).format('M');
            let startYear = moment(this.store.departDate).format('YYYY');
            let endYear = moment(this.store.returnDate).format('YYYY');
            if (startYear !== endYear) {
                return `${moment(this.store.departDate).format('D MMM YYYY')} - ${moment(this.store.returnDate).format('D MMM YYYY')}`
            } else if (startMonth === endMonth) {
                return `${moment(this.store.departDate).format('MMM D')} - ${moment(this.store.returnDate).format('D, YYYY')}`
            } else {
                return `${moment(this.store.departDate).format('MMM D')} - ${moment(this.store.returnDate).format('MMM D, YYYY')}`
            }
            },
        },
        computed: {
            store: {
                get() {
                    return this.$store.state
                },
            },
            today: {
                get() {
                    return moment().format('MMM D, YYYY')
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>