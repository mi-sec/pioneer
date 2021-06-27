<template>
    <v-navigation-drawer
        v-model="model"
        mini-variant
        permanent
        clipped
        absolute
        overflow
        app
    >
        <v-list class="pt-0" dense>
            <v-divider></v-divider>

            <!--			<v-list-tile-->
            <!--				v-for="item in items"-->
            <!--				:key="item.title"-->
            <!--				@click="item.click ? item.click( item ) : scrollTo( item.title )"-->
            <!--			>-->
            <!--				<v-tooltip-->
            <!--					nudge-right="15"-->
            <!--					open-delay="50"-->
            <!--					right-->
            <!--				>-->
            <!--					<template slot="activator" slot-scope="{ on }">-->
            <!--						<v-list-tile-action v-on="on">-->
            <!--							<v-icon>{{ item.icon }}</v-icon>-->
            <!--						</v-list-tile-action>-->
            <!--					</template>-->

            <!--					<v-list-tile-content>-->
            <!--						<v-list-tile-title>{{ item.title }}</v-list-tile-title>-->
            <!--					</v-list-tile-content>-->
            <!--				</v-tooltip>-->
            <!--			</v-list-tile>-->
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import html2canvas from 'html2canvas';
import JSPdf       from 'jspdf';

global.html2canvas = html2canvas;

export default {
    name: 'ScanSidebar',
    data() {
        return {
            model: null,
            items: [
                {
                    title: 'Download Report',
                    icon: 'mdi-file-download',
                    click: this.downloadReport
                },
                { title: 'Summary', icon: 'dashboard' },
                { title: 'Performance', icon: 'mdi-speedometer' }
            ]
        };
    },
    methods: {
        scrollTo( id ) {
            console.log( id );
            id = id.toLowerCase();
        },
        async downloadReport() {
            console.log( 'here' );

            const domElement = document.getElementById( 'summary' );
            const pdf        = new JSPdf();

            pdf.html( domElement, {
                html2canvas: html2canvas,
                pageSize: 'a4',
                callback: doc => {
                    console.log( 'x ' );
                    doc.save( 'your-filename.pdf' );
                }
            } );
        }
    }
};
</script>
