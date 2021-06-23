<template>
    <v-card>
        <v-card-title
            primary-title
            :class="scan.data.response.securityState === 'secure' ? 'green' : 'red'"
        >
            <div>
                <h3 class="mb-0 white--text">Security</h3>

                <span class="font-weight-bold">security state: </span>
                <v-btn
                    small
                    dark
                >
                    {{ scan.data.response.securityState }}
                </v-btn>
                <br/>
            </div>
        </v-card-title>

        <v-card-text>
            <div v-if="scan.data.response.securityDetails">
                <span class="font-weight-bold">Connection:</span>
                <ul>
                    <li>
                        <span class="font-weight-bold">Protocol: </span>
                        <code>{{ scan.data.response.securityDetails.protocol }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">Key exchange: </span>
                        <code>{{ scan.data.response.securityDetails.keyExchange }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">Key exchange group: </span>
                        <code>{{ scan.data.response.securityDetails.keyExchangeGroup }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">Cipher: </span>
                        <code>{{ scan.data.response.securityDetails.cipher }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">Cipher Suite: </span>
                        <code>{{ scan.data.response.securityDetails.cipherSuite }}</code>
                    </li>
                </ul>

                <br/>

                <span class="font-weight-bold">Certificate:</span>
                <ul>
                    <li>
                        <span class="font-weight-bold">Subject: </span>
                        <code>{{ scan.data.response.securityDetails.subjectName }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">SAN: </span>
                        <code>{{ scan.data.response.securityDetails.sanList }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">Valid from: </span>
                        <code>{{ scan.data.response.securityDetails.validFrom }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">Valid to: </span>
                        <code>{{ scan.data.response.securityDetails.validTo }}</code>
                    </li>
                    <li>
                        <span class="font-weight-bold">Issuer: </span>
                        <code>{{ scan.data.response.securityDetails.issuer }}</code>
                    </li>
                </ul>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'SecurityInfoCard',
    props: {
        scan: Object
    },
    data() {
        return {};
    },
    async mounted() {
    }
};
</script>

<style>
</style>
