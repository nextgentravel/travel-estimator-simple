<template>
    <div class="container">
        <br>
        <h2>{{store.origin.slice(0,-3)}} to {{store.destination.slice(0,-3)}}, {{dateFormat()}}</h2>
        <h4>{{store.userName}} - {{store.tripName}}</h4>
        <h5>{{store.tripType}}</h5>
        <p>{{store.tripWhy}}</p>
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
                    <td>${{this.store.estimate.accommodation.amount}}</td>
                </tr>
                <tr>
                    <td scope="row">
                        <div><strong>Meals and Incidentals</strong></div>
                        <div><small>For <strong>{{this.store.mealsByDay.length}}</strong> days</small></div>
                    </td>
                    <td>${{this.store.estimate.mealsAndIncidentals.amount}}</td>
                </tr>
                <tr>
                    <td scope="row"><strong>Transportation</strong></td>
                    <td>${{this.store.estimate.transportation.amount}}</td>
                </tr>
                <tr>
                    <td scope="row"><strong>Ground Transportation</strong></td>
                    <td>${{this.store.estimate.groundTransportation.amount}}</td>
                </tr>
                <tr v-if="this.store.estimate.selected">
                    <td scope="row">
                        <div><strong>Other</strong></div>
                        <div><small>{{this.store.estimate.other.description}}</small></div>
                    </td>
                    <td>${{this.store.estimate.other.amount}}</td>
                </tr>
                <tr>
                    <td scope="row">Total</td>
                    <td>${{this.store.calculatedTotal}}</td>
                </tr>
            </tbody>
        </table>

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
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>