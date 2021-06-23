<template>
    <v-app>
        <v-app-bar
            app
            flat
            color="dark"
        >
            <v-img
                class="mx-2"
                src="AWS_LOGO_ALL/SVG/AWS_logo_RGB_REV.svg"
                max-height="48"
                max-width="48"
                contain
            ></v-img>

            <v-container class="py-0 fill-height">
                <v-btn
                    class="mr-5"
                    color="white"
                    v-for="link in links"
                    :key="link.name"
                    :to="link.path"
                    text
                >
                    {{ link.name }}
                </v-btn>

                <v-spacer></v-spacer>

                <v-responsive max-width="300">
                    <v-text-field
                        dense
                        flat
                        hide-details
                        rounded
                        solo-inverted
                        class="mr-5"
                    ></v-text-field>
                </v-responsive>

                <v-speed-dial
                    v-model="fab"
                    left
                    direction="bottom"
                    open-on-hover
                    transition="slide-y-reverse-transition"
                >
                    <template v-slot:activator>
                        <v-btn
                            v-model="fab"
                            color="secondary-orange"
                            elevation="0"
                            small
                            dark
                            fab
                        >
                            <v-icon v-if="fab">
                                mdi-close
                            </v-icon>
                            <v-icon v-else>
                                mdi-account-circle
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-btn
                        dark
                        small
                        color="success"
                    >
                        <v-icon>mdi-account-circle</v-icon>
                        Profile
                    </v-btn>
                    <v-btn
                        dark
                        small
                        color="indigo"
                    >
                        <v-icon>mdi-cog</v-icon>
                        Settings
                    </v-btn>
                    <v-btn
                        dark
                        small
                        color="red"
                    >
                        <v-icon>mdi-logout</v-icon>
                        Logout
                    </v-btn>
                </v-speed-dial>

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
