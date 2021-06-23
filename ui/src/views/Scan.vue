<template>
    <v-container
        v-if="scan"
        fluid
        ma-0
        pa-0
    >
        <ScanSidebar/>

        <SummaryBlock
            id="summary"
            :scan="scan"
        />

        <PerformanceBlock
            id="performance"
            :scan="scan"
        />

        <SecurityBlock
            id="security"
            :scan="scan"
        />

        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
// import SecurityInfoCard                         from '@/components/scanPage/SecurityInfoCard';
import ScanSidebar                              from '@/components/ScanSidebar';
import SummaryBlock                             from '@/components/scanPage/SummaryBlock';
import SecurityBlock                            from '@/components/scanPage/SecurityBlock';
import PerformanceBlock                         from '@/components/scanPage/PerformanceBlock';

export default {
    name: 'Scan',
    components: {
        PerformanceBlock,
        SecurityBlock,
        SummaryBlock,
        ScanSidebar
        // SecurityInfoCard
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
