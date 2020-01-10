<template>
    <div>
    <PrintHeader />
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
                        <div><strong>Accommodations </strong>
                            <span v-if="this.store.estimate.accommodation.amount > totalAcrdRate">
                                <font-awesome-icon icon="exclamation-circle" />
                            </span>
                        </div>
                        <div v-if="this.store.estimate.accommodation.type === 'Private Accommodations'"><small><strong>{{this.store.estimate.accommodation.type}}</strong> at <strong>$50</strong> per day</small></div>
                        <div v-if="this.store.estimate.accommodation.type === 'Hotel'">
                            <small>
                                Hotel city rate limit for <strong>{{store.destination}}</strong> on these dates is <strong>${{this.store.estimate.accommodation.rate}} (${{totalAcrdRate}})</strong>.
                            </small>
                        </div>
                    </td>
                    <td>${{this.store.estimate.accommodation.amount.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td scope="row">
                        <div><strong>Meals and Incidentals</strong></div>
                        <div><small><strong>{{this.mealSummary.breakfast.count}}</strong> breakfasts at <strong>${{this.mealSummary.breakfast.rate}}</strong></small></div>
                        <div><small><strong>{{this.mealSummary.lunch.count}}</strong> lunchs at <strong>${{this.mealSummary.lunch.rate}}</strong></small></div>
                        <div><small><strong>{{this.mealSummary.dinner.count}}</strong> dinners at <strong>${{this.mealSummary.dinner.rate}}</strong></small></div>
                        <div><small><strong>{{this.mealSummary.incidental.count}}</strong> days of incidentals at <strong>${{this.mealSummary.incidental.rate}}</strong></small></div>
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
                <tr>
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
    </div>
</template>

<script>
    import moment from 'moment'
    import PrintHeader from './PrintHeader'
    export default {
        name: 'Print',
        components: {
            PrintHeader,
        },
        mounted() {
        },
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
            fileNameDate: {
                get() {
                    return moment().format('YYYY-MM-DD')
                }
            },
            totalAcrdRate: {
                get() {
                    return this.store.estimate.accommodation.numberOfDays * this.store.estimate.accommodation.rate
                }
            },
            mealSummary: {
                get() {
                    let result = {
                        breakfast: { count: 0, rate: this.$store.state.tripRates.breakfastRate },
                        lunch: { count: 0, rate: this.$store.state.tripRates.lunchRate },
                        dinner: { count: 0, rate: this.$store.state.tripRates.dinnerRate },
                        incidental: { count: 0, rate: this.$store.state.tripRates.incidentalRate },
                    }
                    this.store.mealsByDay.forEach(item => {
                        if (item.breakfast === true) {
                            result.breakfast.count++
                        }
                        if (item.lunch === true) {
                            result.lunch.count++
                        }
                        if (item.dinner === true) {
                            result.dinner.count++
                        }
                        if (item.incidental === true) {
                            result.incidental.count++
                        }
                    });
                    console.log('result', result)
                    return result
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>