<template>
    <v-container
        v-if="groups"
        class="ma-0 pa-0"
        fluid
    >
        <CryptographyInfoCard
            class="ma-4"
            :scan="scan"
        />

        <v-card
            class="ma-4"
            v-for="n in groups.keys()"
            :key="n"
        >
            <v-card-title class="font-weight-bold">
                {{ n }}
            </v-card-title>

            <v-card-text>
                <v-simple-table dense>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-left">Title</th>
                            <th class="text-left">Value</th>
                            <th class="text-left">Score</th>
                            <th class="text-left">Weight</th>
                        </tr>
                        </thead>
                        <tbody
                            v-if="groups.has( n )"
                        >
                        <tr
                            v-for="g in groups.get( n ).keys()"
                            :key="g"
                        >
                            <td>
                                {{
                                    groups.get( n ).get( g ).scoreDisplayMode === 'notApplicable' ?
                                        '[Not Applicable]' :
                                        ''
                                }}
                                {{ groups.get( n ).get( g ).title }} ({{ groups.get( n ).get( g ).acronym }})
                            </td>
                            <td>{{ groups.get( n ).get( g ).displayValue }}</td>
                            <td>{{ ~~( groups.get( n ).get( g ).score * 10000 ) / 100 }}%</td>
                            <td>{{ groups.get( n ).get( g ).weight }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import LightMap             from '@mi-sec/lightmap';
import CryptographyInfoCard from '@/components/scanPage/CryptographyInfoCard';

export default {
    name: 'PerformanceBlock',
    components: {
        CryptographyInfoCard
    },
    props: {
        scan: Object
    },
    data() {
        return {
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

        console.log( '[PerformanceBlock]', this.groups );

        this.audits.auditRefs = this.audits.auditRefs.map(
            ref => ( {
                ...ref,
                ...this.scan.data.auditReport.audits[ ref.id ]
            } )
        );

        console.log( '[PerformanceBlock]', this.audits.auditRefs );
    },
    methods: {}
};
</script>

<style>
</style>
