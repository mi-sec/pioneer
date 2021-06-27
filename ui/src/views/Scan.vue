<template>
    <v-container
        v-if="scan"
        fluid
        ma-0
        pa-0
    >
        <v-toolbar dense class="primary">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        @click="downloadReport"
                    >
                        <v-icon>mdi-download</v-icon>
                    </v-btn>
                </template>
                <span>Download Report</span>
            </v-tooltip>
        </v-toolbar>

        <div id="report">
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
        </div>

    </v-container>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import SummaryBlock                             from '@/components/scanPage/SummaryBlock';
import PerformanceBlock                         from '@/components/scanPage/PerformanceBlock';

import JSPdf       from 'jspdf';
import html2canvas from 'html2canvas';

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
    },
    methods: {
        ...mapActions( 'scan', [ 'getScan' ] ),
        ...mapMutations( 'scan', [ 'setCurrentScan' ] ),
        getCategoriesForScan() {
            return Object.keys( this.scan.data.auditReport.categories );
        },
        async downloadReport() {
            console.log( 'here', this.scan );

            const w = document.getElementById( 'report' ).offsetWidth;
            const h = document.getElementById( 'report' ).offsetHeight;
            // const h = '100%';
            console.log( w, h );
            const canvas = await html2canvas( document.getElementById( 'report' ), {
                dpi: 300,
                scale: 3,
                // height: '100%',
                // width: '100%'
            } );

            const img = canvas.toDataURL( 'image/jpeg', 1 );
            const doc = new JSPdf( 'L', 'px', [ w, h ] );
            console.log( img, doc );
            doc.addImage( img, 'JPEG', 0, 0, w, h );
            doc.save( 'sample-file.pdf' );

            // const domElement = document.getElementById( 'report' );
            // const pdf        = new JSPdf();
            // console.log( domElement );
            // pdf.html( domElement, {
            //     html2canvas: html2canvas,
            //     pageSize: 'a4',
            //     callback: doc => {
            //         console.log( 'x ' );
            //         doc.save( 'your-filename.pdf' );
            //     }
            // } );
        }
    }
};
</script>

<style>
@media print {
    div {
        page-break-inside: avoid;
    }
}
</style>
