<template>
    <v-card>
        <v-img
            v-if="screenshot"
            :src="screenshot"
            class="elevation-4"
            aspect-ratio="2.0"
            max-height="400px"
            contain
        />

        <v-card-title primary-title class="success">
            <div>
                <h3 class="mb-0">
                    <a :href="scan.data.url" class="white--text">
                        {{ scan.data.url }}
                    </a>
                </h3>
                <span class="overline">ID: {{ scan._id }}</span><br/>
                <span class="overline">Created: {{ scan.createdAt }}</span>
            </div>
        </v-card-title>

        <v-card-text>
            <span class="font-weight-bold">Type: </span>
            <span>{{ scan.data.type }}</span><br/>

            <span class="font-weight-bold">Mime-Type: </span>
            <span>{{ scan.data.response.mimeType }}</span><br/>

            <v-divider class="mt-2 mb-2"/>

            <span class="font-weight-bold">Protocol: </span>
            <code>{{ scan.data.response.protocol }}</code><br/>

            <span class="font-weight-bold">Remote Address: </span>
            <code>{{ scan.data.response.remoteIPAddress }}</code><br/>

            <span class="font-weight-bold">Remote Port: </span>
            <code>{{ scan.data.response.remotePort }}</code><br/>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'SummaryCard',
    props: {
        scan: Object
    },
    data() {
        return {
            screenshot: null
        };
    },
    async mounted() {
        console.log( '[SummaryCard]', this.scan );
        const screenshot = this.scan.data.plugins.find( plugin => plugin.module === 'screenshot' );

        if ( screenshot ) {
            this.screenshot = new URL( screenshot.apiPath, this.$api.getBaseUrl() ).toString();
            console.log( this.screenshot );
        }
    }
};
</script>

<style>
</style>
