<template>
    <v-layout
        justify-center
        class="secondary"
        pa-3
    >
        <v-flex xs12>
            <v-card>
                <v-card-title
                    class="font-weight-bold"
                >
                    Performance
                </v-card-title>

                <v-card-text>
                    <v-tabs
                        v-model="active"
                        v-if="groups"
                        color="purple"
                        fixed-tabs
                        grow
                        dark
                    >
                        <v-tab
                            v-for="n in groups.keys()"
                            :key="n"
                            ripple
                        >
                            {{ n }}
                        </v-tab>
                        <v-tab-item
                            v-for="n in groups.keys()"
                            :key="n"
                        >
                            <v-flex xs12>
                                <v-container grid-list-xl fluid>
                                    <v-layout wrap row>
                                        <v-flex
                                            v-for="auditName in groups.get( n ).keys()"
                                            :key="auditName"
                                            xs12 sm6 md4
                                        >
                                            <v-card>
                                                <v-card-title xs12>
                                                    {{ groups.get( n ).get( auditName ).title }}

                                                    <!--<v-icon v-on="on" right>-->
                                                    <!--	mdi-help-circle-outline-->
                                                    <!--</v-icon>-->
                                                    <!--{{ groups.get( n ).get( auditName ).description }}-->
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-layout wrap row>
                                                        <v-flex xs4>
                                                            Weight: {{ groups.get( n ).get( auditName ).weight }}
                                                        </v-flex>
                                                        <v-flex xs4>
                                                            Time: {{ groups.get( n ).get( auditName ).displayValue }}
                                                        </v-flex>
                                                        <v-flex xs4>
                                                            Score: {{ groups.get( n ).get( auditName ).score * 100 }}%
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-text>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-flex>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import LightMap from '@mi-sec/lightmap';

export default {
    name: 'PerformanceBlock',
    components: {},
    props: {
        scan: Object
    },
    data() {
        return {
            active: null,
            cards: [
                { title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg' },
                { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg' },
                { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg' }
            ],
            groups: null,
            audits: null
        };
    },
    mounted() {
        this.groups = new LightMap();
        this.audits = { ...this.scan.data.auditReport.categories.performance };

        this.audits.auditRefs = this.audits.auditRefs.sort(
            ( a, b ) => b.weight - a.weight
        );

        this.audits.auditRefs.forEach(
            ref => {
                if ( !ref.group ) {
                    ref.group = 'misc';
                }

                if ( !this.groups.has( ref.group ) ) {
                    this.groups.set( ref.group, new LightMap() );
                }

                this.groups.get( ref.group ).set( ref.id, {
                    ...ref,
                    ...this.scan.data.auditReport.audits[ ref.id ]
                } );
            }
        );

        console.log( this.groups );

        this.audits.auditRefs = this.audits.auditRefs.map(
            ref => ( {
                ...ref,
                ...this.scan.data.auditReport.audits[ ref.id ]
            } )
        );

        console.log( this.audits.auditRefs );
    },
    methods: {}
};
</script>

<style>
</style>
