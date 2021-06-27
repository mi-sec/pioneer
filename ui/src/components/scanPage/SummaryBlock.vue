<template>
    <v-layout>
        <v-flex xs12 sm12 md4>
            <SummaryCard
                :scan="scan"
            />
        </v-flex>

        <v-flex xs12 sm12 md8>
            <v-container grid-list-xl fluid>
                <v-layout row wrap>
                    <v-flex
                        v-for="key in getCategoriesForScan()"
                        :key="key"
                        xs12
                        sm6
                        md4
                    >
                        <StatsCard
                            :category="scan.data.auditReport.categories[ key ]"
                        />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-flex>

    </v-layout>
</template>

<script>
import SummaryCard from '@/components/scanPage/SummaryCard';
import StatsCard   from '@/components/StatsCard';

export default {
    name: 'SummaryBlock',
    components: {
        StatsCard,
        SummaryCard
    },
    props: {
        scan: Object
    },
    data() {
        return {};
    },
    methods: {
        getCategoriesForScan() {
            return Object.keys( this.scan.data.auditReport.categories );
        }
    }
};
</script>

<style>
</style>
