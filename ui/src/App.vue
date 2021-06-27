<template>
    <v-app>
        <v-app-bar
            app
            flat
        >
            <v-container class="py-0 fill-height">
                <v-btn
                    class="mr-5"
                    color="white"
                    to="/"
                    text
                >
                    Home
                </v-btn>

                <v-spacer></v-spacer>

            </v-container>
        </v-app-bar>

        <v-main>
            <v-container fluid ma-0 pa-0>
                <v-snackbar
                    v-model="snackbarMessage.isOpen"
                    top
                    timeout="3000"
                >
                    {{ snackbarMessage.text }}

                    <template v-slot:action="{ attrs }">
                        <v-btn
                            :color="snackbarMessage.color || 'error'"
                            text
                            v-bind="attrs"
                            @click="snackbarMessage.isOpen = false"
                        >
                            <v-icon>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </template>
                </v-snackbar>

                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import routerPaths from '@/router/paths';

export default {
    name: 'App',
    data: () => ( {
        fab: false,
        links: routerPaths.map( ( { name, path } ) => ( { name, path } ) )
    } ),
    beforeCreate() {
        this.$installAxios();
        this.$installLogger();
        this.$installApi();
    },
    computed: {
        ...mapState( [ 'snackbarMessage' ] )
    },
    methods: {
        ...mapActions( [ 'loadApiConfig' ] )
    },
    async mounted() {
        await this.loadApiConfig();
    }
};
</script>
