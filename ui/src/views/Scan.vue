<template>
    <v-container
        v-if="scan"
        fluid
        ma-0
        pa-0
    >
        <v-sheet
            height="64"
            width="100%"
        ></v-sheet>

        <SummaryBlock
            id="summary"
            :scan="scan"
            class="secondary pa-3"
        />

        <v-layout
            justify-center
            class="secondary"
            pa-3
        >
            <v-flex xs12>
                <PerformanceBlock
                    id="performance"
                    :scan="scan"
                />
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import SummaryBlock                             from '@/components/scanPage/SummaryBlock';
import PerformanceBlock                         from '@/components/scanPage/PerformanceBlock';

export default {
    name: 'Scan',
    components: {
        PerformanceBlock,
        SummaryBlock
    },
    data() {
        return {
            id: null,
            screenshot: null
        };
    },
    computed: {
        ...mapGetters( 'scan', {
            scan: 'getCurrentScan'
        } )
    },
    async mounted() {
        this.id = this.$route.params._id;

        await this.getScan( this.id );
        this.setCurrentScan( this.id );

        // const screenshot = this.scan.data.plugins.find( plugin => plugin.module === 'screenshot' );
        //
        // if ( screenshot ) {
        // 	this.screenshot = screenshot.apiPath;
        // }
    },
    methods: {
        ...mapActions( 'scan', [ 'getScan' ] ),
        ...mapMutations( 'scan', [ 'setCurrentScan' ] ),
        getCategoriesForScan() {
            return Object.keys( this.scan.data.auditReport.categories );
        }
    }
};
</script>

<style>
</style>
